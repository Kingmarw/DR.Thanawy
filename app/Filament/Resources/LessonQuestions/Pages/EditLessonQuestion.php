<?php

namespace App\Filament\Resources\LessonQuestions\Pages;

use App\Filament\Resources\LessonQuestions\LessonQuestionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLessonQuestion extends EditRecord
{
    protected static string $resource = LessonQuestionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
