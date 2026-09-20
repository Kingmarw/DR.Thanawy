import Logo from '@/Components/Logo';
import { router } from '@inertiajs/react';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

const STAR_POINTS = [
    [100, 10], [114.16, 65.82], [163.64, 36.36], [134.18, 85.84],
    [190, 100], [134.18, 114.16], [163.64, 163.64], [114.16, 134.18],
    [100, 190], [85.84, 134.18], [36.36, 163.64], [65.82, 114.16],
    [10, 100], [65.82, 85.84], [36.36, 36.36], [85.84, 65.82],
];

const STAR_PATH_D = `M${STAR_POINTS.map((p) => p.join(',')).join(' L')} Z`;

export default function PageLoader() {
    const [visible, setVisible] = useState(false);
    const overlayRef = useRef(null);
    const starRef = useRef(null);
    const glowRef = useRef(null);
    const logoRef = useRef(null);
    const beadsRef = useRef([]);
    const hideTimeout = useRef(null);

    useEffect(() => {
        const showLoader = () => {
            clearTimeout(hideTimeout.current);
            setVisible(true);
        };

        const hideLoader = () => {
            // زمن إضافي قصير جداً لضمان انتهاء حركة الخروج بسلاسة
            hideTimeout.current = setTimeout(() => setVisible(false), 200);
        };

        const removeStart = router.on('start', showLoader);
        const removeFinish = router.on('finish', hideLoader);

        return () => {
            removeStart();
            removeFinish();
            clearTimeout(hideTimeout.current);
        };
    }, []);

    useEffect(() => {
        if (!visible || !overlayRef.current) return undefined;

        const ctx = gsap.context(() => {
            // ظهور الخلفية والنافذة بتلاشي ناعم
            gsap.fromTo(
                overlayRef.current,
                { autoAlpha: 0 },
                { autoAlpha: 1, duration: 0.2, ease: 'power2.out' }
            );

            // دخول النجمة بانيميشن مرن مع دوران خفيف
            gsap.fromTo(
                starRef.current,
                { rotate: -15, scale: 0.85, autoAlpha: 0 },
                { rotate: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );

            // توهج ذهبي داخلي يتحرك بصعود وهبوط مستمر داخل النجمة
            gsap.fromTo(
                glowRef.current,
                { attr: { y: 200 } },
                {
                    attr: { y: -20 },
                    duration: 1.4,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1,
                }
            );

            // حركة تنفس خفيفة للشعار في المنتصف
            gsap.to(logoRef.current, {
                scale: 1.12,
                duration: 1.2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
            });

            // نبض متتابع لحبات المسبحة بوضوح واحترافية
            gsap.fromTo(
                beadsRef.current,
                { scale: 1, backgroundColor: 'rgba(201, 154, 46, 0.4)' },
                {
                    scale: 1.5,
                    backgroundColor: '#E4C878',
                    duration: 0.4,
                    ease: 'sine.inOut',
                    stagger: { each: 0.15, repeat: -1, yoyo: true },
                }
            );
        }, overlayRef);

        return () => ctx.revert();
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            ref={overlayRef}
            role="status"
            aria-live="polite"
            aria-label="جارٍ التحميل"
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden backdrop-blur-md"
            style={{
                background:
                    'radial-gradient(ellipse 60% 50% at 85% 0%, rgba(201,154,46,0.22), transparent 60%),' +
                    'radial-gradient(ellipse 50% 60% at 10% 100%, rgba(23,105,170,0.35), transparent 60%),' +
                    'linear-gradient(160deg, #0B2A4A 0%, #0d345c 55%, #0B2A4A 100%)',
            }}
        >
            {/* خلفية هندسية إسلامية خافتة ومتناسقة مع الهوية */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" viewBox="0 0 1400 900" fill="none" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <path
                        key={i}
                        d={`M${i * 220} 900V${300} C${i * 220} ${150} ${i * 220 + 50} 80 ${i * 220 + 110} 80 C${i * 220 + 170} 80 ${i * 220 + 220} 150 ${i * 220 + 220} 300V900`}
                        stroke="#C99A2E"
                        strokeWidth="1.5"
                    />
                ))}
            </svg>

            <div className="relative flex flex-col items-center gap-6">
                {/* نجمة العلوم الهندسية مع تأثير الإضاءة الداخلية */}
                <div ref={starRef} className="relative h-32 w-32 drop-shadow-[0_10px_25px_rgba(11,42,74,0.5)]">
                    <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
                        <defs>
                            <clipPath id="loaderStarClip" clipPathUnits="userSpaceOnUse">
                                <path d={STAR_PATH_D} />
                            </clipPath>
                            <linearGradient id="loaderStarGlow" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#E4C878" stopOpacity="0.85" />
                                <stop offset="100%" stopColor="#E4C878" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <g clipPath="url(#loaderStarClip)">
                            {/* مستطيل التوهج المتحرك داخل حدود النجمة */}
                            <rect ref={glowRef} x="0" y="200" width="200" height="120" fill="url(#loaderStarGlow)" />
                        </g>

                        <path
                            d={STAR_PATH_D}
                            stroke="#C99A2E"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            fill="rgba(11, 42, 74, 0.45)"
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div ref={logoRef}>
                            <Logo className="h-11 w-11 text-gold" />
                        </div>
                    </div>
                </div>

                {/* اسم المنصة بخط أنيق */}
                <span
                    className="text-base font-bold tracking-[0.25em] text-[#E4C878] drop-shadow-sm"
                    style={{ fontFamily: "'Reem Kufi', 'Cairo', sans-serif" }}
                >
                    دكتور ثانوي
                </span>

                {/* نقاط التحميل (المسبحة) بتصميم بارز ومرتب */}
                <div className="flex items-center gap-3.5 pt-1">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            ref={(el) => (beadsRef.current[i] = el)}
                            className="h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(228,200,120,0.6)]"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}