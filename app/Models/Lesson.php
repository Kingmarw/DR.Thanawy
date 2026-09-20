<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'section_id', // جديد
        'title',
        'content',
        'video_url',
        'pdf_file',
        'order',
        'is_active',
        'is_preview',
        'type',
        'quiz',
    ];

    protected $casts = [
        'quiz' => 'array',
        'is_active' => 'boolean',
        'is_preview' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($lesson) {
            if (is_null($lesson->order)) {
                $maxOrder = Lesson::where('course_id', $lesson->course_id)->max('order') ?? 0;
                $lesson->order = $maxOrder + 1;
            }
        });
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // جديد: القسم (السكشن) اللي الدرس ده تابع له، ممكن يكون null (بدون قسم)
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    // علاقة الأسئلة بالدروس
    public function questions()
    {
        return $this->hasMany(LessonQuestion::class);
    }
}