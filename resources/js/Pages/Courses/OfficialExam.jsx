import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Check, X, Clock, FileText, RotateCcw, AlertTriangle, Eye, Lock, Play } from 'lucide-react';

// Toast خفيف بيظهر لحظة تصحيح كل سؤال
const answerToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
});

const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * السيرفر هو اللي بيمسك حالة الامتحان:
 * - activeAttempt: محاولة جارية (الوقت المتبقي + الإجابات اللي اتسجلت)
 * - الأسئلة مش بتوصل إلا بعد "ابدأ الامتحان" أو في وضع المراجعة
 * - الإجابة بتتقفل في السيرفر أول ما تتصحح
 */
export default function OfficialExam({
    exam,
    attempts,
    lastAttemptAnswers,
    enrolled,
    canAttempt,
    maxAttempts,
    activeAttempt,
}) {
    const questions = exam.questions || [];
    const isTaking = !!activeAttempt;
    const hasReview = !isTaking && Object.keys(lastAttemptAnswers || {}).length > 0;

    const [localChecked, setLocalChecked] = useState({});
    const [pending, setPending] = useState(null); // { questionId, optionId }
    const [submitting, setSubmitting] = useState(false);
    const [starting, setStarting] = useState(false);
    const [result, setResult] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const autoSubmitted = useRef(false);
    const warned = useRef(false);

    // نتيجة كل سؤال: أثناء الحل = اللي السيرفر سجّله + اللي اتصحح دلوقتي، وفي المراجعة = آخر محاولة
    const serverAnswers = activeAttempt?.answers || {};
    const resultsMap = hasReview ? lastAttemptAnswers || {} : { ...serverAnswers, ...localChecked };

    // كل ما تبدأ محاولة جديدة: نصفّر الحالة ونشغّل العدّاد من الوقت المتبقي اللي السيرفر حدده
    useEffect(() => {
        setLocalChecked({});
        setPending(null);
        autoSubmitted.current = false;
        warned.current = false;

        if (!activeAttempt || activeAttempt.remaining_seconds == null) {
            setTimeLeft(null);
            return undefined;
        }

        const deadline = Date.now() + activeAttempt.remaining_seconds * 1000;
        const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [activeAttempt?.id]);

    // تسليم تلقائي لما الوقت يخلص
    useEffect(() => {
        if (isTaking && timeLeft === 0 && !autoSubmitted.current) {
            autoSubmitted.current = true;
            performSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, isTaking]);

    // تنبيه قبل انتهاء الوقت بـ 30 ثانية
    useEffect(() => {
        if (isTaking && timeLeft !== null && timeLeft > 0 && timeLeft <= 30 && !warned.current) {
            warned.current = true;
            Swal.fire({
                icon: 'warning',
                title: 'وقت الامتحان يوشك على الانتهاء!',
                text: `تبقى ${timeLeft} ثانية فقط. سلّم إجاباتك الآن.`,
                timer: 5000,
                timerProgressBar: true,
            });
        }
    }, [timeLeft, isTaking]);

    const handleStart = () => {
        if (!canAttempt || starting) return;

        const begin = () => {
            setStarting(true);
            setResult(null);
            router.post(route('exams.start', exam.id), {}, {
                preserveScroll: true,
                onError: () =>
                    Swal.fire({ icon: 'error', title: 'حدث خطأ', text: 'تعذر بدء الامتحان، حاول مرة أخرى.' }),
                onFinish: () => setStarting(false),
            });
        };

        if (exam.duration_minutes) {
            Swal.fire({
                title: 'هل أنت جاهز؟',
                text: `مدة الامتحان ${exam.duration_minutes} دقيقة، وسيبدأ العدّ التنازلي فور الضغط على "ابدأ".`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'ابدأ',
                cancelButtonText: 'إلغاء',
                confirmButtonColor: '#1769AA',
                reverseButtons: true,
            }).then((r) => r.isConfirmed && begin());
        } else {
            begin();
        }
    };

    // تصحيح فوري: الإجابة بتتسجل وتتقفل في السيرفر
    const handleSelect = async (questionId, optionId) => {
        if (!isTaking || resultsMap[questionId] || pending || submitting) return;

        setPending({ questionId, optionId });

        try {
            const { data } = await axios.post(route('exams.check-answer', exam.id), {
                question_id: questionId,
                selected_option_id: optionId,
            });

            setLocalChecked((prev) => ({ ...prev, [questionId]: data }));

            answerToast.fire({
                icon: data.is_correct ? 'success' : 'error',
                title: data.is_correct ? 'إجابة صحيحة! 🎉' : 'إجابة خاطئة',
            });
        } catch (error) {
            const status = error.response?.status;

            if (status === 409 || status === 403) {
                Swal.fire({
                    icon: 'info',
                    title: 'انتهى الامتحان',
                    text: 'انتهى وقت المحاولة أو تم إنهاؤها.',
                }).then(() => router.reload());
            } else {
                Swal.fire({ icon: 'error', title: 'حدث خطأ', text: 'تعذر تصحيح الإجابة، حاول مرة أخرى.' });
            }
        } finally {
            setPending(null);
        }
    };

    const handleSubmit = () => {
        if (!enrolled || submitting) return;

        Swal.fire({
            title: 'هل أنت متأكد من تسليم الامتحان؟',
            text: 'الأسئلة اللي لم تجب عنها هتتحسب خاطئة، ولن تتمكن من التعديل بعد التسليم.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، تسليم',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#1769AA',
            cancelButtonColor: '#6b7280',
            reverseButtons: true,
        }).then((r) => r.isConfirmed && performSubmit());
    };

    // التسليم مش بيبعت إجابات: السيرفر بيحسب من اللي سجّله
    function performSubmit() {
        if (submitting) return;
        setSubmitting(true);

        router.post(route('exams.attempt', exam.id), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const flash = page.props.flash?.examResult;
                const latest = page.props.attempts?.[0];

                const r =
                    flash && flash.exam_id === exam.id
                        ? flash
                        : latest
                            ? {
                                exam_id: exam.id,
                                score: Number(latest.score_percent),
                                correct: latest.correct_answers,
                                total: latest.total_questions,
                                passed: exam.passing_score != null && Number(latest.score_percent) >= exam.passing_score,
                            }
                            : null;

                if (r) {
                    setResult(r);
                    Swal.fire({
                        icon: r.passed ? 'success' : 'info',
                        title: r.passed ? '🎉 مبروك! اجتزت الامتحان' : 'للأسف لم تجتز الامتحان',
                        html: `أجبت بشكل صحيح على <b>${r.correct}</b> من <b>${r.total}</b> — النتيجة: <b>${r.score}%</b>`,
                    });
                }
            },
            onError: () =>
                Swal.fire({ icon: 'error', title: 'حدث خطأ', text: 'تعذر إرسال الامتحان، حاول مرة أخرى.' }),
            onFinish: () => setSubmitting(false),
        });
    }

    const lastAttempt = attempts && attempts.length > 0 ? attempts[0] : null;
    const answeredCount = Object.keys(resultsMap).length;
    const isTimeRunningOut = timeLeft !== null && timeLeft <= 300 && timeLeft > 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-white/10 p-6">
            {/* رأس الامتحان */}
            <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1769AA]/10 dark:bg-gold/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#1769AA] dark:text-gold" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exam.title}</h3>
                        {exam.description && (
                            <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{exam.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {hasReview && (
                        <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                            <Eye className="w-3.5 h-3.5" />
                            مراجعة الحل السابق
                        </span>
                    )}

                    {!isTaking && !canAttempt && (
                        <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                            <Lock className="w-3.5 h-3.5" />
                            استنفدت المحاولات المتاحة
                        </span>
                    )}

                    {isTaking && timeLeft !== null && (
                        <span
                            className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full transition-all ${
                                timeLeft === 0
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    : isTimeRunningOut
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-300'
                            }`}
                        >
                            {timeLeft === 0 ? (
                                <span className="flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" /> انتهى الوقت
                                </span>
                            ) : (
                                <>
                                    <Clock className="w-4 h-4" />
                                    {formatTime(timeLeft)}
                                </>
                            )}
                        </span>
                    )}
                </div>
            </div>

            {/* معلومات الامتحان */}
            {!isTaking && (
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
                    {exam.questions_count} سؤال
                    {exam.duration_minutes && <> · المدة: {exam.duration_minutes} دقيقة</>}
                    {exam.passing_score && <> · درجة النجاح: {exam.passing_score}%</>}
                    {maxAttempts && <> · المحاولات المسموح بها: {maxAttempts}</>}
                </p>
            )}

            {/* نتيجة التسليم الأخير */}
            {result && !isTaking && (
                <div
                    className={`mb-6 p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 ${
                        result.passed
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}
                >
                    <div>
                        <p className="font-bold text-lg">
                            {result.passed ? '🎉 مبروك! اجتزت الامتحان' : 'للأسف لم تجتز الامتحان'}
                        </p>
                        <p className="text-sm opacity-80 mt-1">
                            أجبت بشكل صحيح على {result.correct} من {result.total} أسئلة.
                        </p>
                    </div>
                    <div className="text-3xl font-black">{result.score}%</div>
                </div>
            )}

            {/* آخر محاولة */}
            {lastAttempt && !isTaking && !result && (
                <div className="mb-6 p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm text-slate-600 dark:text-gray-300">
                        آخر محاولة: {lastAttempt.correct_answers}/{lastAttempt.total_questions}
                    </span>
                    <span className="text-sm font-bold text-[#1769AA] dark:text-gold">{lastAttempt.score_percent}%</span>
                </div>
            )}

            {/* الأسئلة: أثناء الحل أو المراجعة فقط */}
            {(isTaking || hasReview) && (
                <div className="space-y-6">
                    {questions.map((q, qIndex) => {
                        const questionResult = resultsMap[q.id];
                        const isChecking = pending?.questionId === q.id;
                        const isLocked = !isTaking || !!questionResult || !!pending || submitting;
                        const selectedId =
                            questionResult?.selected_option_id ??
                            (isChecking ? pending.optionId : null);

                        return (
                            <div
                                key={q.id}
                                className="p-4 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/50"
                            >
                                <p className="font-semibold text-slate-900 dark:text-white mb-3 flex gap-2">
                                    <span className="text-gold font-bold shrink-0">{qIndex + 1}.</span>
                                    <span>{q.question_text}</span>
                                </p>

                                <div className="space-y-2 mr-6">
                                    {q.options.map((opt) => {
                                        const isSelected = selectedId === opt.id;
                                        const isCorrectOption = !!questionResult && questionResult.correct_option_id === opt.id;
                                        const wasWrongSelection =
                                            !!questionResult && !questionResult.is_correct && isSelected && !isCorrectOption;

                                        let optionClass = 'w-full text-right p-3 rounded border transition flex items-center gap-3 ';

                                        if (questionResult) {
                                            if (isCorrectOption) {
                                                optionClass +=
                                                    'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400';
                                            } else if (wasWrongSelection) {
                                                optionClass +=
                                                    'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400';
                                            } else {
                                                optionClass +=
                                                    'bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-white/10 opacity-60';
                                            }
                                        } else {
                                            optionClass += isSelected
                                                ? 'bg-[#1769AA]/10 dark:bg-gold/10 border-[#1769AA] dark:border-gold text-[#1769AA] dark:text-gold'
                                                : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-white/10 hover:border-[#1769AA]/50 dark:hover:border-gold/50 cursor-pointer';
                                        }

                                        if (isChecking) optionClass += ' opacity-70 pointer-events-none';

                                        const showDot = !questionResult && isSelected;

                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleSelect(q.id, opt.id)}
                                                disabled={isLocked}
                                                className={optionClass}
                                            >
                                                <span
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                                        isCorrectOption || wasWrongSelection || showDot
                                                            ? 'border-current'
                                                            : 'border-slate-300 dark:border-gray-600'
                                                    }`}
                                                >
                                                    {isCorrectOption && <Check className="w-3.5 h-3.5" />}
                                                    {wasWrongSelection && <X className="w-3.5 h-3.5" />}
                                                    {showDot && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                                </span>
                                                <span className="flex-1">{opt.option_text}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* الشرح: يظهر بعد ما السؤال يتصحح بس */}
                                {questionResult?.explanation && (
                                    <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300 flex gap-2 items-start">
                                        <span className="shrink-0 mt-0.5">💡</span>
                                        <span>
                                            <strong>توضيح:</strong> {questionResult.explanation}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* الأزرار */}
            <div className={`${isTaking || hasReview ? 'mt-8 border-t border-slate-100 dark:border-white/5 pt-6' : ''}`}>
                {isTaking ? (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!enrolled || submitting}
                        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#1769AA] dark:bg-gold text-white dark:text-primary font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {timeLeft === 0
                            ? 'جاري التسليم التلقائي...'
                            : submitting
                                ? 'جاري الإرسال...'
                                : `تسليم الامتحان (${answeredCount}/${questions.length})`}
                    </button>
                ) : canAttempt ? (
                    <button
                        type="button"
                        onClick={handleStart}
                        disabled={!enrolled || starting}
                        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-[#1769AA] dark:bg-gold text-white dark:text-primary font-bold hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {hasReview || lastAttempt ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {starting ? 'جاري البدء...' : hasReview || lastAttempt ? 'حل الامتحان من جديد' : 'ابدأ الامتحان'}
                    </button>
                ) : (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-600 dark:text-gray-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 shrink-0" />
                        لقد استخدمت كل المحاولات المتاحة لهذا الامتحان.
                    </div>
                )}
            </div>
        </div>
    );
}