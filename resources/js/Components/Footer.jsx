import Logo from '@/Components/Logo';
import { FacebookIcon, YoutubeIcon } from '@/Components/SocialIcons';
import { Send } from 'lucide-react';
import IslamicPattern from '@/Components/IslamicPattern';
import DevCredit from '@/Components/Dev';

export default function Footer({ auth }) {
    const navLinks = [
        { href: '#about', label: 'من نحن' },
        { href: '#features', label: 'مميزات المنصة' },
        { href: '#courses', label: 'المواد' },
    ];

    return (
        <footer className="relative isolate overflow-hidden border-t border-[var(--indigo)]/10 bg-white dark:border-white/10 dark:bg-gray-900">

            {/* Islamic background */}
            <div
                className="pointer-events-none absolute inset-0 z-0
                        text-[var(--indigo)]
                        opacity-[0.045]
                        dark:text-[var(--gold)]
                        dark:opacity-[0.035]"
            >
                <IslamicPattern
                    className="h-full w-full"
                    opacity={1}
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-6">

                {/* Main footer */}
                <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

                    {/* Brand */}
                    <div className="sm:col-span-2">
                        <div className="flex items-center gap-3">
                            <Logo
                                variant="onLight"
                                className="h-11 w-11"
                            />

                            <div>
                                <h3 className="font-display text-xl font-extrabold text-[var(--indigo)] dark:text-white">
                                    دكتور ثانوي
                                </h3>

                                <p className="mt-0.5 text-xs text-[var(--indigo)]/45 dark:text-white/40">
                                    طريقك إلى مراجعة أذكى
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 max-w-md text-sm leading-8 text-[var(--indigo)]/60 dark:text-white/55">
                            منصة تعليمية متخصصة لطلاب الثانوية الأزهرية،
                            تساعدك على المراجعة والتدريب والاستعداد للامتحانات
                            بطريقة منظمة وفعّالة.
                        </p>

                        {/* Social links */}
                        <div className="mt-7 flex items-center gap-3">

                            <a
                                href="https://t.me/doctorthanwy27"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="تليجرام"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--indigo)]/10 text-[var(--indigo)]/55 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] dark:border-white/10 dark:text-white/55"
                            >
                                <Send
                                    className="h-4 w-4 transition-transform duration-300 group-hover:rotate-6"
                                    strokeWidth={1.8}
                                />
                            </a>

                            <a
                                href="https://www.facebook.com/share/1DacvRrSXb/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="فيسبوك"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--indigo)]/10 text-[var(--indigo)]/55 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] dark:border-white/10 dark:text-white/55"
                            >
                                <FacebookIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            </a>

                            <a
                                href="https://youtube.com/channel/UCoC8FiSVAWyN8vefymGlosg?si=I29YtCt-1eSnGouT"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="يوتيوب"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[var(--indigo)]/10 text-[var(--indigo)]/55 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] dark:border-white/10 dark:text-white/55"
                            >
                                <YoutubeIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            </a>

                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-bold text-[var(--indigo)] dark:text-white">
                            روابط سريعة
                        </h4>

                        <div className="mt-5 space-y-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="group flex items-center gap-2 text-sm text-[var(--indigo)]/55 transition-colors duration-200 hover:text-[var(--gold)] dark:text-white/55"
                                >
                                    <span className="h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-3" />
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-sm font-bold text-[var(--indigo)] dark:text-white">
                            الحساب
                        </h4>

                        <div className="mt-5 space-y-3">
                            {auth?.user ? (
                                <a
                                    href={route('dashboard')}
                                    className="group flex items-center gap-2 text-sm text-[var(--indigo)]/55 transition-colors duration-200 hover:text-[var(--gold)] dark:text-white/55"
                                >
                                    <span className="h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-3" />
                                    لوحة التحكم
                                </a>
                            ) : (
                                <>
                                    <a
                                        href={route('login')}
                                        className="group flex items-center gap-2 text-sm text-[var(--indigo)]/55 transition-colors duration-200 hover:text-[var(--gold)] dark:text-white/55"
                                    >
                                        <span className="h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-3" />
                                        تسجيل الدخول
                                    </a>

                                    <a
                                        href={route('register')}
                                        className="group flex items-center gap-2 text-sm text-[var(--indigo)]/55 transition-colors duration-200 hover:text-[var(--gold)] dark:text-white/55"
                                    >
                                        <span className="h-px w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-3" />
                                        إنشاء حساب جديد
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Developer credit */}
                <div className="border-t border-[var(--indigo)]/10 py-10 dark:border-white/10">

                    <div className="flex flex-col items-center justify-center text-center">

                        <div className="rounded border border-[var(--gold)]/20 bg-[var(--gold)]/[0.04] px-7 py-4 shadow-sm transition-all duration-300 hover:border-[var(--gold)]/35 hover:bg-[var(--gold)]/[0.07]">
                            <DevCredit />
                        </div>

                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--indigo)]/10 py-6 text-center sm:flex-row sm:text-right dark:border-white/10">

                    <p className="text-xs text-[var(--indigo)]/40 dark:text-white/40">
                        جميع الحقوق محفوظة © {new Date().getFullYear()} دكتور ثانوي.
                    </p>

                    <p className="text-[11px] text-[var(--indigo)]/30 dark:text-white/30">
                        تعلّم • راجع • اختبر • تقدّم
                    </p>

                </div>

            </div>
        </footer>
    );
}