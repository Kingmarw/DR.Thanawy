export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label {...props} className={`block text-sm font-medium text-primary/80 dark:text-white/80 ${className}`}>
            {value ? value : children}
        </label>
    );
}