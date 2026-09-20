import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OfficialExam from './OfficialExam';
import { ArrowRight, FileText } from 'lucide-react';

export default function TakeExam({
    course,
    exam,
    attempts,
    lastAttemptAnswers,
    activeAttempt,
    enrolled,
    canAttempt,
    maxAttempts,
}) {
    return (
        <AuthenticatedLayout>
            <Head title={`${exam.title} - ${course.name}`} />
            <div className="min-h-screen bg-offwhite dark:bg-gray-950 text-slate-900 dark:text-white font-sans transition-colors duration-300" dir="rtl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link
                        href={route('courses.learn', course.id)}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-[#1769AA] dark:hover:text-gold transition mb-6 group"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        العودة لغرفة التعلم
                    </Link>

                    <div className="mb-6 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#1769AA]/10 dark:bg-gold/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#1769AA] dark:text-gold" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{exam.title}</h1>
                            <p className="text-sm text-slate-500 dark:text-gray-400">{course.name}</p>
                        </div>
                    </div>

                    <OfficialExam
                        exam={exam}
                        attempts={attempts}
                        lastAttemptAnswers={lastAttemptAnswers}
                        activeAttempt={activeAttempt}
                        enrolled={enrolled}
                        canAttempt={canAttempt}
                        maxAttempts={maxAttempts}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}