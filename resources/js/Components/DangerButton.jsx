export default function DangerButton({
    type = 'button',
    className = '',
    disabled = false,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                [
                    'inline-flex w-full items-center justify-center gap-2.5 rounded border-b-4 border-red-800 bg-red-600 px-6 py-3 text-base font-extrabold tracking-wide text-white shadow-sm transition-all duration-100 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 active:translate-y-1 active:border-b-0 dark:focus:ring-offset-gray-900',
                    disabled
                        ? 'cursor-not-allowed opacity-60 active:translate-y-0 active:border-b-4'
                        : 'cursor-pointer',
                    className,
                ].join(' ')
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}