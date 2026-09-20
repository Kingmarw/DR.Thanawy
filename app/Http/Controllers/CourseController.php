<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LessonCompletion;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $courses = Course::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%{$request->search}%")
                        ->orWhere('description', 'LIKE', "%{$request->search}%");
                });
            })
            ->latest()
            ->get();

        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(
            auth()->check() && $request->user()->is_admin,
            403,
            'غير مصرح لك بإنشاء كورسات.'
        );

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $thumbnailUrl = null;

        if ($request->hasFile('thumbnail')) {
            $uploadedFile = Cloudinary::upload(
                $request->file('thumbnail')->getRealPath(),
                [
                    'folder' => 'courses/thumbnails',
                ]
            );

            $thumbnailUrl = $uploadedFile->getSecurePath();
        }

        Course::create([
            'name' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'thumbnail' => $thumbnailUrl,
        ]);

        return redirect()
            ->route('courses.index')
            ->with('success', 'تم إنشاء الصف بنجاح.');
    }

    public function show(Course $course)
    {
        $isAdmin = auth()->check() && auth()->user()->is_admin;
        abort_if(! $course->is_active && ! $isAdmin, 404);

        $enrolled = auth()->check()
            && $course->users()->where('user_id', auth()->id())->exists();

        $lessonsQuery = $course->lessons();

        $videosCount = (clone $lessonsQuery)
            ->whereIn('type', ['video', 'mixed'])
            ->whereNotNull('video_url')
            ->count();

        $examsCount = (clone $lessonsQuery)
            ->whereIn('type', ['quiz', 'mixed'])
            ->whereNotNull('quiz')
            ->count();

        $filesCount = (clone $lessonsQuery)
            ->whereIn('type', ['pdf', 'mixed'])
            ->whereNotNull('pdf_file')
            ->count();

        // شكل الدرس اللي بيتبعت للصفحة
        $lessonData = fn ($lesson) => [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'order' => $lesson->order,
            'type' => $lesson->type,
            'is_preview' => (bool) $lesson->is_preview,
        ];

        // الأقسام بدروسها مرتّبة
        $sections = $course->sections()
            ->with(['lessons' => fn ($q) => $q->orderBy('order')])
            ->orderBy('order')
            ->get()
            ->map(fn ($section) => [
                'id' => $section->id,
                'title' => $section->title,
                'lessons' => $section->lessons->map($lessonData)->values(),
            ])
            ->values();

        // الدروس اللي لسه مش مربوطة بأي قسم
        $unsectionedLessons = $course->lessons()
            ->whereNull('section_id')
            ->orderBy('order')
            ->get()
            ->map($lessonData)
            ->values();

        return Inertia::render('Courses/Show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->name,
                'description' => $course->description,
                'thumbnail' => $course->thumbnail,
                'cover_image' => $course->cover_image,       // null لو العمود مش موجود
                'price' => $course->price,
                'original_price' => $course->original_price, // null لو العمود مش موجود
                'videos_count' => $videosCount,
                'exams_count' => $examsCount,
                'files_count' => $filesCount,
                'created_at_formatted' => $course->created_at?->format('Y-m-d'),
                'updated_at_formatted' => $course->updated_at?->format('Y-m-d'),
            ],
            'sections' => $sections,
            'unsectionedLessons' => $unsectionedLessons,
            'enrolled' => $enrolled,
        ]);
    }

    public function enroll(Request $request, Course $course)
    {
        // الراوت ده مخصص فقط للكورسات المجانية (price = 0).
        // أي كورس مدفوع لازم يعدي حصريًا من مسار الدفع (orders.store -> Kashier -> order.callback)
        // عشان محدش يقدر يتخطى الدفع بطلب POST مباشر.
        abort_if($course->price > 0, 403, 'هذا الصف مدفوع، يجب إتمام عملية الدفع أولاً.');

        abort_if(! $course->is_active, 404);

        $user = $request->user();

        if (! $user->courses()->where('course_id', $course->id)->exists()) {
            $user->courses()->attach($course->id);
        }

        return redirect()->route('courses.learn', $course->id)
            ->with('success', 'تم الاشتراك في الصف بنجاح!');
    }

    /**
     * Learn page (غرفة التعلم ومشاهدة الدروس للطلاب المسجلين).
     */
    public function learn(Course $course, Request $request)
    {
        $isAdmin = auth()->check() && auth()->user()->is_admin;
        abort_if(! $course->is_active && ! $isAdmin, 404);

        $enrolled = auth()->check() && $course->users()->where('user_id', auth()->id())->exists();
        $lessons = $course->lessons()->orderBy('order')->get();
        $currentLesson = $lessons->where('id', $request->lesson)->first() ?? $lessons->first();

        abort_if(! $currentLesson, 404, 'لا توجد دروس في هذا الصف حالياً.');

        if (! $enrolled && ! $currentLesson->is_preview) {
            return redirect()->route('courses.show', $course->id)
                ->with('error', 'يجب التسجيل في الصف أولاً للتمكن من مشاهدة المحتوى.');
        }

        $totalLessons = $lessons->count();
        $completedCount = $enrolled && auth()->check()
            ? LessonCompletion::where('user_id', auth()->id())->whereIn('lesson_id', $lessons->pluck('id'))->count()
            : 0;
        $progress = $totalLessons > 0 ? round(($completedCount / $totalLessons) * 100) : 0;
        $isCompleted = $enrolled && auth()->check() && LessonCompletion::where('user_id', auth()->id())
            ->where('lesson_id', $currentLesson->id)
            ->exists();

        $canViewCurrent = $enrolled || $currentLesson->is_preview;
        $currentLessonSafe = $canViewCurrent ? [
            'id' => $currentLesson->id,
            'title' => $currentLesson->title,
            'type' => $currentLesson->type,
            'content' => $currentLesson->content,
            'video_url' => $currentLesson->video_url,
            'pdf_file' => $currentLesson->pdf_file,
            'quiz' => $currentLesson->quiz,
            'order' => $currentLesson->order,
            'is_preview' => $currentLesson->is_preview,
        ] : null;

        $lessonsSafe = $lessons->map(fn ($lesson) => [
            'id' => $lesson->id,
            'title' => $lesson->title,
            'order' => $lesson->order,
            'type' => $lesson->type,
            'is_preview' => $lesson->is_preview,
        ]);

        // أقسام الصف (السكاشن)، كل سكشن جوّاه دروسه بس
        $sections = $course->sections()
            ->with(['lessons' => fn ($q) => $q->orderBy('order')])
            ->orderBy('order') // ← تعديل: ترتيب الأقسام نفسها
            ->get()
            ->map(fn ($section) => [
                'id' => $section->id,
                'title' => $section->title,
                'order' => $section->order,
                'lessons' => $section->lessons->map(fn ($lesson) => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'order' => $lesson->order,
                    'type' => $lesson->type,
                    'is_preview' => $lesson->is_preview,
                ]),
            ]);

        // الدروس اللي لسه مش متحطة جوه أي سكشن (توافق رجعي مع الدروس القديمة)
        $unsectionedLessons = $lessons
            ->whereNull('section_id')
            ->values()
            ->map(fn ($lesson) => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'order' => $lesson->order,
                'type' => $lesson->type,
                'is_preview' => $lesson->is_preview,
            ]);

        // جلب الامتحانات الرسمية المرتبطة بالكورس
        $exams = $course->exams()
            ->where('is_active', true)
            ->with(['questions.options'])
            ->orderBy('order')
            ->get()
            ->map(fn ($exam) => [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'type' => $exam->type,
                'duration_minutes' => $exam->duration_minutes,
                'passing_score' => $exam->passing_score,
                'questions' => $exam->questions->map(fn ($q) => [
                    'id' => $q->id,
                    'question_text' => $q->question_text,
                    'explanation' => $q->explanation,
                    'options' => $q->options->map(fn ($opt) => [
                        'id' => $opt->id,
                        'option_text' => $opt->option_text,
                    ]),
                ]),
            ]);

        // جلب محاولات الطالب السابقة لكل امتحان
        $examAttempts = [];
        if ($enrolled && auth()->check()) {
            $examIds = $exams->pluck('id');
            $examAttempts = \App\Models\ExamAttempt::where('user_id', auth()->id())
                ->whereIn('exam_id', $examIds)
                ->orderByDesc('created_at')
                ->get()
                ->groupBy('exam_id')
                ->map(fn ($attempts) => $attempts->map(fn ($a) => [
                    'id' => $a->id,
                    'score_percent' => $a->score_percent,
                    'status' => $a->status,
                    'correct_answers' => $a->correct_answers,
                    'total_questions' => $a->total_questions,
                    'created_at' => $a->created_at->format('Y-m-d H:i'),
                ]));
        }

        return Inertia::render('Courses/Learn', [
            'course' => $course,
            'lessons' => $lessonsSafe,
            'sections' => $sections,
            'unsectionedLessons' => $unsectionedLessons,
            'currentLesson' => $currentLessonSafe,
            'progress' => $progress,
            'isCompleted' => $isCompleted,
            'enrolled' => $enrolled,
            'exams' => $exams,
            'examAttempts' => $examAttempts,
        ]);
    }

    private function getYoutubeId($url)
    {
        preg_match(
            '/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^&?]+)/',
            $url,
            $matches
        );

        return $matches[1] ?? null;
    }
}