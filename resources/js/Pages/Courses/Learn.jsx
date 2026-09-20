import { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import DOMPurify from 'dompurify'; // npm install dompurify
import Exam from './Exam';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OfficialExam from './OfficialExam'
import {
    Lock,
    Eye,
    CheckCircle2,
    PanelRightClose,
    PanelRightOpen,
    ArrowRight,
    Award,
    Check,
    X,
    FileText,
    MessageSquare,
    Send,
    User,
    Shield,
    ChevronDown
} from 'lucide-react';

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

// ===================== أمان: استخراج معرف يوتيوب مع تحقق من الصيغة =====================
// معرف فيديو يوتيوب دايمًا 11 خانة من حروف/أرقام/- و_. أي حاجة تانية بنرفضها
// عشان منمررش أي حاجة غريبة لـ data-plyr-embed-id.
const YT_ID_PATTERN = /^[a-zA-Z0-9_-]{10,12}$/;

function getYoutubeVideoId(url) {
    if (!url || typeof url !== 'string') return null;

    const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&]+)/,
        /(?:youtube\.com\/shorts\/)([^?&]+)/,
        /(?:youtube\.com\/embed\/)([^?&]+)/,
        /(?:youtu\.be\/)([^?&]+)/,
        /(?:youtube\.com\/.*[?&]v=)([^&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && YT_ID_PATTERN.test(match[1])) {
            return match[1];
        }
    }

    return null;
}

// ===================== أمان: تحقق من معرف ملف جوجل درايف =====================
// معرفات درايف بتكون حروف/أرقام/- و_ فقط. أي حاجة تانية معناها إن القيمة مش
// معرف درايف حقيقي ومينفعش تتحط جوه src بتاع iframe.
const DRIVE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
function isValidDriveFileId(id) {
    return typeof id === 'string' && id.length > 0 && DRIVE_ID_PATTERN.test(id);
}

// ===================== أمان: تعقيم محتوى الدرس (HTML قادم من الأدمن/المدرس) =====================
// حتى لو المحرر موثوق فيه، بنعامل أي HTML مخزن كـ "غير موثوق" وقت العرض،
// عشان لو حساب أدمن اتسرق أو المحرر فيه ثغرة، الطالب يفضل محمي من XSS.
const ALLOWED_IFRAME_HOSTS = [
    'www.youtube.com',
    'youtube.com',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
    'drive.google.com',
    'player.vimeo.com',
];

function sanitizeLessonHtml(html) {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        // نسمح بـ iframe كعنصر (فيديوهات مدمجة) لكن بنفلتر الـ src بعدين في الـ hook
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target', 'style', 'loading', 'sandbox'],
        // بيمنع أي بروتوكول غريب زي javascript: أو data: في الروابط والصور
        ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        FORBID_TAGS: ['script', 'style', 'object', 'embed', 'form'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'srcset'],
    });
}

// أنواع الدروس التي يجب أن تعرض مشغل الفيديو
const VIDEO_TYPES = ['video', 'mixed', 'video_text'];
// أنواع الدروس التي يجب أن تعرض ملف الـ PDF
const PDF_TYPES = ['pdf', 'mixed'];
// أنواع الدروس التي يجب أن تعرض الاختبار
const QUIZ_TYPES = ['quiz', 'mixed'];

