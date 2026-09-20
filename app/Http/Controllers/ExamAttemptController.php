<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Services\ExamAttemptService;

class ExamAttemptController extends Controller
{
    /**
     * تسليم الامتحان. مبنقرأش أي إجابات من الطلب:
     * الدرجة بتتحسب من الإجابات اللي السيرفر سجّلها أثناء الحل.
     */
    public function store(Exam $exam, ExamAttemptService $service)
    {
        $user = auth()->user();

        abort_unless($exam->is_active, 404);
        abort_unless(
            $exam->course->users()->where('user_id', $user->id)->exists(),
            403,
            'يجب التسجيل في الصف أولاً.'
        );

        // المحاولة الجارية، ولو اتقفلت بسبب الوقت نرجّع آخر نتيجة بدل خطأ
        $attempt = ExamAttempt::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->where('status', 'in_progress')
            ->latest('id')
            ->first()
            ?? ExamAttempt::where('user_id', $user->id)
                ->where('exam_id', $exam->id)
                ->where('status', 'completed')
                ->latest('id')
                ->first();

        abort_unless($attempt, 409, 'لا توجد محاولة جارية لهذا الامتحان.');

        $attempt = $service->finalize($attempt);

        return back()->with('examResult', [
            'exam_id' => $exam->id,
            'score' => (float) $attempt->score_percent,
            'correct' => $attempt->correct_answers,
            'total' => $attempt->total_questions,
            'passed' => $exam->passing_score !== null && $attempt->score_percent >= $exam->passing_score,
        ]);
    }
}