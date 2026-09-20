// ArchIcon.jsx
/** أيقونة قوس صغيرة خطية، تُستخدم كعنصر تمييز متكرر بدل الأيقونات العامة */
export default function ArchIcon({ className = 'h-6 w-6', color = '#C99A2E' }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
            <path
                d="M4 20V11C4 6.6 7.6 3 12 3s8 3.6 8 8v9"
                stroke={color}
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}