// PrimaryButton.jsx
import * as Tone from 'tone';

// سينث واحد بس بيتعمل مرة واحدة لكل الصفحة (مش كل ضغطة) عشان الأداء
let clickSynth = null;

function getClickSynth() {
    if (!clickSynth) {
        clickSynth = new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
        }).toDestination();
        clickSynth.volume.value = -12; // خافت شوية عشان مايبقاش مزعج
    }
    return clickSynth;
}

async function playClickSound() {
    try {
        // المتصفحات بتمنع تشغيل الصوت قبل أول تفاعل من المستخدم،
        // فـ Tone.start() هنا بتتأكد إن الـ AudioContext شغّال (الضغطة نفسها هي التفاعل)
        await Tone.start();
        getClickSynth().triggerAttackRelease('C6', '32n');
    } catch (e) {
        // لو الصوت فشل لأي سبب، منسيبش الزرار يبوظ
        console.warn('تعذّر تشغيل صوت الزرار:', e);
    }
}

export default function PrimaryButton({
    type = 'button',
    className = '',
    disabled = false,
    processing = false,
    sound = true,
    onClick,
    children,
    ...props
}) {
    const isDisabled = disabled || processing;

    const handleClick = (e) => {
        if (sound) {
            playClickSound();
        }
        onClick?.(e);
    };

    return (
        <button
            {...props}
            type={type}
            disabled={isDisabled}
            onClick={handleClick}
            className={[
                'inline-flex w-full items-center justify-center gap-2.5 rounded border-b-4 border-[#0B2A4A] bg-[#1769AA] px-6 py-3 text-base font-extrabold tracking-wide text-white shadow-sm transition-all duration-100 hover:bg-[#1769AA]/90 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 active:translate-y-1 active:border-b-0 dark:focus:ring-offset-gray-900',
                isDisabled
                    ? 'cursor-not-allowed opacity-60 active:translate-y-0 active:border-b-4'
                    : 'cursor-pointer',
                className,
            ].join(' ')}
        >
            {processing && (
                <svg
                    className="h-5 w-5 animate-spin text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}