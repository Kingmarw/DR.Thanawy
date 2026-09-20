// press3d.js
// كلاسات مشتركة لأي عنصر قابل للضغط بإحساس 3D (border-b-4 يختفي وقت الضغط + نزول بسيط)
// المكان الوحيد اللي تتعدل فيه لو حبيت تغيّر إحساس الضغط في كل الموقع دفعة واحدة
export const press3d = {
    gold: 'rounded border-b-4 border-[#9A741F] bg-gold font-extrabold text-primary shadow-sm transition-all duration-100 hover:bg-[#D9AC3A] active:translate-y-0.5 active:border-b-2',
    goldOutlineOnDark:
        'rounded border-b-4 border-white/25 bg-white/5 font-bold text-white/90 shadow-sm transition-all duration-100 hover:bg-white/10 active:translate-y-0.5 active:border-b-2',
    ghostOnDark:
        'rounded border-b-4 border-white/20 bg-white/10 text-white/80 shadow-sm transition-all duration-100 hover:bg-white/20 active:translate-y-0.5 active:border-b-2',
    iconOnLight:
        'flex h-10 w-10 items-center justify-center rounded border-b-4 border-primary/25 text-primary shadow-sm transition-all duration-100 hover:bg-primary hover:text-white active:translate-y-0.5 active:border-b-2 dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-primary',
    // زرار مسطّح فاتح للأكشنز الثانوية (مثلاً جوه كارت أبيض)
    ghostOnLight:
        'rounded border-b-4 border-primary/20 bg-primary/5 font-bold text-primary shadow-sm transition-all duration-100 hover:bg-primary/10 active:translate-y-0.5 active:border-b-2 dark:border-white/15 dark:bg-white/5 dark:text-white',
};