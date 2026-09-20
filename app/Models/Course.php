<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'thumbnail', 'thumbnail_public_id', 'price', 'order', 'is_active'];

    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    // جديد: أقسام الصف (السكاشن)
    public function sections()
    {
        return $this->hasMany(Section::class)->orderBy('order');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class)->orderBy('order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'course_user');
    }
}