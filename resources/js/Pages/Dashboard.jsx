import ArchIcon from '@/Components/ArchIcon';
import IslamicPattern from '@/Components/IslamicPattern';
import { press3d } from '@/Components/press3d';
import { usePressSound } from '@/Hooks/Usepresssound';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, courses, recentResults }) {
    // حماية: لو أي قيمة undefined أو null تبقى مصفوفة فاضية
    const safeStats = stats || [];
    const safeCourses = courses || [];
    const safeRecentResults = recentResults || [];

    const playPressSound = usePressSound();
    const withSound = (handler) => (e) => {
        playPressSound();
        handler?.(e);
    };

    const firstName = auth?.user?.name ? auth.user.name.split(' ')[0] : 'طالب';

    const getScoreBadgeClass = (score) => {
        if (score >= 85) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
        if (score >= 60) return 'bg-gold/10 text-[#9A741F] dark:text-gold';
        return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    لوحة التحكم
                </h2>
            }
        >
            <Head title="لوحة التحكم" />

            <div className="py-12" dir="rtl">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">

                    {/* بانر ترحيبي */}
                    <div className="relative overflow-hidden rounded bg-primary px-6 py-10 sm:px-10">
                        <IslamicPattern className="absolute inset-0 h-full w-full text-white" opacity={0.05} />
                        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-gold">أهلاً بيك من جديد</p>
                                <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
                                    مرحباً، {firstName}
                                </h1>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                                    كمّل من حيث وقفت، وتابع تقدّمك في المواد التي تذاكرها.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={route('courses.index')}
                                    onClick={withSound()}
                                    className={`inline-flex w-fit items-center px-6 py-3 text-sm ${press3d.gold}`}
                                >
                                    {safeCourses.length > 0 ? 'تصفح كل الصفوف' : 'اشترك في كورس الآن'}
                                </Link>
                                <Link
                                    href={route('leaderboard.index')}
                                    onClick={withSound()}
                                    className={`inline-flex w-fit items-center px-6 py-3 text-sm text-white/80 ${press3d.ghostOnDark}`}
                                >
                                    أوائل صفي
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* إحصائيات سريعة */}
                    {safeStats.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {safeStats.map((s, index) => (
                                <div
                                    key={index}
                                    className="rounded bg-white p-5 shadow-[0_2px_20px_rgba(11,42,74,0.06)] dark:bg-gray-800"
                                >
                                    <ArchIcon className="h-5 w-5" />
                                    <p className="mt-4 text-2xl font-extrabold text-primary dark:text-white">
                                        {s.value}
                                    </p>
                                    <p className="mt-1 text-[13px] text-primary/50 dark:text-white/50">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* استكمال المواد */}
                    <div id="continue" className="rounded bg-white p-6 shadow-[0_2px_20px_rgba(11,42,74,0.06)] dark:bg-gray-800">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-primary dark:text-white">كمّل مذاكرتك</h3>
                            {safeCourses.length > 0 && (
                                <Link
                                    href={route('courses.index')}
                                    onClick={withSound()}
                                    className="text-sm font-medium text-gold hover:text-gold/80"
                                >
                                    كل المواد
                                </Link>
                            )}
                        </div>

                        {safeCourses.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {safeCourses.map((c, index) => (
                                    <Link
                                        key={c.id || index}
                                        href={route('courses.learn', c.id)}
                                        onClick={withSound()}
                                        className={`block p-5 text-right transition-transform hover:-translate-y-1 ${press3d.ghostOnLight}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <ArchIcon className="h-5 w-5" />
                                            <span className="text-xs font-bold text-primary dark:text-white">
                                                {c.progress}%
                                            </span>
                                        </div>
                                        <h4 className="mt-3 font-semibold text-primary dark:text-white line-clamp-1">
                                            {c.name}
                                        </h4>
                                        <p className="mt-1 text-[13px] text-primary/50 dark:text-white/50">
                                            {c.lessonsDone} من {c.lessonsTotal} درس
                                        </p>
                                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-primary/10 dark:bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-gold transition-all duration-500"
                                                style={{ width: `${c.progress}%` }}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 rounded-full bg-primary/5 p-4 dark:bg-white/5">
                                    <ArchIcon className="h-10 w-10 text-primary/40 dark:text-white/40" />
                                </div>
                                <h4 className="text-lg font-bold text-primary dark:text-white">
                                    لم تشترك في أي كورس بعد
                                </h4>
                                <p className="mt-2 max-w-sm text-sm text-primary/60 dark:text-white/60">
                                    ابدأ رحلتك التعليمية الآن وتصفح الصفوف المتاحة واشترك في أول كورس يناسبك.
                                </p>
                                <Link
                                    href={route('courses.index')}
                                    onClick={withSound()}
                                    className={`mt-6 inline-flex items-center px-6 py-2.5 text-sm font-bold ${press3d.gold}`}
                                >
                                    تصفح الصفوف
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* آخر نتائج الاختبارات */}
                    <div className="rounded bg-white p-6 shadow-[0_2px_20px_rgba(11,42,74,0.06)] dark:bg-gray-800">
                        <h3 className="mb-6 text-lg font-bold text-primary dark:text-white">آخر نتائج الاختبارات</h3>

                        {safeRecentResults.length > 0 ? (
                            <div className="divide-y divide-primary/5 dark:divide-white/5">
                                {safeRecentResults.map((r, index) => (
                                    <div key={index} className="flex items-center justify-between gap-3 py-3.5">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <ArchIcon className="h-4 w-4 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-primary dark:text-white">
                                                    {r.subject}
                                                </p>
                                                <p className="text-xs text-primary/40 dark:text-white/40">
                                                    {r.date}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getScoreBadgeClass(r.score)}`}>
                                            {r.score}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-sm text-primary/50 dark:text-white/50">
                                لم تحلّ أي امتحان بعد. نتائجك هتظهر هنا أول ما تسلّم امتحانك الأول.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}