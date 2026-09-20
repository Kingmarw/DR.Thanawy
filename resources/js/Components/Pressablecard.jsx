// PressableCard.jsx
import { usePressSound } from './usePressSound';

export default function PressableCard({
    className = '',
    disabled = false,
    selected = false,
    sound = true,
    onClick,
    children,
    ...props
}) {
    const playPressSound = usePressSound('G5');

    const handleClick = (e) => {
        if (disabled) return;
        if (sound) {
            playPressSound();
        }
        onClick?.(e);
    };

    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-pressed={selected}
            aria-disabled={disabled}
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e);
                }
            }}
            {...props}
            className={[
                'select-none rounded-xl border-b-4 p-4 text-right shadow-sm transition-all duration-100 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 active:translate-y-1 active:border-b-0 dark:focus:ring-offset-gray-900',
                selected
                    ? 'border-[#0B2A4A] bg-[#1769AA] text-white'
                    : 'border-slate-300 bg-white text-gray-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
                disabled
                    ? 'cursor-not-allowed opacity-60 active:translate-y-0 active:border-b-4'
                    : 'cursor-pointer',
                className,
            ].join(' ')}
        >
            {children}
        </div>
    );
}