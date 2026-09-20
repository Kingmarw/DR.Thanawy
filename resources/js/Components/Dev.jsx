function DevCredit() {
    return (
        <div
            dir="ltr"
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-sm sm:text-base"
        >
            <span className="font-semibold text-white">&lt;</span>
            <span className="font-semibold text-[#c586c0]">
                Developed by
            </span>

            <a
                href="https://webbasma.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#e8c874] transition-colors hover:text-[#c99a2e] hover:underline"
            >
                Webbasma
            </a>

            <span className="text-[var(--indigo)]/35 dark:text-white/35">
                ,
            </span>

            <a
                href="https://kingmarw.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#e8c874] transition-colors hover:text-[#c99a2e] hover:underline"
            >
                Marwan
            </a>
            <span className="font-semibold text-white">/ &gt;</span>
        </div>
    );
}

export default DevCredit;