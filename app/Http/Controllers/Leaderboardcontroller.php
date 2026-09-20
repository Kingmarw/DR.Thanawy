<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    private const TOP = 10;

    public function index(Request $request)
    {
        $user = $request->user();
        $grade = $user->grade;

        // الامتحانات الرسمية بس، وفي الكورسات اللي الطالب مشترك فيها
        $courseIds = $user->courses()->pluck('courses.id');

        $exams = Exam::query()
            ->where('is_active', true)
            ->where('type', 'exam')
            ->whereIn('course_id', $courseIds)
            ->with('course:id,name')
            ->orderBy('course_id')
            ->orderBy('order')
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'title' => $e->title,
                'course' => $e->course?->name,
            ]);

        // null = الترتيب العام (متوسط كل الامتحانات)
        $examId = $request->integer('exam_id') ?: null;
        if ($examId && ! $exams->contains('id', $examId)) {
            $examId = null;
        }

        $scopeIds = $examId ? [$examId] : $exams->pluck('id')->all();

        $ranking = $this->buildRanking($grade, $scopeIds);

        $top = $ranking->take(self::TOP);
        $meIndex = $ranking->search(fn ($r) => $r['user_id'] === $user->id);

        $users = User::whereIn('id', $top->pluck('user_id')->push($user->id))
            ->get(['id', 'name', 'profile_photo_url', 'profile_photo_path'])
            ->keyBy('id');

        $format = fn ($row, $i) => [
            'rank' => $i + 1,
            'name' => $this->displayName($users[$row['user_id']]->name),
            'photo' => $users[$row['user_id']]->profile_photo_url,
            'score' => $row['score'],
            'exams_done' => $row['exams_done'],
            'is_me' => $row['user_id'] === $user->id,
        ];

        return Inertia::render('Leaderboard/Index', [
            'exams' => $exams,
            'examId' => $examId,
            'grade' => $grade,
            'totalExams' => count($scopeIds),
            'top' => $top->map($format)->values(),
            // ترتيب الطالب لو مش في الأوائل (وطالما عنده نتيجة موجبة أصلاً)
            'me' => ($meIndex !== false && $meIndex >= self::TOP)
                ? $format($ranking[$meIndex], $meIndex)
                : null,
            'participants' => $ranking->count(),
        ]);
    }

    /**
     * أفضل محاولة لكل طالب في كل امتحان، لطلاب نفس الصف.
     * الدرجة = مجموع أفضل الدرجات ÷ عدد الامتحانات في النطاق
     * (امتحان لم يُحل = صفر، فمن حل أكتر يترتب أعلى).
     * الترتيب مخصص لأصحاب النتائج الفعلية: أي طالب مجموع درجاته صفر
     * (سواء متحلش الامتحان أو حله وجاب 0%) بيتستبعد من القائمة تمامًا،
     * بدل ما يظهر كأنه متصدّر الترتيب بدرجة صفر.
     * التعادل: اللي خلّص أول يتقدم.
     */
    private function buildRanking(?string $grade, array $scopeIds)
    {
        if (! $grade || empty($scopeIds)) {
            return collect();
        }

        $best = ExamAttempt::query()
            ->join('users', 'users.id', '=', 'exam_attempts.user_id')
            ->where('users.grade', $grade)
            ->where('users.is_admin', false)
            ->where('exam_attempts.status', 'completed')
            ->whereIn('exam_attempts.exam_id', $scopeIds)
            ->groupBy('exam_attempts.user_id', 'exam_attempts.exam_id')
            ->selectRaw('exam_attempts.user_id, exam_attempts.exam_id,
                MAX(exam_attempts.score_percent) as best,
                MIN(exam_attempts.finished_at) as first_at')
            ->get();

        $count = count($scopeIds);

        return $best->groupBy('user_id')
            ->map(fn ($g) => [
                'user_id' => (int) $g->first()->user_id,
                'score' => round($g->sum('best') / $count, 1),
                'exams_done' => $g->count(),
                'last_at' => $g->max('first_at'),
            ])
            ->filter(fn ($r) => $r['score'] > 0)
            ->sort(fn ($a, $b) => [$b['score'], $a['last_at']] <=> [$a['score'], $b['last_at']])
            ->values();
    }

    // خصوصية: الاسم الأول + أول حرف من الاسم التاني
    private function displayName(string $name): string
    {
        $parts = preg_split('/\s+/u', trim($name));

        return count($parts) > 1
            ? $parts[0] . ' ' . Str::substr($parts[1], 0, 1) . '.'
            : $parts[0];
    }
}