<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ExamAttemptController;
use App\Http\Controllers\ExamController;
use App\Models\Course;
use App\Http\Controllers\LeaderboardController;
use App\Services\LeaderboardService;



Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'latestCourses' => Course::query()
            ->active()
            ->latest()
            ->take(4)
            ->get(['id', 'name', 'description', 'price', 'thumbnail']),
        'leaderboard' => app(LeaderboardService::class)->forWelcome(auth()->user()),
    ]);
});

// راوتات الكورسات - المحمية تتطلب تسجيل دخول
Route::middleware(['auth'])->group(function () {
    // قائمة الكورسات وإنشاء كورس جديد
    Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
    Route::post('/courses', [CourseController::class, 'store'])->name('courses.store');
    
    // عرض تفاصيل الكورس (محمي - يتطلب تسجيل دخول)
    Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
    
    // عرض درس معين داخل كورس (محمي - يتطلب تسجيل دخول)
    Route::get('/courses/{course}/lessons/{lesson}', [LessonController::class, 'show'])
        ->name('lessons.show');
    
    // صفحة التعلم والاشتراك في الكورس
    Route::get('/courses/{course}/learn', [CourseController::class, 'learn'])->name('courses.learn');
    Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
});

Route::middleware(['auth'])->group(function () {
    Route::post('/orders', [EnrollmentController::class, 'store'])->name('orders.store');
    Route::get('/orders', [EnrollmentController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [EnrollmentController::class, 'create'])->name('orders.create');
    Route::get('/orders/{id}/pay', [EnrollmentController::class, 'initiatePayment'])->name('order.pay');
    Route::post('/lessons/{lesson}/complete', [LessonController::class, 'complete'])->name('lessons.complete');
    
    // راوتات أسئلة الدروس
    Route::post('/lessons/{lesson}/questions', [LessonController::class, 'askQuestion'])->name('lessons.questions.ask');
    Route::get('/lessons/{lesson}/questions', [LessonController::class, 'getQuestions'])->name('lessons.questions.index');
    Route::post('/questions/{question}/answer', [LessonController::class, 'answerQuestion'])->name('questions.answer');
});

// الراوتات دي لازم تكون بره الـ auth middleware:
// التحقق من الأمان بيتم عن طريق توقيع HMAC (signature) جوه الكونترولر نفسه،
// مش عن طريق تسجيل الدخول. لو حطيناها جوه auth، أي إشعار server-to-server من Kashier
// أو أي حالة ضاع فيها الـ session أثناء التحويل هترفض قبل ما توصل للكود أصلاً.
Route::get('/payment/callback', [EnrollmentController::class, 'handleCallback'])->name('order.callback');
Route::get('/payment/failure', [EnrollmentController::class, 'failure'])->name('order.failure');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});


Route::get('/leaderboard', [LeaderboardController::class, 'index'])
    ->middleware('auth')
    ->name('leaderboard.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// راوتات الامتحانات: كل حاجة بتتحقق منها في السيرفر (اشتراك، تفعيل، محاولة جارية، وقت)
Route::middleware('auth')->group(function () {
    Route::get('/courses/{course}/exams/{exam}', [ExamController::class, 'show'])
        ->name('courses.exams.show');

    // بداية المحاولة (هنا بس بيبدأ الوقت)
    Route::post('/exams/{exam}/start', [ExamController::class, 'start'])
        ->name('exams.start');

    // تصحيح فوري لسؤال واحد داخل محاولة جارية
    Route::post('/exams/{exam}/check-answer', [ExamController::class, 'checkAnswer'])
        ->middleware('throttle:60,1')
        ->name('exams.check-answer');

    // تسليم المحاولة
    Route::post('/exams/{exam}/attempt', [ExamAttemptController::class, 'store'])
        ->name('exams.attempt');
});

require __DIR__.'/auth.php';