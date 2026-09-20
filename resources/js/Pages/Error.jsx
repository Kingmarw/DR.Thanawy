import ArchIcon from '@/Components/ArchIcon';
import IslamicPattern from '@/Components/IslamicPattern';
import { press3d } from '@/Components/press3d';
import { usePressSound } from '@/Hooks/Usepresssound';
import { Head, Link } from '@inertiajs/react';

const statusContent = {
    403: {
        title: 'معندكش صلاحية توصل هنا',
        message: 'الصفحة دي محجوبة عنك، ممكن تكون محتاجة تسجّل دخول بحساب تاني.',
    },
    404: {
        title: 'الصفحة مش موجودة',
        message: 'يمكن الرابط اتغيّر أو الصفحة اتشالت. اتأكد من الرابط وارجع للرئيسية.',
    },
    419: {
        title: 'الجلسة انتهت',
        message: 'خد بالك، الصفحة كانت فاتحة لفترة طويلة. جرّب ترجع وتحاول تاني.',
    },
    429: {
        title: 'محاولات كتير قوي',
        message: 'استنى شوية وحاول تاني بعد لحظات.',
    },
    500: {
        title: 'حصل عطل من عندنا',
        message: 'إحنا بنشتغل على حل المشكلة. جرّب تاني بعد شوية.',
    },
    503: {
        title: 'الموقع تحت الصيانة',
        message: 'بنجهّز حاجات جديدة دلوقتي، هنرجع قريب جدًا.',
    },
};

export default function Error({ status }) {
    const content = statusContent[status] ?? statusContent[500];
    const playPressSound = usePressSound();

    return (
        <>
            <Head title={`خطأ ${status}`} />

            <div
                className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
                dir="rtl"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 50% at 85% 0%, rgba(201,154,46,0.16), transparent 60%),' +
                        'radial-gradient(ellipse 50% 60% at 10% 100%, rgba(23,105,170,0.28), transparent 60%),' +
                        'linear-gradient(160deg, #0B2A4A 0%, #123a63 55%, #0B2A4A 100%)',
                }}
            >
                {/* شبكة أقواس شبحية خافتة، بنفس روح الهيرو واللودر */}
                <svg className="pointer-events-none absolute -left-24 top-0 h-full w-[140%] opacity-[0.05]" viewBox="0 0 1400 500" fill="none" aria-hidden="true">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <path
                            key={i}
                            d={`M${i * 240} 500V${260} C${i * 240} ${140} ${i * 240 + 60} 60 ${i * 240 + 120} 60 C${i * 240 + 180} 60 ${i * 240 + 240} 140 ${i * 240 + 240} 260V500`}
                            stroke="#C99A2E"
                            strokeWidth="2"
                        />
                    ))}
                </svg>
                <IslamicPattern className="absolute inset-0 h-full w-full text-white" opacity={0.04} />

                <div className="error-enter relative flex max-w-md flex-col items-center text-center">
                    <div className="relative flex h-36 w-36 items-center justify-center">
                        {/* توهّج خافت خلف القوس */}
                        <div className="absolute h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
                        <svg viewBox="0 0 100 110" className="absolute h-full w-full" fill="none">
                            <path
                                d="M50 4C27 4 12 22 12 45v57c0 2.2 1.8 4 4 4h68c2.2 0 4-1.8 4-4V45C88 22 73 4 50 4Z"
                                stroke="#C99A2E"
                                strokeWidth="2.2"
                                fill="rgba(201,154,46,0.07)"
                            />
                        </svg>
                        <span
                            className="relative pt-2 text-4xl font-extrabold text-gold"
                            style={{ fontFamily: "'Reem Kufi','Cairo',sans-serif" }}
                        >
                            {status}
                        </span>
                    </div>

                    <ArchIcon className="mt-8 h-5 w-5" />
                    <h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{content.title}</h1>
                    <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/55">{content.message}</p>

                    <div className="mt-9 flex items-center gap-3">
                        <Link
                            href="/"
                            onClick={() => playPressSound()}
                            className={`px-7 py-3 text-[15px] ${press3d.gold}`}
                        >
                            الرجوع للرئيسية
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                playPressSound();
                                window.history.back();
                            }}
                            className={`px-7 py-3 text-[15px] ${press3d.goldOutlineOnDark}`}
                        >
                            رجوع للخلف
                        </button>
                    </div>
                </div>

                <style>{`
                    .error-enter {
                        animation: error-enter-fade 0.6s ease-out both;
                    }
                    @keyframes error-enter-fade {
                        from { opacity: 0; transform: translateY(14px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .error-enter { animation: none; }
                    }
                `}</style>
            </div>
        </>
    );
}