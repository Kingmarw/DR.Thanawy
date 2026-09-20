import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Trophy, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

const grades = {
    first_secondary: 'الصف الأول الثانوي',
    second_secondary_science: 'الصف الثاني علمي',
    second_secondary_arts: 'الصف الثاني أدبي',
    third_secondary_science: 'الصف الثالث علمي',
    third_secondary_arts: 'الصف الثالث أدبي',
};

const medal = { 1: 'bg-yellow-400 text-yellow-900', 2: 'bg-gray-300 text-gray-800', 3: 'bg-amber-600 text-white' };

function Avatar({ src, name }) {
    const [failed, setFailed] = useState(false);
    return src && !failed ? (
        <img src={src} alt={name} onError={() => setFailed(true)} className="h-10 w-10 shrink-0 rounded-full object-cover" />
    ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-400 text-white">
            <UserIcon className="h-5 w-5" />
        </span>
    );
}

function Row({ row }) {
    return (
        <li
            className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                row.is_me
                    ? 'bg-indigo-50 ring-1 ring-indigo-300 dark:bg-indigo-950/40 dark:ring-indigo-700'
                    : 'bg-white dark:bg-gray-900'
            }`}
        >
            <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    medal[row.rank] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
            >
                {row.rank}
            </span>
            <Avatar src={row.photo} name={row.name} />
            <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-gray-900 dark:text-gray-100">
                    {row.name}
                    {row.is_me && <span className="ms-2 text-xs text-indigo-600 dark:text-indigo-400">(أنت)</span>}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">امتحانات محلولة: {row.exams_done}</div>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{row.score}%</div>
        </li>
    );
}

export default function Index({ exams, examId, grade, totalExams, top, me, participants }) {
    const onChange = (e) => {
        router.get(route('leaderboard.index'), e.target.value ? { exam_id: e.target.value } : {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="الأوائل" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <Trophy className="h-7 w-7 text-yellow-500" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">أوائل الصف</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {grades[grade] ?? 'حدد صفك من الملف الشخصي'} — {participants} طالب
                        </p>
                    </div>
                </div>
                {!examId && totalExams > 1 && (
                    <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                        الترتيب العام = متوسط أفضل درجة في كل امتحان (الامتحان اللي متحلش بيتحسب صفر).
                    </p>
                )}
                <select
                    value={examId ?? ''}
                    onChange={onChange}
                    className="mb-5 w-full rounded-md border-gray-300 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                >
                    <option value="">الترتيب العام (كل الامتحانات)</option>
                    {exams.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.course} — {e.title}
                        </option>
                    ))}
                </select>

                {top.length === 0 ? (
                    <p className="rounded-lg bg-white p-6 text-center text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        لسه محدش حل امتحان. كون أول واحد!
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {top.map((row) => (
                            <Row key={row.rank} row={row} />
                        ))}
                        {me && (
                            <>
                                <li className="py-1 text-center text-gray-400">⋯</li>
                                <Row row={me} />
                            </>
                        )}
                    </ul>
                )}


            </div>
        </AuthenticatedLayout>
    );
}