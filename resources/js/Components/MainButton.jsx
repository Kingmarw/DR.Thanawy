import { Link } from '@inertiajs/react';
import { usePressSound } from './usePressSound';

export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled = false,
    processing = false,
    sound = true,
    onClick,
    href,
    variant = 'secondary',
    children,
    ...props
}) {
    const isDisabled = disabled || processing;
    const playPressSound = usePressSound('A5');

    const handleClick = (e) => {
        if (sound) {
            playPressSound();
        }

        onClick?.(e);
    };

    const variants = {
        secondary: `
            border-b-[5px] border-slate-400
            bg-white
            text-[#1769AA]

            hover:bg-slate-50
            hover:shadow-[0_3px_0_rgba(0,0,0,0.12)]

            dark:border-slate-600
            dark:bg-gray-800
            dark:text-white
            dark:hover:bg-gray-700
        `,

        gold: `
            border-b-[5px] border-[#B88A1A]
            bg-gold
            text-[#0B2A4A]

            hover:bg-gold/95
            hover:shadow-[0_3px_0_rgba(184,138,26,0.25)]
        `,
    };

    const classes = [
        `
        inline-flex items-center justify-center gap-2.5
        rounded
        px-6 py-3
        text-base font-extrabold tracking-wide

        shadow-[0_2px_0_rgba(0,0,0,0.08)]

        transition-[transform,box-shadow,background-color,border-width]
        duration-100
        ease-out

        hover:-translate-y-[1px]

        active:translate-y-[4px]
        active:border-b-0
        active:shadow-none

        focus:outline-none
        focus:ring-2
        focus:ring-gold/50
        focus:ring-offset-2

        dark:focus:ring-offset-gray-900
        `,

        variants[variant] ?? variants.secondary,

        isDisabled
            ? `
            cursor-not-allowed
            opacity-60
            hover:translate-y-0
            hover:shadow-none
            active:translate-y-0
            active:border-b-[5px]
            `
            : 'cursor-pointer',

        className,
    ].join(' ');

    const content = (
        <>
            {processing && (
                <svg
                    className="h-5 w-5 animate-spin"
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
        </>
    );

    if (href) {
        return (
            <Link
                {...props}
                href={href}
                onClick={handleClick}
                className={classes}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            {...props}
            type={type}
            disabled={isDisabled}
            onClick={handleClick}
            className={classes}
        >
            {content}
        </button>
    );
}