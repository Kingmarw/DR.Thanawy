/**
 * زخرفة هندسية إسلامية بسيطة، تُستخدم كخلفية شفافة خفيفة.
 * تعتمد على تكرار نجمة ثمانية (نجمة الرُّب) بخطوط رفيعة.
 *
 * props:
 *  - className: للتحكم في الحجم/الموضع، وبرضو بيقدر يمرر متغيرات
 *    --pattern-color و --pattern-opacity (زي dark:[--pattern-opacity:0.08])
 *    عشان تفرّق شكل النمط بين اللايت والدارك من غير ما تعدل الكومبوننت
 *  - color / opacity: قيم افتراضية (fallback) لو معملتش override من الـ className
 */
export default function IslamicPattern({
    className = '',
    color = 'currentColor',
    opacity = 1,
    id = 'islamic-pattern',
}) {
    const patternId = `${id}-tile`;

    return (
        <svg
            className={className}
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                // لو الأب مرر --pattern-opacity هياخدها، لو لأ يرجع لقيمة الـ prop
                opacity: 'var(--pattern-opacity, ' + opacity + ')',
            }}
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id={patternId}
                    x="0"
                    y="0"
                    width="72"
                    height="72"
                    patternUnits="userSpaceOnUse"
                >
                    <g
                        fill="none"
                        stroke={`var(--pattern-color, ${color})`}
                        strokeWidth="1"
                    >
                        {/* نجمة ثمانية مركزية */}
                        <path d="M36 6 L46 26 L66 36 L46 46 L36 66 L26 46 L6 36 L26 26 Z" />
                        {/* إطار مربع يربط الوحدات ببعض */}
                        <rect x="0.5" y="0.5" width="71" height="71" />
                        {/* أقواس صغيرة في الأركان تلمّح لشكل المحراب */}
                        <path d="M0 36 A36 36 0 0 1 36 0" />
                        <path d="M72 36 A36 36 0 0 1 36 72" />
                    </g>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
    );
}