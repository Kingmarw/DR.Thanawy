import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, BookOpen } from 'lucide-react';
import SecondaryButton from '@/Components/SecondaryButton';
export default function CoursesIndex({ courses, filters }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const isFirstRender = useRef(true);

    // بحث لحظي: بيبعت الطلب أوتوماتيك بعد ما المستخدم يوقف عن الكتابة (debounce)
    // بدل ما ينتظر submit للفورم
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('courses.index'),
                { search: search || undefined },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 350);

        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight">الصفوف</h2>}
        >
            <Head title="الصفوف" />

            <div
                className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white font-sans selection:bg-[#1769AA] selection:text-white transition-colors duration-300"
                dir="rtl"
            >
                {/* ===== هيدر بهوية دكتور ثانوي ===== */}
                <div
                    className="relative overflow-hidden border-b border-white/10 py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
                    style={{ background: 'linear-gradient(135deg, #0B2A4A 0%, #123a63 60%, #1769AA 100%)' }}
                >
                    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                                كل الصفوف
                            </h1>
                            <p className="text-white/70 max-w-xl font-light">
                                اختار الصف المناسب لمستواك وابدأ رحلة التعلم الأن.
                            </p>
                        </div>

                        <div className="max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="ابحث عن كورس..."
                                    className="w-full rounded-full bg-white/10 border border-white/15 py-3 px-5 pr-11 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#C99A2E]/60 focus:bg-white/15 transition backdrop-blur-sm"
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/50">
                                    <Search className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== شبكة الصفات ===== */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={route('courses.show', course.id)}
                                    className="group rounded border border-white/20 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl hover:border-[#1769AA]/40 dark:hover:border-white/25 transition-all hover:-translate-y-1 shadow-[0_25px_70px_-20px_rgba(11,42,74,0.35)] dark:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col"
                                >
                                    {/* صورة الصف - جوه padding عشان متبقاش لاصقة في طرف الكارت */}
                                    <div className="p-3 pb-0">
                                        <div className="relative h-44 rounded bg-slate-900 overflow-hidden">
                                            {course.thumbnail ? (
                                                <>
                                                    <img
                                                        src={course.thumbnail}
                                                        alt=""
                                                        aria-hidden="true"
                                                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
                                                    />
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.title}
                                                        className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition duration-500"
                                                    />
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm gap-2">
                                                    <BookOpen className="w-5 h-5" />
                                                    بدون صورة
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col gap-3 flex-1">
                                        <h3 className="font-bold text-lg leading-snug line-clamp-2 text-slate-900 dark:text-white">
                                            {course.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-2 flex-1">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                                            <span className="inline-flex items-center gap-2 rounded bg-[#1769AA] pl-3 pr-1.5 py-1.5">
                                                <span className="rounded bg-[#0B2A4A] text-[#E4C878] font-black text-sm px-2.5 py-1">
                                                    {course.price > 0 ? course.price : 'مجاني'}
                                                </span>
                                                {course.price > 0 && <span className="text-white text-xs font-medium">جنيهًا</span>}
                                            </span>
                                            <SecondaryButton>
                                                 عرض الصف 
                                            </SecondaryButton>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-400 dark:text-gray-500">
                            {filters?.search
                                ? `لا توجد نتائج لبحثك عن "${filters.search}"`
                                : 'لا توجد صفوف في الوقت الحالي'}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}