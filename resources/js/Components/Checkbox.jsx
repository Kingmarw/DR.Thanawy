export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded border-primary/25 text-gold focus:ring-gold/40 ' +
                'dark:border-white/20 dark:bg-gray-800 ' +
                className
            }
        />
    );
}