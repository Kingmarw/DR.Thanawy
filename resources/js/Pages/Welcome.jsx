import DarkModeToggle from '@/Components/DarkModeToggle';
import IslamicPattern from '@/Components/IslamicPattern';
import Logo from '@/Components/Logo';
import ArchIcon from '@/Components/ArchIcon';
import Footer from '@/Components/Footer';
import { press3d } from '@/Components/press3d';
import { usePressSound } from '@/Hooks/Usepresssound';
import { Head, Link } from '@inertiajs/react';
import gsap from 'gsap';
import SecondaryButton from '@/Components/SecondaryButton';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, Trophy, User as UserIcon } from 'lucide-react';
import LeaderboardSection from '@/Components/LeaderboardSection';

/** يتحول العنصر لشكل ظاهر تدريجيًا لما يدخل الشاشة أثناء السكرول */
function Reveal({ children, className = '', ...props }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(
        () => typeof IntersectionObserver === 'undefined',
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            {...props}
            className={
                `reveal-item will-change-transform transition-all duration-700 ease-out ` +
                (visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0') +
                ` ${className}`
            }
        >
            {children}
        </div>
    );
}

function AboutMark({ className = '' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(
        () => typeof IntersectionObserver === 'undefined',
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`relative h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80 ${className}`}
        >
            <img
                src="/images/logo.webp"
                alt="شعار دكتور ثانوي"
                className={
                    `absolute inset-[3%] h-[94%] w-[94%] object-contain rounded ` +
                    `transition-all duration-700 ease-out ${
                        visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                    }`
                }
            />

            <IlmStar
                mode="fill"
                className={
                    `about-star-one absolute -right-5 top-0 h-14 w-14 ` +
                    `text-[var(--gold)] drop-shadow-lg transition-opacity duration-700 ` +
                    `${visible ? 'opacity-100' : 'opacity-0'}`
                }
            />

            <IlmStar
                mode="fill"
                className={
                    `about-star-two absolute -bottom-4 -left-4 h-12 w-12 ` +
                    `text-[var(--gold-bright)] drop-shadow-lg transition-opacity ` +
                    `delay-300 duration-700 ${
                        visible ? 'opacity-100' : 'opacity-0'
                    }`
                }
            />
        </div>
    );
}

/**
 * نجمة العلم — نجمة ثمانية هندسية (octagram) هي العنصر التوقيعي للهوية.
 * بترسم كخطوط (stroke) عشان تقدر تتحرك برسم تدريجي، أو كشكل مصمت (fill).
 */
const STAR_POINTS = [
    [100, 10], [114.16, 65.82], [163.64, 36.36], [134.18, 85.84],
    [190, 100], [134.18, 114.16], [163.64, 163.64], [114.16, 134.18],
    [100, 190], [85.84, 134.18], [36.36, 163.64], [65.82, 114.16],
    [10, 100], [65.82, 85.84], [36.36, 36.36], [85.84, 65.82],
];

// مسار مغلق صريح بأمر Z — يضمن أن getTotalLength() تحسب طول خط
// الإغلاق بشكل صحيح على كل المتصفحات (عكس <polygon> اللي بيختلف
// سلوكها بين المتصفحات، وده كان بيمنع رسم آخر جزء من النجمة)
const STAR_PATH_D = `M${STAR_POINTS.map((p) => p.join(',')).join(' L')} Z`;

function IlmStar({ className = '', mode = 'stroke', drawId }) {
    return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
            <path
                d={STAR_PATH_D}
                fill={mode === 'fill' ? 'currentColor' : 'none'}
                stroke={mode === 'fill' ? 'none' : 'currentColor'}
                strokeWidth={mode === 'stroke' ? 1.4 : 0}
                strokeLinejoin="round"
                strokeLinecap="round"
                {...(drawId ? { id: drawId, className: 'star-draw' } : {})}
            />
        </svg>
    );
}

