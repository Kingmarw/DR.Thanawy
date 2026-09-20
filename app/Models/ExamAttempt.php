<?php
// app/Models/ExamAttempt.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'exam_id', 'total_questions', 'correct_answers',
        'score_percent', 'status', 'started_at', 'finished_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
        'score_percent' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function answers()
    {
        return $this->hasMany(ExamAttemptAnswer::class);
    }

    public function isPassed(): bool
    {
        $passingScore = $this->exam->passing_score;

        return $passingScore !== null && $this->score_percent >= $passingScore;
    }
}