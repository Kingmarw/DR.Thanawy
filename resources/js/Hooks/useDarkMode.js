import { useEffect, useState } from 'react';

/**
 * بيدير حالة الوضع الليلي: بيقرأ القيمة المحفوظة (أو تفضيل النظام)
 * عند التحميل، وبيحدّث كلاس "dark" على <html> وlocalStorage عند التبديل.
 */
export default function useDarkMode() {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains('dark'),
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggle = () => setIsDark((v) => !v);

    return [isDark, toggle];
}