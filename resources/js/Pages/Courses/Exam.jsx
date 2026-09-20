import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Award, Check, X, RotateCcw } from 'lucide-react';

// ✅ Toast خفيف بيظهر فوق الشاشة لحظة تصحيح كل سؤال
const answerToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

export default function Exam({ quiz, lessonId }) {
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showFinalResult, setShowFinalResult] = useState(false);

    // إعادة تعيين حالة الاختبار عند تغيير الدرس
    useEffect(() => {
        setQuizAnswers({});
        setShowFinalResult(false);
    }, [lessonId]);

    if (!quiz || quiz.length === 0) return null;

    const answeredCount = Object.keys(quizAnswers).length;
    const correctCount = quiz.reduce(
        (acc, q, qIndex) => (quizAnswers[qIndex] === q.answer ? acc + 1 : acc),
        0
    );
    const score = quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 0;

    // ✅ تصحيح فوري: أول ما الطالب يختار إجابة، السؤال يتقفل ويظهر صح/غلط على طول
    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (quizAnswers[questionIndex] !== undefined) return;

        const isCorrect = optionIndex === quiz[questionIndex].answer;

        answerToast.fire({
            icon: isCorrect ? 'success' : 'error',
            title: isCorrect ? 'إجابة صحيحة! 🎉' : 'إجابة خاطئة',
        });

        setQuizAnswers(prev => {
            const next = { ...prev, [questionIndex]: optionIndex };

            // لما يجاوب على آخر سؤال، نعرض النتيجة الإجمالية بعد تأخير بسيط
            // عشان الطالب ياخد باله من نتيجة آخر سؤال الأول
            if (Object.keys(next).length === quiz.length) {
                const finalCorrect = quiz.reduce(
                    (acc, q, qIndex) => (next[qIndex] === q.answer ? acc + 1 : acc),
                    0
                );
                const finalScore = Math.round((finalCorrect / quiz.length) * 100);

                setTimeout(() => {
                    setShowFinalResult(true);
                    Swal.fire({
                        icon: finalScore >= 50 ? 'success' : 'info',
                        title: finalScore >= 50 ? 'مبروك! اجتزت الاختبار' : 'للأسف لم تجتز الاختبار',
                        html: `أجبت بشكل صحيح على <b>${finalCorrect}</b> من <b>${quiz.length}</b> — النتيجة: <b>${finalScore}%</b>`,
                    });
                }, 400);
            }

            return next;
        });
    };

    const resetQuiz = () => {
        setQuizAnswers({});
        setShowFinalResult(false);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-white/10 p-6 mt-4">
            <div className="flex items-center gap-2 mb-6">
                <Award className="w-6 h-6 text-gold" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">اختبار الدرس</h3>
            </div>

            <div className="space-y-6">
                {quiz.map((q, qIndex) => {
                    const selected = quizAnswers[qIndex];
                    const isAnswered = selected !== undefined;

                    return (
                        <div key={qIndex} className="p-4 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/50">
                            <p className="font-semibold text-slate-900 dark:text-white mb-3 flex gap-2">
                                <span className="text-gold font-bold">{qIndex + 1}.</span>
                                {q.question}
                            </p>

                            <div className="space-y-2 mr-6">
                                {q.options.map((opt, optIndex) => {
                                    const isSelected = selected === optIndex;
                                    const isThisCorrect = optIndex === q.answer;

                                    let optionClass = "w-full text-right p-3 rounded border transition flex items-center gap-3 ";
                                    if (isAnswered) {
                                        if (isThisCorrect) optionClass += "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400";
                                        else if (isSelected && !isThisCorrect) optionClass += "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                                        else optionClass += "bg-slate-50 dark:bg-gray-900 border-slate-200 dark:border-white/10 opacity-60";
                                    } else {
                                        optionClass += "bg-white dark:bg-gray-900 border-slate-200 dark:border-white/10 hover:border-[#1769AA]/50 dark:hover:border-gold/50 cursor-pointer";
                                    }

                                    return (
                                        <button
                                            key={optIndex}
                                            onClick={() => handleOptionSelect(qIndex, optIndex)}
                                            disabled={isAnswered}
                                            className={optionClass}
                                        >
                                            <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected || (isAnswered && isThisCorrect) ? 'border-current' : 'border-slate-300 dark:border-gray-600'}`}>
                                                {isAnswered && isThisCorrect && <Check className="w-3.5 h-3.5" />}
                                                {isAnswered && isSelected && !isThisCorrect && <X className="w-3.5 h-3.5" />}
                                            </span>
                                            <span className="flex-1">{typeof opt === 'object' ? opt.text : opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-white/5 pt-6">
                {!showFinalResult ? (
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        {answeredCount}/{quiz.length} تم الإجابة عليها — كل سؤال بيتصحح فور اختيارك للإجابة.
                    </p>
                ) : (
                    <div className={`p-4 rounded-lg flex items-center justify-between flex-wrap gap-4 ${score >= 50 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                        <div>
                            <p className="font-bold text-lg">
                                {score >= 50 ? 'مبروك! اجتزت الاختبار' : 'للأسف لم تجتز الاختبار، راجع الدرس وحاول مرة أخرى'}
                            </p>
                            <p className="text-sm opacity-80 mt-1">
                                لقد أجبت بشكل صحيح على {correctCount} من {quiz.length} أسئلة.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-black">{score}%</div>
                            <button
                                onClick={resetQuiz}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition text-sm font-bold"
                            >
                                <RotateCcw className="w-4 h-4" />
                                إعادة المحاولة
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}