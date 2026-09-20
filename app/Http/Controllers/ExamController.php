<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\User;
use App\Services\ExamAttemptService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function __construct(private ExamAttemptService $attempts)
    {
    }

    /** لازم الامتحان مفعّل والطالب مشترك في الكورس */
    private function authorizeExam(Exam $exam): User
    {
        $user = auth()->user();

        abort_unless($exam->is_active, 404);
        abort_unless(
            $exam->course->users()->where('user_id', $user->id)->exists(),
            403,
            'يجب التسجيل في الصف أولاً.'
        );

        return $user;
    }

    public function show($courseId, Exam $exam)
    {
        $course = $exam->course;
        abort_if($course->id != $courseId, 404);

        $user = $this->authorizeExam($exam);

        // لو وقت محاولة جارية خلص، بتتقفل هنا قبل ما نحسب أي حاجة
        $active = $this->attempts->activeAttempt($user, $exam);

        $maxAttempts = $this->attempts->maxAttempts($exam);
        $canAttempt = $this->attempts->canAttempt($user, $exam);

        $completed = ExamAttempt::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->where('status', 'completed')
            ->orderByDesc('id')
            ->get();

        $attempts = $completed->map(fn ($a) => [
            'id' => $a->id,
            'score_percent' => $a->score_percent,
            'status' => $a->status,
            'correct_answers' => $a->correct_answers,
            'total_questions' => $a->total_questions,
            'created_at' => $a->created_at->format('Y-m-d H:i'),
        ]);

        // المراجعة (فيها الإجابات الصح): للتدريبات دايمًا، وللامتحان الرسمي بعد ما المحاولات تخلص بس
        $reviewAllowed = ! $active
            && $completed->isNotEmpty()
            && ($exam->type !== 'exam' || ! $canAttempt);

        $exam->load(['questions.options', 'questions.correctOption']);

        $activeAnswers = [];
        if ($active) {
            $activeAnswers = $active->answers()->get()
                ->mapWithKeys(function ($a) use ($exam) {
                    $q = $exam->questions->firstWhere('id', $a->question_id);

                    return [$a->question_id => [
                        'question_id' => $a->question_id,
                        'selected_option_id' => $a->selected_option_id,
                        'is_correct' => (bool) $a->is_correct,
                        'correct_option_id' => $q?->correctOption?->id,
                        'explanation' => $q?->explanation,
                    ]];
                })->all();
        }

        $lastAttemptAnswers = [];
        if ($reviewAllowed) {
            $saved = $completed->first()->answers()->get()->keyBy('question_id');

            $lastAttemptAnswers = $exam->questions->mapWithKeys(fn ($q) => [
                $q->id => [
                    'selected_option_id' => $saved->get($q->id)?->selected_option_id,
                    'is_correct' => (bool) $saved->get($q->id)?->is_correct,
                    'correct_option_id' => $q->correctOption?->id,
                    'explanation' => $q->explanation,
                ],
            ])->all();
        }

        // الأسئلة بتتبعت بس أثناء محاولة جارية أو في المراجعة — مش قبل ما الطالب يبدأ
        $sendQuestions = $active || $reviewAllowed;

        return Inertia::render('Courses/TakeExam', [
            'course' => ['id' => $course->id, 'name' => $course->name],
            'exam' => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'type' => $exam->type,
                'duration_minutes' => $exam->duration_minutes,
                'passing_score' => $exam->passing_score,
                'questions_count' => $exam->questions->count(),
                'questions' => $sendQuestions
                    ? $exam->questions->map(fn ($q) => [
                        'id' => $q->id,
                        'question_text' => $q->question_text,
                        'options' => $q->options->map(fn ($o) => [
                            'id' => $o->id,
                            'option_text' => $o->option_text,
                        ]),
                    ])->values()
                    : [],
            ],
            'attempts' => $attempts,
            'lastAttemptAnswers' => $lastAttemptAnswers,
            'activeAttempt' => $active ? [
                'id' => $active->id,
                'remaining_seconds' => $this->attempts->remainingSeconds($active),
                'answers' => $activeAnswers,
            ] : null,
            'enrolled' => true,
            'canAttempt' => $canAttempt,
            'maxAttempts' => $maxAttempts,
        ]);
    }

    /** الطالب بيضغط "ابدأ الامتحان" — هنا بس بيبدأ الوقت */
    public function start(Exam $exam)
    {
        $user = $this->authorizeExam($exam);

        $this->attempts->start($user, $exam);

        return back();
    }

    /**
     * تصحيح فوري لسؤال واحد داخل محاولة جارية.
     * الإجابة بتتسجّل وتتقفل في السيرفر، فمفيش طريقة تجرّب اختيارات كتير وتاخد الصح.
     */
    public function checkAnswer(Request $request, Exam $exam)
    {
        $user = $this->authorizeExam($exam);

        $attempt = $this->attempts->activeAttempt($user, $exam);
        abort_unless($attempt, 409, 'لا توجد محاولة جارية، أو انتهى وقت الامتحان.');

        $validated = $request->validate([
            'question_id' => 'required|integer',
            'selected_option_id' => 'required|integer',
        ]);

        $question = $exam->questions()->with('correctOption')->findOrFail($validated['question_id']);

        abort_unless(
            $question->options()->where('id', $validated['selected_option_id'])->exists(),
            422,
            'اختيار غير صالح لهذا السؤال.'
        );

        $answer = $this->attempts->recordAnswer($attempt, $question, (int) $validated['selected_option_id']);

        return response()->json([
            'question_id' => $question->id,
            'selected_option_id' => $answer->selected_option_id,
            'is_correct' => (bool) $answer->is_correct,
            'correct_option_id' => $question->correctOption?->id,
            'explanation' => $question->explanation,
        ]);
    }
}