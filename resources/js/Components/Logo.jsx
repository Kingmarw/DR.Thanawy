/**
 * اللوجو أبيض بس (ملف: public/images/logo.png).
 * variant="onDark"  → يُستخدم مباشرة فوق خلفية غامقة (النافبار، البانر الكحلي)
 * variant="onLight" → يتحط جوه دائرة كحلية عشان يفضل واضح فوق خلفية فاتحة (الفوتر مثلاً)
 */
export default function Logo({ variant = 'onDark', className = 'h-9 w-9' }) {
    if (variant === 'onLight') {
        return (
            <span
                className={`flex items-center justify-center rounded bg-primary p-1.5 ${className}`}
            >
                <img src="/images/logo.webp" alt="دكتور ثانوي" className="h-full w-full object-contain" />
            </span>
        );
    }

    return (
        <img
            src="/images/logo.webp"
            alt="دكتور ثانوي"
            className={`object-contain ${className}`}
        />
    );
}