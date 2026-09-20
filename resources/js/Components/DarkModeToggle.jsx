import useDarkMode from '@/Hooks/useDarkMode';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle({ className = '' }) {
    const [isDark, toggle] = useDarkMode();

    return (
        <button
            onClick={toggle}
            type="button"
            role="switch"
            aria-label="تبديل الوضع الليلي"
            aria-checked={isDark}
            aria-pressed={isDark}
            title={isDark ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الليلي'}
            className={`
                relative
                h-9
                w-16
                shrink-0
                rounded
                border-2
                border-[#0B2A4A]/15
                bg-[#F8F7F2]
                shadow-inner
                transition-colors
                duration-200
                hover:bg-[#F8F7F2]/70

                focus:outline-none
                focus:ring-2
                focus:ring-[#C99A2E]/40
                focus:ring-offset-2

                dark:border-[#C99A2E]/30
                dark:bg-[#0B2A4A]
                dark:hover:bg-[#0B2A4A]/90
                dark:focus:ring-offset-[#0B2A4A]

                ${className}
            `}
        >
            {/* ☀️ الشمس - ناحية اليمين */}
            <Sun
                className={`
                    absolute
                    right-2
                    top-1/2
                    z-10
                    h-4
                    w-4
                    -translate-y-1/2
                    transition-all
                    duration-200
                    ${
                        isDark
                            ? 'scale-75 !text-[#C99A2E]/40 opacity-70'
                            : 'scale-100 !text-[#C99A2E] opacity-100'
                    }
                `}
                strokeWidth={2.4}
                aria-hidden="true"
            />

            {/* 🌙 القمر - ناحية الشمال */}
            <Moon
                className={`
                    absolute
                    left-2
                    top-1/2
                    z-10
                    h-4
                    w-4
                    -translate-y-1/2
                    transition-all
                    duration-200
                    ${
                        isDark
                            ? 'scale-100 !text-[#C99A2E] opacity-100'
                            : 'scale-75 !text-[#1769AA]/50 opacity-70'
                    }
                `}
                strokeWidth={2.4}
                aria-hidden="true"
            />

            {/* الدائرة المتحركة */}
            <span
                className={`
                    absolute
                    top-1/2
                    z-20
                    h-7
                    w-7
                    -translate-y-1/2
                    rounded
                    border
                    border-[#1769AA]/20
                    bg-white
                    shadow-md
                    transition-[right]
                    duration-200
                    ease-out

                    dark:border-[#C99A2E]/50
                    dark:bg-gradient-to-br
                    dark:from-[#1769AA]
                    dark:to-[#0B2A4A]

                    ${
                        isDark
                            ? 'right-[30px]'
                            : 'right-[3px]'
                    }
                `}
            />
        </button>
    );
}