export default function CoursesLearn({
    course,
    lessons,
    sections = [],
    unsectionedLessons = [],
    currentLesson,
    progress,
    isCompleted,
    enrolled,
    exams,
    examAttempts,
}) {
    const [isLessonsOpen, setIsLessonsOpen] = useState(true);
    // السكاشن المفتوحة في السايدبار — نفتح افتراضيًا السكشن اللي فيه الدرس الحالي،
    // ولو مفيش نفتح أول سكشن عشان السايدبار ميبقاش فاضي بصريًا
    const [openSections, setOpenSections] = useState(() => {
        const initial = new Set();
        const activeSection = sections.find((s) =>
            s.lessons.some((l) => l.id === currentLesson?.id)
        );
        if (activeSection) {
            initial.add(activeSection.id);
        } else if (sections.length > 0) {
            initial.add(sections[0].id);
        }
        return initial;
    });
    const [showQuestions, setShowQuestions] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState(null);
    const [answerText, setAnswerText] = useState({});
    const playerRef = useRef(null);
    const youtubeVideoId = getYoutubeVideoId(currentLesson?.video_url);
    const { auth } = usePage().props;

    // ===================== أمان: hook لـ DOMPurify يفلتر iframe/links بعد التعقيم =====================
    useEffect(() => {
        const hook = (node) => {
            if (node.tagName === 'A') {
                // أي رابط خارجي في محتوى الدرس بيتفتح في تاب جديد بدون ما يقدر
                // يتحكم في نافذة الأصل (تابنابينج)
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer nofollow');
            }

            if (node.tagName === 'IFRAME') {
                const src = node.getAttribute('src') || '';
                try {
                    const url = new URL(src, window.location.origin);
                    if (!ALLOWED_IFRAME_HOSTS.includes(url.hostname)) {
                        node.remove();
                        return;
                    }
                } catch {
                    node.remove();
                    return;
                }
                node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
                node.setAttribute('loading', 'lazy');
                node.setAttribute('referrerpolicy', 'no-referrer');
            }
        };

        DOMPurify.addHook('afterSanitizeAttributes', hook);
        return () => DOMPurify.removeHook('afterSanitizeAttributes', hook);
    }, []);

    const sanitizedLessonContent = useMemo(
        () => sanitizeLessonHtml(currentLesson?.content),
        [currentLesson?.content]
    );

    const pdfFileValid = isValidDriveFileId(currentLesson?.pdf_file);

    // تحميل أسئلة الدرس عند التحميل الأولي
    useEffect(() => {
        if (currentLesson?.id && enrolled) {
            loadQuestions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLesson?.id, enrolled]);

    const loadQuestions = async () => {
        setQuestionsLoading(true);
        setQuestionsError(null);
        try {
            const response = await axios.get(`/lessons/${currentLesson.id}/questions`);
            // تأكيد إن اللي راجع فعلاً array قبل ما نحطه في الـ state
            setQuestions(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading questions:', error);
            setQuestionsError('حصل خطأ أثناء تحميل الأسئلة، حاول تاني.');
        } finally {
            setQuestionsLoading(false);
        }
    };

    const submitQuestion = (e) => {
        e.preventDefault();
        const trimmed = newQuestion.trim();
        if (!trimmed) return;

        router.post(`/lessons/${currentLesson.id}/questions`, {
            question: trimmed,
            is_private: isPrivate,
        }, {
            onSuccess: () => {
                setNewQuestion('');
                setIsPrivate(false);
                loadQuestions();
            },
        });
    };

    const submitAnswer = (questionId) => {
        const trimmed = answerText[questionId]?.trim();
        if (!trimmed) return;

        router.post(`/questions/${questionId}/answer`, {
            answer: trimmed,
        }, {
            onSuccess: () => {
                setAnswerText({ ...answerText, [questionId]: '' });
                loadQuestions();
            },
        });
    };

    useEffect(() => {
        // أمان: منمنعش تشغيل بلاير غير لو نوع الدرس فعلاً فيديو ومعانا معرف صحيح
        const isVideoLesson = currentLesson && VIDEO_TYPES.includes(currentLesson.type);
        if (!playerRef.current || !youtubeVideoId || !isVideoLesson) return;

        const player = new Plyr(playerRef.current, {
            controls: [
                'play-large', 'play', 'progress', 'current-time',
                'mute', 'volume', 'captions', 'settings',
                'pip', 'airplay', 'fullscreen',
            ],
            settings: ['captions', 'quality', 'speed'],
            youtube: {
                noCookie: true,
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                showinfo: 0,
            },
            ratio: '16:9',
            keyboard: { focused: true, global: true },
        });

        const container = playerRef.current;
        const preventCtx = (e) => e.preventDefault();
        container?.addEventListener('contextmenu', preventCtx);

        return () => {
            container?.removeEventListener('contextmenu', preventCtx);
            player.destroy();
        };
    }, [youtubeVideoId, currentLesson?.type]);

    const isLessonUnlocked = (lesson) => enrolled || lesson.is_preview;

    const goToLesson = (lesson) => {
        if (!isLessonUnlocked(lesson)) return;
        router.get(
            route('courses.learn', course.id),
            { lesson: lesson.id },
            { preserveState: true, preserveScroll: false }
        );
    };

    const markComplete = () => {
        if (!enrolled) return;
        router.post(
            route('lessons.complete', currentLesson.id),
            {},
            { preserveScroll: true }
        );
    };

    // ترقيم متصل للدروس (1، 2، 3...) بغض النظر إنها جوه سكشن أو بدون سكشن
    const lessonIndexById = useMemo(
        () => new Map(lessons.map((lesson, index) => [lesson.id, index])),
        [lessons]
    );

    const toggleSection = (sectionId) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    // زرار الدرس الواحد في السايدبار — بيتستخدم سواء الدرس جوه سكشن أو بدون سكشن
    const renderLessonButton = (lesson) => {
        const unlocked = isLessonUnlocked(lesson);
        const isActive = lesson.id === currentLesson.id;
        const index = lessonIndexById.get(lesson.id) ?? 0;

        return (
            <button
                key={lesson.id}
                onClick={() => goToLesson(lesson)}
                disabled={!unlocked}
                className={`
                    w-full text-right flex items-center gap-3 p-3 rounded border transition
                    ${isActive
                        ? 'bg-[#1769AA]/10 dark:bg-gold/10 border-[#1769AA]/30 dark:border-gold/40'
                        : unlocked
                        ? 'bg-slate-50 dark:bg-gray-950/40 border-slate-200 dark:border-white/5 hover:border-[#1769AA]/30 dark:hover:border-white/15'
                        : 'bg-slate-50/60 dark:bg-gray-950/20 border-slate-100 dark:border-white/5 opacity-50 cursor-not-allowed'
                    }
                `}
            >
                <span className={`
                    flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-bold
                    ${isActive ? 'bg-[#1769AA] dark:bg-gold text-white dark:text-primary' : 'bg-slate-100 dark:bg-white/5 text-[#1769AA] dark:text-gold'}
                `}>
                    {index + 1}
                </span>
                <span className="text-sm text-slate-700 dark:text-gray-200 line-clamp-1 flex-1">
                    {lesson.title}
                </span>
                {!unlocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 shrink-0" />
                ) : !enrolled && lesson.is_preview ? (
                    <Eye className="w-3.5 h-3.5 text-gold shrink-0" />
                ) : null}
            </button>
        );
    };

    // حالة نادرة: لو الـ backend رجّع الدرس الحالي null (مثلاً المستخدم مش مسموح له ووصل هنا بطريقة ما)
    if (!currentLesson) {
        return (
            <AuthenticatedLayout>
                <Head title={`${course.name} - غرفة التعلم`} />
                <div className="min-h-screen flex items-center justify-center bg-offwhite dark:bg-gray-950 text-slate-900 dark:text-white" dir="rtl">
                    <div className="text-center space-y-4">
                        <Lock className="w-10 h-10 mx-auto text-slate-400" />
                        <p className="text-lg font-semibold">لا يمكنك مشاهدة هذا الدرس حالياً</p>
                        <Link
                            href={route('courses.show', course.id)}
                            className="inline-block px-4 py-2 rounded-full bg-gold text-primary text-sm font-bold hover:brightness-110 transition"
                        >
                            العودة لصفحة الصف
                        </Link>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`${course.name} - غرفة التعلم`} />

            <div
                className="min-h-screen bg-offwhite dark:bg-gray-950 text-slate-900 dark:text-white font-sans selection:bg-[#1769AA] selection:text-white transition-colors duration-300"
                dir="rtl"
            >
                {/* بانر المعاينة */}
                {!enrolled && (
                    <div className="bg-amber-50 dark:bg-gold/10 border-b border-amber-200 dark:border-gold/30 px-4 sm:px-6 lg:px-8 py-3">
                        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-amber-800 dark:text-gold flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                إنت بتشوف معاينة مجانية من الصف — اشترك عشان تفتح كل الدروس ومتابعة التقدم
                            </p>
                            <Link
                                href={route('courses.show', course.id)}
                                className="shrink-0 px-4 py-1.5 rounded-full bg-gold text-primary text-sm font-bold hover:brightness-110 transition"
                            >
                                اشترك الآن
                            </Link>
                        </div>
                    </div>
                )}

                <div className="max-w-full">
                    <div className="rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900 shadow-xl shadow-slate-200/60 dark:shadow-2xl overflow-hidden flex flex-col lg:flex-row items-stretch min-h-[calc(100vh-120px)]">

                        {/* =========================
                            قائمة الدروس (Sidebar)
                        ========================== */}
                        <div
                            className={`
                                order-2 lg:order-1 w-full shrink-0 border-t lg:border-t-0 lg:border-l
                                border-slate-200 dark:border-white/10 transition-all duration-300 self-stretch
                                ${isLessonsOpen ? 'lg:w-1/4' : 'lg:w-16'}
                            `}
                        >
                            <div className="p-5 lg:sticky lg:top-0">
                                {isLessonsOpen && (
                                    <Link
                                        href={route('courses.show', course.id)}
                                        className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 hover:text-[#1769AA] dark:hover:text-gold transition mb-4 w-fit"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                        رجوع لصفحة الصف
                                    </Link>
                                )}

                                <div className="flex items-center justify-between gap-3">
                                    {isLessonsOpen && (
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-3 min-w-0">
                                            <span className="w-2 h-6 bg-gold rounded-full inline-block shrink-0" />
                                            <span className="truncate">محتوى الصف</span>
                                            <span className="text-xs font-normal text-slate-400 dark:text-gray-500 shrink-0">
                                                ({lessons.length})
                                            </span>
                                        </h3>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setIsLessonsOpen((prev) => !prev)}
                                        className={`
                                            inline-flex items-center justify-center w-8 h-8 rounded border
                                            border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400
                                            hover:text-[#1769AA] dark:hover:text-gold hover:border-[#1769AA]/40 dark:hover:border-gold/40
                                            transition shrink-0 ${!isLessonsOpen ? 'mx-auto' : ''}
                                        `}
                                        aria-label={isLessonsOpen ? 'تصغير القائمة' : 'توسيع القائمة'}
                                    >
                                        {isLessonsOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                                    </button>
                                </div>

                                {isLessonsOpen ? (
                                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 mt-4">
                                        {/* دروس بدون قسم — بتظهر مباشرة، ولو الصف مقسمش لسكاشن أصلاً هنا هيبقوا كل الدروس */}
                                        {unsectionedLessons.length > 0 && (
                                            <div className="space-y-2">
                                                {unsectionedLessons.map((lesson) => renderLessonButton(lesson))}
                                            </div>
                                        )}

                                        {/* الأقسام (السكاشن) — كل قسم بيتفتح/يتقفل ويعرض دروسه بس */}
                                        {sections.map((section) => {
                                            const isSectionOpen = openSections.has(section.id);

                                            return (
                                                <div
                                                    key={section.id}
                                                    className="rounded border border-slate-200 dark:border-white/10 overflow-hidden"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSection(section.id)}
                                                        className="w-full flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-gray-950/40 hover:bg-slate-100 dark:hover:bg-gray-950/60 transition text-right"
                                                    >
                                                        <span className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                                            {section.title}
                                                        </span>
                                                        <span className="flex items-center gap-2 shrink-0">
                                                            <span className="text-xs font-normal text-slate-400 dark:text-gray-500">
                                                                ({section.lessons.length})
                                                            </span>
                                                            <ChevronDown
                                                                className={`w-4 h-4 text-slate-400 dark:text-gray-500 transition-transform ${isSectionOpen ? 'rotate-180' : ''}`}
                                                            />
                                                        </span>
                                                    </button>

                                                    {isSectionOpen && (
                                                        <div className="p-2 space-y-2 bg-white dark:bg-gray-900">
                                                            {section.lessons.length > 0 ? (
                                                                section.lessons.map((lesson) => renderLessonButton(lesson))
                                                            ) : (
                                                                <p className="text-xs text-slate-400 dark:text-gray-500 text-center py-2">
                                                                    لا توجد دروس في هذا القسم بعد.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsLessonsOpen(true)}
                                        className="hidden lg:flex w-full flex-col items-center justify-center gap-2 py-6 text-slate-400 dark:text-gray-500 hover:text-[#1769AA] dark:hover:text-gold transition"
                                    >
                                        <span className="text-xs font-semibold" style={{ writingMode: 'vertical-rl' }}>
                                            محتوى الصف ({lessons.length})
                                        </span>
                                    </button>
                                )}
                            </div>
                            {/* ===== قسم الامتحانات الرسمية ===== */}
                            {isLessonsOpen && exams && exams.length > 0 && (
                                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
                                    <h4 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Award className="w-3.5 h-3.5" />
                                        الامتحانات ({exams.length})
                                    </h4>
                                    <div className="space-y-1.5">
                                        {exams.map((exam) => {
                                            const lastAttempt = examAttempts?.[exam.id]?.[0];
                                            return (
                                                <Link
                                                    key={exam.id}
                                                    href={route('courses.exams.show', { course: course.id, exam: exam.id })}
                                                    className="w-full text-right flex items-center gap-3 p-2.5 rounded border transition bg-slate-50 dark:bg-gray-950/40 border-slate-200 dark:border-white/5 hover:border-[#1769AA]/30 dark:hover:border-white/15 hover:bg-[#1769AA]/5 dark:hover:bg-gold/5"
                                                >
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span className="text-sm text-slate-700 dark:text-gray-200 line-clamp-1 flex-1">
                                                        {exam.title}
                                                    </span>
                                                    {lastAttempt && (
                                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                                            {lastAttempt.score_percent}%
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* =========================
                            منطقة المحتوى الرئيسية
                        ========================== */}
                        <div className="order-1 lg:order-2 flex-1 w-full min-w-0 min-h-[calc(100vh-120px)] flex flex-col">

                            {/* 1. مشغل الفيديو (فيديو فقط / مختلط / فيديو + نص) */}
                            {VIDEO_TYPES.includes(currentLesson.type) && youtubeVideoId && (
                                // key={currentLesson.id}: أمان/استقرار — Plyr بيستولي على الـ DOM node ده ويعدّل
                                // هيكله بنفسه، فلو نفس الـ node اتعاد استخدامه بين درس وتاني React بيحاول
                                // يحدّثه بدل ما يبنيه من جديد وده بيسيب البلاير في حالة فاسدة والفيديو مش بيظهر.
                                // الـ key بيجبر React يهدم الـ node القديم ويبني واحد نضيف مع كل درس فيديو.
                                <div key={currentLesson.id} className="secure-player-wrapper w-full bg-black shrink-0 relative select-none">
                                    <style>{`
                                        .secure-player-wrapper .plyr iframe,
                                        .secure-player-wrapper .plyr__video-embed iframe {
                                            pointer-events: none !important;
                                        }
                                        .secure-player-wrapper .plyr { border-radius: 0; }
                                    `}</style>
                                    <div
                                        ref={playerRef}
                                        data-plyr-provider="youtube"
                                        data-plyr-embed-id={youtubeVideoId}
                                    />
                                </div>
                            )}

                            <div className="p-6 space-y-6 flex-1 flex flex-col overflow-y-auto">
                                {/* رأس الصفحة */}
                                <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 dark:border-white/5 pb-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {currentLesson.title}
                                        </h2>
                                        {!enrolled && currentLesson.is_preview && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-gold/10 border border-amber-300 dark:border-gold/30 text-amber-700 dark:text-gold text-xs font-semibold">
                                                <Eye className="w-3 h-3" /> معاينة
                                            </span>
                                        )}
                                    </div>

                                    {enrolled && (
                                        <button
                                            onClick={markComplete}
                                            disabled={isCompleted}
                                            className={`
                                                shrink-0 flex items-center gap-2 px-4 py-2 rounded text-sm font-bold transition active:scale-[0.98]
                                                ${isCompleted
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                                                    : 'bg-gold text-primary hover:brightness-110'
                                                }
                                            `}
                                        >
                                            {isCompleted ? (
                                                <><CheckCircle2 className="w-4 h-4" /> تم الإكمال</>
                                            ) : (
                                                'إكمال الدرس'
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* شريط التقدم */}
                                {enrolled && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                                            <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 shrink-0">
                                            {progress}% مكتمل
                                        </span>
                                    </div>
                                )}

                                {/* 2. عارض ملفات PDF — أمان: منعرضش الـ iframe غير لو المعرف صحيح فعلاً */}
                                {PDF_TYPES.includes(currentLesson.type) && currentLesson.pdf_file && (
                                    pdfFileValid ? (
                                        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-gray-950">
                                            <iframe
                                                src={`https://drive.google.com/file/d/${currentLesson.pdf_file}/preview`}
                                                className="w-full h-full"
                                                title="PDF Viewer"
                                                allow="autoplay"
                                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                                referrerPolicy="no-referrer"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-sm text-red-700 dark:text-red-400">
                                            تعذر عرض الملف: معرف الملف غير صالح.
                                        </div>
                                    )
                                )}

                                {/* 3. محتوى النص — أمان: بيتعرض بعد ما يعدي على DOMPurify مش الخام مباشرة */}
                                {currentLesson.content && (
                                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none rich-lesson-content flex-1">
                                        <style>{`
                                            /* تفعيل ألوان النص القادمة من الفيليمنت (span.color مع --color / --dark-color) */
                                            .rich-lesson-content .color { color: var(--color); }
                                            .dark .rich-lesson-content .color { color: var(--dark-color); }

                                            .rich-lesson-content a { color: #1769AA; }
                                            .dark .rich-lesson-content a { color: #C99A2E; }

                                            /* الجداول: border-separate بدل collapse عشان الـ rounded يشتغل صح */
                                            .rich-lesson-content table {
                                                width: 100%;
                                                border-collapse: separate;
                                                border-spacing: 0;
                                                margin: 1rem 0;
                                                border-radius: 0.5rem;
                                                overflow: hidden;
                                                border: 1px solid rgb(226 232 240);
                                            }
                                            .dark .rich-lesson-content table { border-color: rgb(255 255 255 / 0.1); }
                                            .rich-lesson-content th,
                                            .rich-lesson-content td {
                                                border-top: 1px solid rgb(226 232 240);
                                                border-right: 1px solid rgb(226 232 240);
                                                padding: 0.75rem;
                                                text-align: right;
                                            }
                                            .dark .rich-lesson-content th,
                                            .dark .rich-lesson-content td { border-color: rgb(255 255 255 / 0.1); }
                                            .rich-lesson-content tr > *:last-child { border-right: none; }
                                            .rich-lesson-content thead tr:first-child th,
                                            .rich-lesson-content tr:first-child td { border-top: none; }
                                            .rich-lesson-content th {
                                                background: rgb(248 250 252);
                                                font-weight: 700;
                                            }
                                            .dark .rich-lesson-content th { background: rgb(255 255 255 / 0.05); }

                                            /* الاقتباسات: شيل علامات التنصيص التلقائية والإيطاليك */
                                            .rich-lesson-content blockquote {
                                                border-right: 4px solid #C99A2E;
                                                border-left: none;
                                                background: rgb(248 250 252);
                                                padding: 0.75rem 1rem;
                                                border-radius: 0.5rem 0 0 0.5rem;
                                                font-style: normal;
                                                quotes: none;
                                            }
                                            .dark .rich-lesson-content blockquote { background: rgb(255 255 255 / 0.05); }
                                            .rich-lesson-content blockquote p::before,
                                            .rich-lesson-content blockquote p::after { content: none !important; }

                                            /* مسافة ثابتة وبسيطة بين كل عنصر والتاني عشان القراءة تبقى مرتبة */
                                            .rich-lesson-content > * + * {
                                                margin-top: 1rem;
                                            }
                                            .rich-lesson-content h2,
                                            .rich-lesson-content h3 {
                                                margin-top: 1.75rem;
                                                margin-bottom: 0.5rem;
                                            }
                                            .rich-lesson-content li + li {
                                                margin-top: 0.375rem;
                                            }

                                            .rich-lesson-content img { border-radius: 0.75rem; max-width: 100%; height: auto; margin-inline: auto; }
                                            .rich-lesson-content iframe { width: 100%; max-width: 100%; border-radius: 0.75rem; aspect-ratio: 16/9; }
                                            .rich-lesson-content pre { overflow-x: auto; background: rgb(15 23 42); color: rgb(241 245 249); padding: 1rem; border-radius: 0.5rem; }
                                            .rich-lesson-content ul { list-style: disc; }
                                            .rich-lesson-content ol { list-style: decimal; }
                                            .rich-lesson-content li::marker { color: #C99A2E; }
                                        `}</style>
                                        <div dangerouslySetInnerHTML={{ __html: sanitizedLessonContent }} />
                                    </div>
                                )}
                                {QUIZ_TYPES.includes(currentLesson.type) && currentLesson.quiz && currentLesson.quiz.length > 0 && (
                                    <Exam 
                                        quiz={currentLesson.quiz} 
                                        lessonId={currentLesson.id} 
                                    />
                                )}
                                
                                {/* قسم الأسئلة - يظهر فقط للطلاب المسجلين */}
                                {enrolled && (
                                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <button
                                            onClick={() => setShowQuestions(!showQuestions)}
                                            className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MessageSquare className="w-5 h-5 text-cyan-600" />
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">أسئلة الدرس</h3>
                                                {questions.length > 0 && (
                                                    <span className="px-2.5 py-0.5 text-xs font-medium bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full">
                                                        {questions.length} سؤال
                                                    </span>
                                                )}
                                            </div>
                                            {showQuestions ? (
                                                <PanelRightClose className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <PanelRightOpen className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                        
                                        {showQuestions && (
                                            <div className="p-6 space-y-6">
                                                {/* نموذج إضافة سؤال جديد */}
                                                <form onSubmit={submitQuestion} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            اطرح سؤالك للمدرس
                                                        </label>
                                                        <textarea
                                                            value={newQuestion}
                                                            onChange={(e) => setNewQuestion(e.target.value)}
                                                            rows={3}
                                                            maxLength={2000}
                                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                                            placeholder="اكتب سؤالك هنا..."
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={isPrivate}
                                                                onChange={(e) => setIsPrivate(e.target.checked)}
                                                                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                                                            />
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                سؤال خاص (يظهر لك وللمدرس فقط)
                                                            </span>
                                                        </label>
                                                        
                                                        <button
                                                            type="submit"
                                                            disabled={!newQuestion.trim()}
                                                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                            إرسال السؤال
                                                        </button>
                                                    </div>
                                                </form>

                                                {questionsError && (
                                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-sm text-red-700 dark:text-red-400">
                                                        {questionsError}
                                                    </div>
                                                )}
                                                
                                                {/* قائمة الأسئلة — ملاحظة: {q.question} و{q.answer} بيتعرضوا كنص عادي
                                                    عن طريق React (مش dangerouslySetInnerHTML)، فهم آمنين من الـ XSS تلقائيًا */}
                                                <div className="space-y-4">
                                                    {questionsLoading ? (
                                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                            <p>جاري تحميل الأسئلة...</p>
                                                        </div>
                                                    ) : questions.length === 0 ? (
                                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                            <p>لا توجد أسئلة بعد. كن أول من يطرح سؤالاً!</p>
                                                        </div>
                                                    ) : (
                                                        questions.map((q) => (
                                                            <div
                                                                key={q.id}
                                                                className={`p-4 rounded-lg border ${
                                                                    q.is_private 
                                                                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                                                                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                                                }`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    {q.is_private ? (
                                                                        <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                                    ) : (
                                                                        <User className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {q.student?.name || 'طالب'}
                                                                            </span>
                                                                            {q.is_private && (
                                                                                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                                                                                    خاص
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-gray-800 dark:text-gray-200 mb-3">{q.question}</p>
                                                                        
                                                                        {q.answer ? (
                                                                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                    <Shield className="w-4 h-4 text-green-600" />
                                                                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                                                        إجابة المدرس
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-gray-700 dark:text-gray-300">{q.answer}</p>
                                                                            </div>
                                                                        ) : (
                                                                            auth.user?.is_admin && (
                                                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                                                    <textarea
                                                                                        value={answerText[q.id] || ''}
                                                                                        onChange={(e) => setAnswerText({ ...answerText, [q.id]: e.target.value })}
                                                                                        rows={2}
                                                                                        maxLength={2000}
                                                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm resize-none"
                                                                                        placeholder="اكتب إجابتك هنا..."
                                                                                    />
                                                                                    <button
                                                                                        onClick={() => submitAnswer(q.id)}
                                                                                        disabled={!answerText[q.id]?.trim()}
                                                                                        className="mt-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm rounded-md transition-colors"
                                                                                    >
                                                                                        نشر الإجابة
                                                                                    </button>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}