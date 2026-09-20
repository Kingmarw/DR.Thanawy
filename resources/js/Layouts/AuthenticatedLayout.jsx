import DarkModeToggle from '@/Components/DarkModeToggle';
import Dropdown from '@/Components/Dropdown';
import Logo from '@/Components/Logo';
import { press3d } from '@/Components/press3d';
import { usePressSound } from '@/Hooks/Usepresssound';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';

function TopNavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={
                'relative inline-flex items-center px-1 py-2 text-sm font-medium tracking-wide transition-colors ' +
                (active ? 'text-white' : 'text-white/60 hover:text-white/90')
            }
        >
            {children}
            <span
                className={
                    'absolute -bottom-[12px] left-0 h-[2px] w-full bg-gold transition-opacity ' +
                    (active ? 'opacity-100' : 'opacity-0')
                }
            />
        </Link>
    );
}

function MobileNavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={
                'block rounded px-4 py-2.5 text-sm font-medium tracking-wide transition-colors ' +
                (active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white')
            }
        >
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const playPressSound = usePressSound();

    // لو الصورة فشلت تتحمّل نعرض الأيقونة الافتراضية
    const [photoFailed, setPhotoFailed] = useState(false);

    // لو الرابط اتغير (رفعت صورة جديدة) جرّب تاني
    useEffect(() => {
        setPhotoFailed(false);
    }, [user.profile_photo_url]);

    const showPhoto = user.profile_photo_url && !photoFailed;

    const withSound = (handler) => (e) => {
        playPressSound();
        handler?.(e);
    };

    // استخراج الاسم الأول فقط من اسم المستخدم
    const firstName = user.name ? user.name.split(' ')[0] : '';

    return (
        <div className="min-h-screen bg-offwhite font-sans dark:bg-gray-950" dir="rtl">
            <nav className="sticky top-0 z-40 bg-primary shadow-sm dark:bg-[#0B2A4A]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-10">
                            <Link href="/" className="flex items-center gap-2.5">
                                <Logo className="h-8 w-8" />
                                <span className="hidden text-lg font-bold tracking-wide text-white sm:inline">
                                    دكتور ثانوي
                                </span>
                            </Link>

                            <div className="hidden items-center gap-8 sm:flex">
                                <TopNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    لوحة التحكم
                                </TopNavLink>
                                <TopNavLink
                                    href={route('courses.index')}
                                    active={route().current('courses.*')}
                                >
                                    الصفوف
                                </TopNavLink>
                                <TopNavLink href={route('leaderboard.index')} active={route().current('leaderboard.*')}>
                                    الأوائل
                                </TopNavLink>
                            </div>
                        </div>

                        <div className="hidden items-center gap-3 sm:flex">
                            <DarkModeToggle className="border-white/15 bg-white/10 text-white hover:bg-white/20" />
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        onClick={withSound()}
                                        className={`flex items-center gap-2 py-1.5 pe-2 ps-3 text-sm font-bold tracking-wide text-white/90 ${press3d.ghostOnDark}`}
                                    >
                                        مرحباً، {firstName}
                                        {showPhoto ? (
                                            <img
                                                src={user.profile_photo_url}
                                                alt={user.name}
                                                onError={() => setPhotoFailed(true)}
                                                className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-gold/50"
                                            />
                                        ) : (
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
                                                <UserIcon className="h-4 w-4" />
                                            </span>
                                        )}
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        الملف الشخصي
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        تسجيل الخروج
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <button
                            onClick={withSound(() => setMenuOpen((v) => !v))}
                            className={`inline-flex items-center justify-center p-2 text-white/80 hover:text-white sm:hidden ${press3d.ghostOnDark}`}
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="border-t border-white/10 px-4 pb-4 pt-3 sm:hidden">
                        <div className="space-y-1">
                            <MobileNavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                لوحة التحكم
                            </MobileNavLink>
                            <MobileNavLink
                                href={route('courses.index')}
                                active={route().current('courses.*')}
                            >
                                الصفوف
                            </MobileNavLink>
                            <MobileNavLink href={route('leaderboard.index')} active={route().current('leaderboard.*')}>
                                الأوائل
                            </MobileNavLink>
                        </div>

                        <div className="mt-4 border-t border-white/10 pt-4">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    {showPhoto ? (
                                        <img
                                            src={user.profile_photo_url}
                                            alt={user.name}
                                            onError={() => setPhotoFailed(true)}
                                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-gold/50"
                                        />
                                    ) : (
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
                                            <UserIcon className="h-6 w-6" />
                                        </span>
                                    )}
                                    <div>
                                        <div className="text-sm font-semibold text-white">مرحباً، {firstName}</div>
                                        <div className="text-sm text-white/50">{user.email}</div>
                                    </div>
                                </div>
                                <DarkModeToggle className="border-white/15 bg-white/10 text-white hover:bg-white/20" />
                            </div>
                            <div className="mt-3 space-y-1">
                                <MobileNavLink href={route('profile.edit')}>
                                    الملف الشخصي
                                </MobileNavLink>
                                <MobileNavLink method="post" href={route('logout')} as="button">
                                    تسجيل الخروج
                                </MobileNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* {header && (
                <header className="border-b border-primary/5 bg-white dark:border-white/5 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 py6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )} */}

            <main>{children}</main>
        </div>
    );
}