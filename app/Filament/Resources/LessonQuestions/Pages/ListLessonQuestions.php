<?php

namespace App\Filament\Resources\LessonQuestions\Pages;

use App\Filament\Resources\LessonQuestions\LessonQuestionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLessonQuestions extends ListRecords
{
    protected static string $resource = LessonQuestionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
