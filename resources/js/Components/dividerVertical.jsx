export default function DividerVertical() {
    return (
        <div className="my-7 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/35 dark:text-white/35">
            <span className="h-px flex-1 bg-primary/10 dark:bg-white/10" />
            <span>أو</span>
            <span className="h-px flex-1 bg-primary/10 dark:bg-white/10" />
        </div>
    );
}