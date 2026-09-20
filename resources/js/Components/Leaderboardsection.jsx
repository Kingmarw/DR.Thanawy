import { Link } from '@inertiajs/react';
import { Trophy, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

// لو السيرفر بعت object بدل array (مفاتيح مش متسلسلة) نحوّله لمصفوفة
const toList = (v) => (Array.isArray(v) ? v : Object.values(v || {}));

const medalStyle = {
    1: 'bg-[var(--gold)] text-white',
    2: 'bg-slate-300 text-slate-800',
    3: 'bg-amber-700 text-white',
};

function Divider() {
    return (
        <div className="mt-5 flex items-center gap-2.5 text-[var(--gold)]" aria-hidden="true">
            <span className="h-px w-5 bg-current opacity-30" />
            <span className="h-2 w-2 rotate-45 bg-current" />
            <span className="h-px w-10 bg-current opacity-30" />
        </div>
    );
}

function LbAvatar({ src, name }) {
    const [failed, setFailed] = useState(false);

    return src && !failed ? (
        <img
            src={src}
            alt={name}
            onError={() => setFailed(true)}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
    ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
            <UserIcon className="h-5 w-5" />
        </span>
    );
}

function LbRow({ row }) {
    return (
        <li
            className={`flex items-center gap-3 rounded px-3 py-2.5 ${
                row.is_me
                    ? 'bg-[var(--gold)]/10 ring-1 ring-[var(--gold)]/50'
                    : 'bg-[var(--parchment)] dark:bg-gray-950'
            }`}
        >
            <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    medalStyle[row.rank] ??
                    'bg-[var(--indigo)]/10 text-[var(--indigo)] dark:bg-white/10 dark:text-white'
                }`}
            >
                {row.rank}
            </span>
            <LbAvatar src={row.photo} name={row.name} />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--indigo)] dark:text-white">
                {row.name}
                {row.is_me && <span className="ms-2 text-xs text-[var(--gold)]">(أنت)</span>}
            </span>
            <span className="font-display text-base font-extrabold text-[var(--indigo)] dark:text-white">
                {row.score}%
            </span>
        </li>
    );
}

/** الأوائل: ضيف = أول 3 من كل صف، مسجّل = أوائل صفه */
export default function LeaderboardSection({ data }) {
    if (!data) return null;

    const isGuest = data.mode === 'guest';
    const groups = toList(data.groups);
    const topRows = toList(data.top);
    const hasData = isGuest ? groups.length > 0 : topRows.length > 0;
    if (!hasData) return null;

    return (
        <section id="leaderboard" className="bg-white py-24 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10">
                    <p className="text-sm font-bold text-[var(--gold)]">المتفوقون</p>
                    <h2 className="font-display mt-2 text-4xl font-extrabold text-[var(--indigo)] sm:text-[2.75rem] dark:text-white">
                        أوائل المنصة
                    </h2>
                    <Divider />
                    <p className="mt-5 max-w-lg text-base text-[var(--indigo)]/50 dark:text-white/50">
                        {isGuest
                            ? 'أعلى الطلاب درجات في كل صف. سجّل وحل الامتحانات وشوف اسمك هنا.'
                            : `أوائل ${data.label ?? 'صفك'} — ${data.participants} طالب`}
                    </p>
                </div>

                {isGuest ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {groups.map((g) => (
                            <div
                                key={g.grade}
                                className="rounded border border-[var(--indigo)]/10 p-4 dark:border-white/10"
                            >
                                <h3 className="mb-3 flex items-center gap-2 font-bold text-[var(--indigo)] dark:text-white">
                                    <Trophy className="h-4 w-4 text-[var(--gold)]" />
                                    {g.label}
                                </h3>
                                <ul className="space-y-2">
                                    {toList(g.top).map((row) => (
                                        <LbRow key={row.rank} row={row} />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mx-auto max-w-2xl">
                        <ul className="space-y-2">
                            {topRows.map((row) => (
                                <LbRow key={row.rank} row={row} />
                            ))}
                        </ul>
                        <div className="mt-6 text-center">
                            <Link
                                href={route('leaderboard.index')}
                                className="text-sm font-semibold text-[var(--indigo)] underline dark:text-white"
                            >
                                عرض الترتيب حسب كل امتحان
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}