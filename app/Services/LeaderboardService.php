<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class LeaderboardService
{
    public const GRADES = [
        'first_secondary' => 'الصف الأول الثانوي',
        'second_secondary_science' => 'الصف الثاني علمي',
        'second_secondary_arts' => 'الصف الثاني أدبي',
        'third_secondary_science' => 'الصف الثالث علمي',
        'third_secondary_arts' => 'الصف الثالث أدبي',
    ];

    /**
     * ضيف: أول 3 من كل صف.
     * مسجّل دخول: أول 10 من صفه (ولو خارجهم بيظهر ترتيبه تحتهم).
     */
    public function forWelcome(?User $user): array
    {
        if ($user && ! $user->is_admin && $user->grade) {
            return $this->forUser($user);
        }

        // الصفحة الرئيسية عامة وبتتفتح كتير، فنخزّن النتيجة 10 دقايق
        return Cache::remember('leaderboard.guest', 600, fn () => $this->forGuest());
    }

    private function forGuest(): array
    {
        $scope = Exam::where('is_active', true)->where('type', 'exam')->pluck('id')->all();

        $groups = [];
        foreach (self::GRADES as $grade => $label) {
            $top = $this->hydrate($this->ranking($grade, $scope)->take(3));
            if ($top->isNotEmpty()) {
                $groups[] = ['grade' => $grade, 'label' => $label, 'top' => $top->values()->all()];
            }
        }

        return ['mode' => 'guest', 'groups' => array_values($groups)];
    }

    private function forUser(User $user): array
    {
        $scope = Exam::where('is_active', true)
            ->where('type', 'exam')
            ->whereIn('course_id', $user->courses()->pluck('courses.id'))
            ->pluck('id')
            ->all();

        $ranking = $this->ranking($user->grade, $scope);
        $meIndex = $ranking->search(fn ($r) => $r['user_id'] === $user->id);

        $rows = $ranking->take(10);
        if ($meIndex !== false && $meIndex >= 10) {
            $rows->put($meIndex, $ranking[$meIndex]);
        }

        return [
            'mode' => 'user',
            'label' => self::GRADES[$user->grade] ?? null,
            'participants' => $ranking->count(),
            'top' => $this->hydrate($rows, $user->id)->values()->all(),
        ];
    }

    /**
     * أفضل محاولة لكل طالب في كل امتحان → متوسط الدرجات → ترتيب.
     * الطلاب اللي مجموع درجاتهم صفر (متحلوش أي امتحان بنجاح ولو جزئي)
     * بيتستبعدوا من الترتيب تمامًا.
     */
    private function ranking(string $grade, array $scopeIds)
    {
        if (empty($scopeIds)) {
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

    /** $rows مفاتيحها = ترتيب الطالب - 1 */
    private function hydrate($rows, ?int $meId = null)
    {
        $users = User::whereIn('id', $rows->pluck('user_id'))
            ->get(['id', 'name', 'profile_photo_url', 'profile_photo_path'])
            ->keyBy('id');

        return $rows->map(fn ($r, $i) => [
            'rank' => $i + 1,
            'name' => $this->displayName($users[$r['user_id']]->name),
            'photo' => $users[$r['user_id']]->profile_photo_url,
            'score' => $r['score'],
            'is_me' => $meId !== null && $r['user_id'] === $meId,
        ]);
    }

    private function displayName(string $name): string
    {
        $p = preg_split('/\s+/u', trim($name));

        return count($p) > 1 ? $p[0] . ' ' . Str::substr($p[1], 0, 1) . '.' : $p[0];
    }
}