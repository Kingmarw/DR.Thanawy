export default function Divider({ children = 'OR', className = '' }) {
    return (
        <div
            className={`divider my-7 text-xs font-bold uppercase tracking-widest text-primary/35 dark:text-white/35 ${className}`}
        >
            {children}
        </div>
    );
}