/** صف زخرفي من نجوم متدرجة الحجم — فاصل بصري بين الأقسام بدل الخط المجرد */
/** فاصل زخرفي: نجمة مركزية بارزة بين خطين قصار — بديل أنيق للخط المجرد */
function StarDivider({ className = '' }) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`} aria-hidden="true">
            <span className="h-px w-5 bg-current opacity-30" />
            <IlmStar mode="fill" className="h-4 w-4 shrink-0 opacity-90" />
            <span className="h-px w-10 bg-current opacity-30" />
        </div>
    );
}
const navLinks = [
    { href: '#about', label: 'من نحن' },
    { href: '#features', label: 'مميزات المنصة' },
    { href: '#courses', label: 'الصفوف' },
    { href: '#leaderboard', label: 'الأوائل' },
];

const features = [
    {
        title: 'مراجعة منظمة',
        desc: 'رتّب مذاكرتك وراجع الدروس بطريقة واضحة تساعدك تتقدم بثبات.',
    },
    {
        title: 'أسئلة متنوعة',
        desc: 'تدرّب على أسئلة تغطي أهم جوانب الدرس وتكشف لك ما يحتاج مراجعة.',
    },
    {
        title: 'اختبارات وتقييم',
        desc: 'اختبر نفسك، اعرف نتيجتك، وتابع مستواك مع كل محاولة.',
    },
    {
        title: 'اسأل وتعلّم',
        desc: 'مع كل درس اسأل عن أي نقطة، وشوف السؤال والإجابة ليستفيد منها كل طالب.',
    },
];

export default function Welcome({ auth, courses = [] , latestCourses = [], leaderboard = null }) {
    const pageRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const trackRef = useRef(null);
    const playPressSound = usePressSound();
    console.log('leaderboard:', leaderboard);
    // بيلف صوت الضغطة مع أي onClick تاني من غير ما يعطّل الـ navigation بتاع الـ Link
    const withSound = (handler) => (e) => {
        playPressSound();
        handler?.(e);
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useLayoutEffect(() => {
        const page = pageRef.current;

        if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const cleanupListeners = [];

        const context = gsap.context(() => {
            const starPath = page.querySelector('.star-draw');
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            // النص يتكشف الأول
            tl.from('[data-gsap-hero-copy] > *', {
                y: 26,
                autoAlpha: 0,
                duration: 0.9,
                stagger: 0.12,
            });

            // وبعد ما ينتهي تمامًا، النجمة تترسم
            if (starPath) {
                const length = starPath.getTotalLength();
                const overlap = 2;
                gsap.set(starPath, {
                    strokeDasharray: `${length + overlap} ${length + overlap}`,
                    strokeDashoffset: length + overlap,
                });
                tl.to(starPath, {
                    strokeDashoffset: 0,
                    duration: 1.6,
                    ease: 'power2.inOut',
                });
            }


            const hero = page.querySelector('[data-gsap-hero]');
            const heroStar = page.querySelector('[data-gsap-hero-star]');

            if (hero && heroStar) {
                const moveStar = (event) => {
                    const bounds = hero.getBoundingClientRect();
                    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                    gsap.to(heroStar, {
                        x: x * 16,
                        y: y * 10,
                        rotate: x * 4,
                        duration: 0.7,
                        ease: 'power2.out',
                    });
                };
                const resetStar = () => {
                    gsap.to(heroStar, { x: 0, y: 0, rotate: 0, duration: 0.9, ease: 'power3.out' });
                };
                hero.addEventListener('pointermove', moveStar);
                hero.addEventListener('pointerleave', resetStar);
                cleanupListeners.push(() => {
                    hero.removeEventListener('pointermove', moveStar);
                    hero.removeEventListener('pointerleave', resetStar);
                });
            }

            // انيميشن كروت الصفوف
            const courseCards = page.querySelectorAll('[data-gsap-course-card]');
            if (courseCards.length > 0) {
                gsap.fromTo(courseCards, 
                    { 
                        y: 60, 
                        opacity: 0,
                        scale: 0.95
                    },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.15,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: page.querySelector('#courses'),
                            start: 'top 80%',
                        }
                    }
                );
            }
        }, page);

        return () => {
            cleanupListeners.forEach((cleanup) => cleanup());
            context.revert();
        };
    }, []);

    const scrollTrack = (direction) => {
        const track = trackRef.current;
        if (!track) return;
        const card = track.querySelector('[data-gsap-course]');
        const cardWidth = card ? card.getBoundingClientRect().width : 288;
        const gap = 24; // مطابق لـ gap-6
        const scrollAmount = (cardWidth + gap) * direction;
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    };

    return (
        <>
            <Head title="الرئيسية">
                {/*
                    "Cairo" هو الخط الوحيد للهوية — العناوين بأوزان ثقيلة
                    (800/900) والنصوص بأوزان أخف (400/500) عشان التدرج
                    يتحقق بالوزن مش بخط تاني. فضّل نقل الرابط ده لـ
                    app.blade.php لو مش موجود بالفعل.
                */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style>{`
                :root {
                    --ink: #081D33;
                    --indigo: #0B2A4A;
                    --indigo-deep: #071B30;
                    --indigo-light: #1769AA;
                    --gold: #C99A2E;
                    --gold-bright: #E8C874;
                    --parchment: #F8F7F2;
                    --parchment-deep: #EFEAdd;
                    --font-display: 'Cairo', system-ui, sans-serif;
                    --font-body: 'Cairo', system-ui, sans-serif;
                }
                .font-display { font-family: var(--font-display); letter-spacing: -0.01em; }
                .font-body { font-family: var(--font-body); }
                .star-draw { vector-effect: non-scaling-stroke; }
                .grain-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
                    mix-blend-mode: overlay;
                }
                .pull-quote-mark { font-family: var(--font-display); }

                .about-star-one {
                    animation: about-star-float-one 3s ease-in-out infinite;
                }

                .about-star-two {
                    animation: about-star-float-two 3.6s ease-in-out infinite;
                    animation-delay: 0.4s;
                }

                @keyframes about-star-float-one {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                    }
                    50% {
                        transform: translate(-12px, 14px) rotate(25deg) scale(1.18);
                    }
                }

                @keyframes about-star-float-two {
                    0%, 100% {
                        transform: translate(0, 0) rotate(0deg) scale(1);
                    }
                    50% {
                        transform: translate(13px, -12px) rotate(-25deg) scale(1.2);
                    }
                }


            `}</style>

            <div
                ref={pageRef}
                dir="rtl"
                className="font-body min-h-screen bg-[var(--parchment)] text-[var(--ink)] dark:bg-gray-950"
            >
                {/* الهيدر */}
                <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300 px-4 sm:px-6">
                    <div
                        className={
                            'mx-auto flex h-16 items-center justify-between transition-all duration-300 ' +
                            (scrolled
                                // شلنا الشفافية وخليناها لون صريح bg-[var(--indigo)] مع ظل قماشي عالي shadow-2xl وبوردر أوضح
                                ? 'mt-3 max-w-4xl rounded bg-[var(--indigo)] px-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-white/20'
                                : 'max-w-full bg-[var(--indigo)] px-6')
                        }
                    >
                        <Link href="/" className="flex items-center gap-2.5">
                            <Logo className="h-8 w-8" />
                            <span className="font-display text-[17px] font-bold tracking-wide text-white">دكتور ثانوي</span>
                        </Link>

                        {/* روابط الديسك توب */}
                        <nav className="hidden items-center gap-8 md:flex">
                            {navLinks.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className="relative text-sm text-white/70 transition hover:text-white after:absolute after:-bottom-1 after:right-0 after:h-px after:w-0 after:bg-[var(--gold)] after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {l.label}
                                </a>
                            ))}
                        </nav>

                        {/* أزرار الديسك توب */}
                        <div className="hidden items-center gap-3 md:flex">
                            <DarkModeToggle className="border-white/15 bg-white/10 text-white hover:bg-white/20" />
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    onClick={withSound()}
                                    className={`px-4 py-2 text-sm ${press3d.gold}`}
                                >
                                    لوحة التحكم
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} onClick={withSound()} className="text-sm text-white/70 hover:text-white">
                                        تسجيل الدخول
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={withSound()}
                                        className={`px-4 py-2 text-sm ${press3d.gold}`}
                                    >
                                        إنشاء حساب
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* زر الموبايل */}
                        <button
                            onClick={withSound(() => setMenuOpen((v) => !v))}
                            className={`p-2 ${press3d.ghostOnDark} md:hidden`}
                            aria-label="فتح القائمة"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* القائمة المنسدلة للموبايل */}
                    {menuOpen && (
                        <div className="mx-auto mt-2 max-w-4xl rounded bg-[var(--indigo)] p-5 shadow-2xl border border-white/20 md:hidden transition-all">
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                                <span className="text-xs text-white/60">الإعدادات والمظهر</span>
                                <DarkModeToggle className="border-white/15 bg-white/10 text-white hover:bg-white/20" />
                            </div>

                            <div className="space-y-1">
                                {navLinks.map((l) => (
                                    <a
                                        key={l.href}
                                        href={l.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="block rounded px-3 py-2.5 text-sm text-white/80 hover:bg-white/10 transition"
                                    >
                                        {l.label}
                                    </a>
                                ))}
                            </div>

                            <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        onClick={withSound()}
                                        className={`flex-1 px-4 py-2 text-center text-sm ${press3d.gold}`}
                                    >
                                        لوحة التحكم
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            onClick={withSound()}
                                            className={`flex-1 px-4 py-2 text-center text-sm font-normal text-white/80 ${press3d.ghostOnDark}`}
                                        >
                                            تسجيل الدخول
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            onClick={withSound()}
                                            className={`flex-1 px-4 py-2 text-center text-sm ${press3d.gold}`}
                                        >
                                            إنشاء حساب
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </header>
                <section
                    data-gsap-hero
                    className="relative overflow-hidden bg-[var(--indigo)] py-24 dark:bg-[#0B2A4A] lg:py-32"
                >
                    <div className="grain-overlay pointer-events-none absolute inset-0" />
                    <IslamicPattern
                        className="pattern-drift absolute inset-0 h-full w-full text-white"
                        opacity={0.07}
                    />

                    <div className="relative mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
                        <Reveal className="lg:col-span-7 [&>div]:relative">
                            <div data-gsap-hero-copy>
                                <p className="text-sm font-medium text-[var(--gold-bright)]">لطلاب الأزهر الشريف</p>
                                <h1 className="font-display mt-6 max-w-xl text-[clamp(2.25rem,5vw+1rem,4.2rem)] font-extrabold leading-[1.12] text-white">
                                    طريقك إلى مراجعة أذكى
                                    <br />
                                    وتفوّق أقرب
                                </h1>
                                <p className="mt-8 max-w-md text-[17px] leading-loose text-white/60">
                                    دكتور ثانوي منصة تعليمية متخصصة في مساعدة طلاب
                                    الثانوية الأزهرية على المراجعة والاستعداد للامتحانات
                                    بطريقة منظمة وفعّالة.
                                </p>

                                <div className="mt-10 flex items-center gap-4">
                                    {!auth.user && (
                                        <SecondaryButton
                                            href={route('register')}
                                            variant="gold"
                                            className="px-7 py-3.5 text-[15px]"
                                        >
                                            ابدأ الآن
                                        </SecondaryButton>
                                    )}

                                    <SecondaryButton
                                        variant="secondary"
                                        href="#courses"
                                        className="px-7 py-3.5 text-[15px]"
                                    >
                                        اكتشف المنصة
                                    </SecondaryButton>
                                </div>
                            </div>
                        </Reveal>

                        {/* نجمة العلم الكبرى — العنصر التوقيعي الوحيد في الهيرو، محاذية
                            في نفس منتصف عمود النص، بتترسم بخط ذهبي لحظة تحميل الصفحة */}
                        <div
                            data-gsap-hero-star
                            className="pointer-events-none relative col-span-5 mx-auto my-14 w-[60%] max-w-[320px] lg:mx-0 lg:my-0 lg:mr-auto lg:w-[80%] lg:max-w-[400px]"
                        >
                            <IlmStar
                                mode="stroke"
                                drawId="hero-star-path"
                                className="h-full w-full text-[var(--gold)] drop-shadow-[0_0_28px_rgba(201,154,46,0.25)]"
                            />
                            <img
                                src="/images/logo.webp"
                                alt="شعار دكتور ثانوي"
                                className="absolute inset-0 m-auto rounded h-14 w-14 object-contain"
                            />
                        </div>
                    </div>
                </section>

                {/* شريط انتقالي مائل بدل الحد الأفقي المستقيم التقليدي */}
                <div
                    className="relative h-10 bg-[var(--indigo)] dark:bg-[#0B2A4A]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 100%)' }}
                />

                {/* من نحن — تنسيق تحريري: اقتباس كبير بدل فقرة عادية */}
                <section id="about" className="relative overflow-hidden bg-white py-24 dark:bg-gray-900">
                    <IslamicPattern
                        className="pattern-drift absolute inset-0 h-full w-full text-[var(--indigo)] dark:text-white"
                        opacity={0.025}
                    />
                    <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-start">

                        <Reveal className="lg:col-span-4">
                            <p className="text-sm font-bold text-[var(--gold)]">من نحن؟</p>

                            <div className="mt-4 flex justify-center">
                                <AboutMark />
                            </div>
                        </Reveal>


                        <Reveal className="lg:col-span-8">
                            <p className="pull-quote-mark font-display text-3xl font-bold leading-[1.5] text-[var(--indigo)] sm:text-4xl dark:text-white">
                                نقدّم للطالب بيئة تعليمية تجمع بين المراجعة، والتدريب，
                                والاختبارات، وقياس المستوى؛ ليعرف ما أتقنه وما يحتاج
                                إلى مزيد من المراجعة، ويتقدم بثقة نحو هدفه.
                            </p>
                            <p className="mt-8 max-w-xl text-base leading-loose text-[var(--indigo)]/55 dark:text-white/55">
                                دكتور ثانوي طريقك إلى مراجعة أذكى وتفوق أقرب، مبني خصيصًا
                                لطبيعة مواد الثانوية الأزهرية ومنهجها.
                            </p>
                        </Reveal>
                    </div>
                </section>

                {/* المميزات — شبكة كثافة متفاوتة بدل بطاقات متطابقة */}
                <section id="features" className="relative overflow-hidden border-t border-[var(--indigo)]/5 bg-[var(--parchment)] py-24 dark:border-white/5 dark:bg-gray-950">
                    <IslamicPattern
                        className="pattern-drift absolute inset-0 h-full w-full text-[var(--indigo)] dark:text-white"
                        opacity={0.03}
                    />
                    <div className="relative mx-auto max-w-7xl px-6">
                        <Reveal className="mb-16 max-w-lg">
                            <h2 className="font-display text-4xl font-extrabold text-[var(--indigo)] sm:text-[2.75rem] dark:text-white">
                                لماذا دكتور ثانوي؟
                            </h2>
                            <StarDivider className="mt-5 justify-start text-[var(--gold)]" />
                            <p className="mt-5 text-base leading-relaxed text-[var(--indigo)]/50 dark:text-white/50">
                                كل ما تحتاجه عشان تراجع، تتدرّب، وتعرف مستواك في مكان واحد.
                            </p>
                        </Reveal>

                        <div className="grid gap-px overflow-hidden rounded border border-[var(--indigo)]/10 bg-[var(--indigo)]/10 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
                            {features.map((f, i) => {
                                // مصفوفة الأيقونات المعبرة لكل ميزة
                                const icons = [
                                    // 1. مراجعة منظمة (أيقونة تنظيم ومهام)
                                    <svg key="1" className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>,
                                    // 2. أسئلة متنوعة (أيقونة مستند أو علامة استفهام)
                                    <svg key="2" className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.225 12.162c.266-.616.82-1.048 1.49-1.152l2.673-.417a2.5 2.5 0 001.99-1.458l1.378-2.915a1.5 1.5 0 00-2.716-1.284l-.53 1.121a1 1 0 01-.896.556l-2.083.325a3 3 0 00-2.52 1.954l-1.026 2.822a1.5 1.5 0 002.714 1.284zM12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>,
                                    // 3. اختبارات وتقييم (أيقونة إحصائيات وتقدم)
                                    <svg key="3" className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>,
                                    // 4. اسأل وتعلّم (أيقونة فقاعات محادثة / نقاش)
                                    <svg key="4" className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                ];

                                return (
                                    <Reveal
                                        key={f.title}
                                        data-gsap-feature="true"
                                        className={`relative overflow-hidden bg-[var(--parchment)] px-7 py-10 transition-colors duration-300 hover:bg-white dark:bg-gray-950 dark:hover:bg-gray-900 ${
                                            i % 3 === 0 ? 'lg:py-14' : ''
                                        }`}
                                    >
                                        <IlmStar
                                            mode="fill"
                                            className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 text-[var(--indigo)]/[0.06] dark:text-white/[0.06]"
                                        />
                                        
                                        {/* حاوية الأيقونة مع تأثير جمالي خفيف */}
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--indigo)]/5 dark:bg-white/5 border border-[var(--indigo)]/10 dark:border-white/10">
                                            {icons[i]}
                                        </div>

                                        <h3 className="mt-6 text-lg font-semibold text-[var(--indigo)] dark:text-white">{f.title}</h3>
                                        <p className="mt-2.5 text-[14px] leading-relaxed text-[var(--indigo)]/50 dark:text-white/50">{f.desc}</p>
                                    </Reveal>
                                );
                                
                            })}
                        </div>
                    </div>
                </section>

                <LeaderboardSection data={leaderboard} />
                
                {latestCourses.length > 0 && (
                    <section id="courses" className="bg-[var(--parchment)] py-24 dark:bg-gray-950">
                        <div className="mx-auto max-w-7xl px-6">
                            <Reveal className="mb-10">
                                <h2 className="font-display mt-2 text-4xl font-extrabold text-[var(--indigo)] sm:text-[2.75rem] dark:text-white">
                                    الصفوف
                                </h2>
                                <StarDivider className="mt-5 justify-start text-[var(--gold)]" />
                            </Reveal>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {latestCourses.map((c) => (
                                    <Link
                                        key={c.id}
                                        data-gsap-course-card
                                        href={route('courses.show', c.id)}
                                        onClick={withSound()}
                                        className="group rounded border border-white/20 dark:border-white/10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl hover:border-[#1769AA]/40 dark:hover:border-white/25 transition-all hover:-translate-y-1 shadow-[0_25px_70px_-20px_rgba(11,42,74,0.35)] dark:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col"
                                    >
                                        <div className="p-3 pb-0">
                                            <div className="relative h-44 rounded bg-slate-900 overflow-hidden">
                                                {c.thumbnail ? (
                                                    <>
                                                        <img
                                                            src={c.thumbnail}
                                                            alt=""
                                                            aria-hidden="true"
                                                            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
                                                        />
                                                        <img
                                                            src={c.thumbnail}
                                                            alt={c.name}
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
                                                {c.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-gray-400 line-clamp-2 flex-1">
                                                {c.description}
                                            </p>
                                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
                                                <span className="inline-flex items-center gap-2 rounded bg-[#1769AA] pl-3 pr-1.5 py-1.5">
                                                    <span className="rounded bg-[#0B2A4A] text-[#E4C878] font-black text-sm px-2.5 py-1">
                                                        {Number(c.price) > 0 ? c.price : 'مجاني'}
                                                    </span>
                                                    {Number(c.price) > 0 && (
                                                        <span className="text-white text-xs font-medium">جنيهًا</span>
                                                    )}
                                                </span>
                                                <SecondaryButton> عرض الصف </SecondaryButton>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                
                {/* الهدف — قسم داكن بنجمة كبيرة نصف ظاهرة في الزاوية */}
                <section id="contact" className="relative overflow-hidden bg-[var(--indigo)] px-6 py-24 dark:bg-[#0B2A4A]">
                    <div className="grain-overlay pointer-events-none absolute inset-0" />
                    <IlmStar
                        mode="stroke"
                        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 text-[var(--gold)]/15 sm:h-80 sm:w-80"
                    />
                    <IlmStar
                        mode="stroke"
                        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 text-[var(--gold)]/10 sm:h-96 sm:w-96"
                    />
                    <Reveal className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
                        <p className="text-sm font-bold text-[var(--gold-bright)]">هدفنا</p>
                        <h2 className="font-display max-w-2xl text-3xl font-bold leading-relaxed text-white sm:text-4xl">
                            أن نجعل المراجعة أسهل، والتدريب أكثر فاعلية، والاستعداد للامتحان أكثر ثقة.
                        </h2>
                        <StarDivider className="text-white/40" />
                        <p className="text-base text-white/60">دكتور ثانوي... تعلّم، راجع، اختبر، وتقدّم.</p>
                        {!auth.user && (
                            <Link
                                href={route('register')}
                                onClick={withSound()}
                                className={`mt-2 px-8 py-3.5 text-[15px] ${press3d.gold}`}
                            >
                                ابدأ رحلتك الآن
                            </Link>
                        )}
                    </Reveal>
                </section>
                <Footer auth={auth} />
            </div>
            
        </>
    );
}
