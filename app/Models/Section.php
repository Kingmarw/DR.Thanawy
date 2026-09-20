<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['course_id', 'title', 'order'];

    protected static function booted()
    {
        static::creating(function ($section) {
            if (is_null($section->order)) {
                $maxOrder = Section::where('course_id', $section->course_id)->max('order') ?? 0;
                $section->order = $maxOrder + 1;
            }
        });
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }
}