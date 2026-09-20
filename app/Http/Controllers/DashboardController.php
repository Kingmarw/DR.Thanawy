<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // الصفوف المشترك فيها الطالب
        $courses = $user->courses()->withCount('lessons')->get();

        // الدروس المكتملة لكل صف في استعلام واحد (بدل استعلام لكل صف)
        $doneByCourse = DB::table('lesson_completions')
            ->join('lessons', 'lessons.id', '=', 'lesson_completions.lesson_id')
            ->where('lesson_completions.user_id', $user->id)
            ->whereIn('lessons.course_id', $courses->pluck('id'))
            ->groupBy('lessons.course_id')
            ->selectRaw('lessons.course_id, COUNT(DISTINCT lesson_completions.lesson_id) as done')
            ->pluck('done', 'course_id');

        $coursesData = $courses->map(function ($course) use ($doneByCourse) {
            $total = $course->lessons_count;
            $done = min((int) ($doneByCourse[$course->id] ?? 0), $total);

            return [
                'id' => $course->id,
                'name' => $course->name,
                'progress' => $total > 0 ? (int) round(($done / $total) * 100) : 0,
                'lessonsDone' => $done,
                'lessonsTotal' => $total,
            ];
        });

        // المحاولات المكتملة فقط (المحاولة الجارية مش بتتحسب)
        $completedAttempts = ExamAttempt::where('user_id', $user->id)->where('status', 'completed');

        // أفضل درجة لكل امتحان: امتحان اتحل أكتر من مرة بيتحسب مرة واحدة بأعلى درجة
        $bestPerExam = (clone $completedAttempts)
            ->groupBy('exam_id')
            ->selectRaw('exam_id, MAX(score_percent) as best')
            ->get();

        $stats = [
            ['label' => 'مواد جارٍ مذاكرتها', 'value' => $coursesData->count()],
            ['label' => 'دروس مكتملة', 'value' => DB::table('lesson_completions')->where('user_id', $user->id)->count()],
            ['label' => 'اختبارات مكتملة', 'value' => $bestPerExam->count()],
            ['label' => 'متوسط الدرجات', 'value' => round($bestPerExam->avg('best') ?? 0) . '%'],
        ];

        // آخر 5 نتائج حقيقية
        $recentResults = (clone $completedAttempts)
            ->with('exam.course')
            ->latest('id')
            ->take(5)
            ->get()
            ->map(fn ($a) => [
                'subject' => $a->exam
                    ? $a->exam->title . ($a->exam->course ? ' — ' . $a->exam->course->name : '')
                    : 'امتحان محذوف',
                'date' => ($a->finished_at ?? $a->created_at)?->format('Y-m-d'),
                'score' => (int) round($a->score_percent ?? 0),
            ]);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'courses' => $coursesData,
            'recentResults' => $recentResults,
        ]);
    }
}