// IconButton.jsx
import { usePressSound } from './usePressSound';

const sizeMap = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-14 w-14',
};

export default function IconButton({
    type = 'button',
    className = '',
    disabled = false,
    sound = true,
    size = 'md',
    label, // aria-label - مهم للـ accessibility لأنه مفيش نص جوه الزرار
    onClick,
    children,
    ...props
}) {
    const playPressSound = usePressSound('E6');

    const handleClick = (e) => {
        if (sound) {
            playPressSound();
        }
        onClick?.(e);
    };

    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            aria-label={label}
            onClick={handleClick}
            className={[
                'inline-flex items-center justify-center rounded-full border-b-4 border-[#0B2A4A] bg-[#1769AA] text-white shadow-sm transition-all duration-100 hover:bg-[#1769AA]/90 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 active:translate-y-1 active:border-b-0 dark:focus:ring-offset-gray-900',
                sizeMap[size] ?? sizeMap.md,
                disabled
                    ? 'cursor-not-allowed opacity-60 active:translate-y-0 active:border-b-4'
                    : 'cursor-pointer',
                className,
            ].join(' ')}
        >
            {children}
        </button>
    );
}