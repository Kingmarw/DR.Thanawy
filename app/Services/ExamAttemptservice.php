<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\ExamAttemptAnswer;
use App\Models\Question;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * كل منطق المحاولات في مكان واحد. السيرفر هو المصدر الوحيد للحقيقة:
 * وقت البداية، الإجابات المسجّلة، والدرجة. الفرونت مجرد واجهة.
 */
class ExamAttemptService
{
    /** سماح بسيط (ثواني) لتأخر الشبكة وقت التسليم التلقائي */
    private const GRACE_SECONDS = 5;

    public function maxAttempts(Exam $exam): ?int
    {
        return $exam->type === 'exam' ? ($exam->max_attempts ?? 1) : null;
    }

    public function completedCount(User $user, Exam $exam): int
    {
        return ExamAttempt::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->where('status', 'completed')
            ->count();
    }

    public function canAttempt(User $user, Exam $exam): bool
    {
        $max = $this->maxAttempts($exam);

        return $max === null || $this->completedCount($user, $exam) < $max;
    }

    /** المحاولة الجارية (لو وقتها خلص بتتقفل أوتوماتيك وترجع null) */
    public function activeAttempt(User $user, Exam $exam): ?ExamAttempt
    {
        $attempt = ExamAttempt::with('exam')
            ->where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->where('status', 'in_progress')
            ->latest('id')
            ->first();

        if (! $attempt) {
            return null;
        }

        if ($this->isExpired($attempt)) {
            $this->finalize($attempt);

            return null;
        }

        return $attempt;
    }

    public function deadline(ExamAttempt $attempt): ?\Carbon\CarbonInterface
    {
        $minutes = $attempt->exam->duration_minutes;

        return $minutes ? $attempt->started_at->copy()->addMinutes($minutes) : null;
    }

    public function isExpired(ExamAttempt $attempt): bool
    {
        $deadline = $this->deadline($attempt);

        return $deadline && now()->getTimestamp() > $deadline->getTimestamp() + self::GRACE_SECONDS;
    }

    public function remainingSeconds(ExamAttempt $attempt): ?int
    {
        $deadline = $this->deadline($attempt);

        return $deadline ? max(0, $deadline->getTimestamp() - now()->getTimestamp()) : null;
    }

    /** بداية محاولة جديدة (أو استكمال الجارية) — آمنة ضد الضغط المزدوج */
    public function start(User $user, Exam $exam): ExamAttempt
    {
        return DB::transaction(function () use ($user, $exam) {
            // قفل صف الطالب: بيسلسل الطلبات المتزامنة بتاعته بس
            User::whereKey($user->id)->lockForUpdate()->first();

            if ($active = $this->activeAttempt($user, $exam)) {
                return $active;
            }

            abort_unless(
                $this->canAttempt($user, $exam),
                403,
                'لقد استنفدت عدد المحاولات المسموح بها لهذا الامتحان.'
            );

            $total = $exam->questions()->count();
            abort_if($total === 0, 422, 'لا توجد أسئلة في هذا الامتحان بعد.');

            return ExamAttempt::create([
                'user_id' => $user->id,
                'exam_id' => $exam->id,
                'total_questions' => $total,
                'correct_answers' => 0,
                'score_percent' => 0,
                'status' => 'in_progress',
                'started_at' => now(),
                'finished_at' => null,
            ]);
        });
    }

    /** تسجيل إجابة سؤال. لو السؤال اتجاوب قبل كده بيرجع الإجابة الأولى (مفيش تعديل) */
    public function recordAnswer(ExamAttempt $attempt, Question $question, int $optionId): ExamAttemptAnswer
    {
        $correctId = $question->correctOption?->id;

        return ExamAttemptAnswer::firstOrCreate(
            ['exam_attempt_id' => $attempt->id, 'question_id' => $question->id],
            [
                'selected_option_id' => $optionId,
                'is_correct' => $correctId !== null && $correctId === $optionId,
            ]
        );
    }

    /** إنهاء المحاولة وحساب الدرجة من الإجابات المسجّلة في السيرفر فقط */
    public function finalize(ExamAttempt $attempt): ExamAttempt
    {
        return DB::transaction(function () use ($attempt) {
            $attempt = ExamAttempt::with('exam')->whereKey($attempt->id)->lockForUpdate()->first();

            if ($attempt->status === 'completed') {
                return $attempt;
            }

            $questionIds = Question::where('exam_id', $attempt->exam_id)->pluck('id');
            $total = $questionIds->count();

            $correct = ExamAttemptAnswer::where('exam_attempt_id', $attempt->id)
                ->whereIn('question_id', $questionIds)
                ->where('is_correct', true)
                ->count();

            // لو الوقت خلص، وقت الانتهاء = آخر الوقت المسموح (مش لحظة ما الطالب رجع)
            $deadline = $this->deadline($attempt);
            $finishedAt = ($deadline && now()->greaterThan($deadline)) ? $deadline : now();

            $attempt->update([
                'total_questions' => $total,
                'correct_answers' => $correct,
                'score_percent' => $total > 0 ? round(($correct / $total) * 100, 2) : 0,
                'status' => 'completed',
                'finished_at' => $finishedAt,
            ]);

            return $attempt;
        });
    }
}