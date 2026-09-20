// GuestLayout.jsx
import DarkModeToggle from '@/Components/DarkModeToggle';
import IslamicPattern from '@/Components/IslamicPattern';
import Logo from '@/Components/Logo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen font-cairo" dir="rtl">
            {/* الـ Toggle - ثابت في أعلى الشاشة دايمًا، فوق كل حاجة */}
            <div className="fixed left-5 top-5 z-50 sm:left-6 sm:top-6">
                <DarkModeToggle />
            </div>

            {/* اللوحة اليمنى: الهوية البصرية */}
            <div className="relative hidden w-[44%] flex-col overflow-hidden bg-gradient-to-br from-primary via-primary to-[#0B2A4A] px-12 py-10 lg:flex">
                <IslamicPattern
                    className="absolute inset-0 h-full w-full text-gold"
                    opacity={0.07}
                />

                <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded bg-gold/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded bg-[#1769AA]/20 blur-3xl" />

                <Link href="/" className="relative z-10 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded bg-white/10 backdrop-blur-sm ring-1 ring-white/10">
                        <Logo className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-semibold text-white">
                        دكتور ثانوي
                    </span>
                </Link>

                <div className="relative z-10 flex flex-1 flex-col justify-center">
                    <span className="mb-3 block text-4xl leading-none text-gold/50">
                        “
                    </span>
                    <p className="text-2xl font-medium leading-relaxed text-white">
                        العلم نور، وطلبه عبادة.
                    </p>
                    <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/60">
                        منصة تعليمية لطلاب الأزهر الشريف، تجمع الدروس والمواد
                        في مكان واحد بشكل واضح ومنظّم.
                    </p>
                </div>

                <div className="relative z-10 flex items-end gap-4">
                    <svg
                        viewBox="0 0 64 64"
                        className="h-10 w-10 shrink-0 text-gold/60"
                        fill="none"
                    >
                        <path
                            d="M8 56V32C8 18.7 18.7 8 32 8s24 10.7 24 24v24"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M16 56V34c0-8.8 7.2-16 16-16s16 7.2 16 16v22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            opacity="0.5"
                        />
                    </svg>
                    <div className="h-px flex-1 bg-gradient-to-l from-gold/50 to-transparent" />
                </div>
            </div>

            {/* اللوحة اليسرى: محتوى الفورم - بتملى كل المساحة المتبقية بعد اللوحة اليمنى */}
            <div className="relative flex flex-1 flex-col bg-offwhite px-6 py-10 sm:px-14 lg:px-20 lg:py-14 dark:bg-gray-950">
                <IslamicPattern
                    className="absolute inset-0 h-full w-full text-primary lg:hidden"
                    opacity={0.03}
                />

                {/* هيدر الموبايل - من غير الـ toggle دلوقتي، هو ثابت فوق */}
                <div className="relative z-10 mb-8 flex w-full items-center justify-center lg:hidden">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Logo variant="onLight" className="h-9 w-9" />
                        <span className="text-lg font-semibold text-primary dark:text-white">
                            دكتور ثانوي
                        </span>
                    </Link>
                </div>

                {/* الفورم نفسها بتاخد كل المساحة المتاحة (طول وعرض) */}
                <div className="relative z-10 flex w-full flex-1 flex-col justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
}