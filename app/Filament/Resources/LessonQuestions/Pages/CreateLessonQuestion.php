<?php

namespace App\Filament\Resources\LessonQuestions\Pages;

use App\Filament\Resources\LessonQuestions\LessonQuestionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLessonQuestion extends CreateRecord
{
    protected static string $resource = LessonQuestionResource::class;
}
