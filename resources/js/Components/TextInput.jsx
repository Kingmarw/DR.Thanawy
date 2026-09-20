import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative">
            <input
                {...props}
                type={inputType}
                className={
                    'w-full rounded border-2 border-primary/15 bg-offwhite/60 px-5 py-3.5 text-base font-semibold text-primary shadow-[0_2px_10px_rgba(11,42,74,0.03)] transition duration-200 placeholder:font-normal placeholder:text-primary/30 hover:border-primary/30 focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:hover:border-white/20 ' +
                    (isPassword ? 'pe-14 ' : '') +
                    className
                }
                ref={localRef}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    className="absolute inset-y-0 end-3 flex items-center px-2 text-primary/35 transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-gold/40 dark:text-white/35 dark:hover:text-white"
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                </button>
            )}
        </div>
    );
});