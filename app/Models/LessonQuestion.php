<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'user_id',
        'question',
        'answer',
        'answered_by',
        'answered_at',
        'is_private',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'answered_at' => 'datetime',
    ];

    // علاقة السؤال بالدرس
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    // علاقة السؤال بالطالب (اللي سأل)
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // علاقة السؤال بالمدرس (اللي أجاب)
    public function instructor()
    {
        return $this->belongsTo(User::class, 'answered_by');
    }
}