<?php
// app/Models/Question.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = ['exam_id', 'question_text', 'explanation', 'order'];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function options()
    {
        return $this->hasMany(QuestionOption::class)->orderBy('order');
    }

    public function correctOption()
    {
        return $this->hasOne(QuestionOption::class)->where('is_correct', true);
    }
}