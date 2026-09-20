<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LessonCompletion;
use App\Models\Lesson;
use App\Models\LessonQuestion;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Lesson $lesson)
    {
        // يمكن استخدامها لو عرض الدرس في صفحة مستقلة، 
        // لكننا نعتمد حالياً على دالة الـ learn في CourseController لتجربة يوديمي المتكاملة.
    }

    /**
     * تسجيل الدرس كمكتمل للطالب الحالي
     */
    public function complete(Lesson $lesson)
    {
        $user = auth()->user();
        abort_unless($user, 401, 'يجب تسجيل الدخول أولاً.');

        $enrolled = $lesson->course()
            ->whereHas('users', fn ($q) => $q->where('user_id', $user->id))
            ->exists();

        abort_unless($enrolled, 403, 'يجب التسجيل في الصف أولاً.');

        LessonCompletion::firstOrCreate([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);

        return back();
    }

    /**
     * تخزين سؤال جديد من طالب حول درس معين
     */
    public function askQuestion(Request $request, Lesson $lesson)
    {
        $request->validate([
            'question' => 'required|string|max:2000',
            'is_private' => 'nullable|boolean',
        ]);

        $user = auth()->user();
        abort_unless($user, 401, 'يجب تسجيل الدخول أولاً.');

        // التحقق من أن الطالب مسجل في الكورس
        $enrolled = $lesson->course()
            ->whereHas('users', fn ($q) => $q->where('user_id', $user->id))
            ->exists();

        abort_unless($enrolled, 403, 'يجب التسجيل في الكورس أولاً لطرح الأسئلة.');

        LessonQuestion::create([
            'lesson_id' => $lesson->id,
            'user_id' => $user->id,
            'question' => $request->question,
            'is_private' => $request->is_private ?? false,
        ]);

        return back()->with('success', 'تم إرسال سؤالك بنجاح!');
    }

    /**
     * عرض أسئلة درس معين (للطلاب والمدرسين)
     */
    public function getQuestions(Lesson $lesson)
    {
        $user = auth()->user();
        abort_unless($user, 401, 'يجب تسجيل الدخول أولاً.');
        
        // التحقق من صلاحيات الوصول
        $isInstructor = $user->is_admin ?? false;
        $isEnrolled = $lesson->course()
            ->whereHas('users', fn ($q) => $q->where('user_id', $user->id))
            ->exists();

        abort_unless($isInstructor || $isEnrolled, 403, 'ليس لديك صلاحية لعرض أسئلة هذا الدرس.');

        $query = LessonQuestion::with(['student', 'instructor'])
            ->where('lesson_id', $lesson->id);

        // إذا لم يكن المدرس، اعرض فقط الأسئلة العامة أو أسئلته الخاصة
        if (!$isInstructor) {
            $query->where(function($q) use ($user) {
                $q->where('is_private', false)
                  ->orWhere('user_id', $user->id);
            });
        }

        $questions = $query->orderBy('created_at', 'desc')->get();

        return response()->json($questions);
    }

    /**
     * إضافة إجابة من المدرس على سؤال
     */
    public function answerQuestion(Request $request, LessonQuestion $question)
    {
        $request->validate([
            'answer' => 'required|string',
        ]);

        $user = auth()->user();
        abort_unless($user, 401, 'يجب تسجيل الدخول أولاً.');

        // التحقق من أن المستخدم مدرس (admin)
        abort_unless($user->is_admin ?? false, 403, 'فقط المدرسون يمكنهم الإجابة على الأسئلة.');

        $question->update([
            'answer' => $request->answer,
            'answered_by' => $user->id,
            'answered_at' => now(),
        ]);

        return back()->with('success', 'تمت الإجابة على السؤال بنجاح!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}