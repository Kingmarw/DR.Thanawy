<?php

namespace App\Filament\Resources\Exams;

use App\Filament\Resources\Exams\Pages\CreateExam;
use App\Filament\Resources\Exams\Pages\EditExam;
use App\Filament\Resources\Exams\Pages\ListExams;
use App\Filament\Resources\Exams\Schemas\ExamForm;
use App\Filament\Resources\Exams\Tables\ExamsTable;
use App\Models\Exam;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema; // رجعنا الـ Schema زي ما كانت عندك
use Filament\Tables\Table;

class ExamResource extends Resource
{
    protected static ?string $model = Exam::class;

    // تم تعديل النوع والقيمة لتجنب خطأ الـ Enum
    protected static BackedEnum|string|null $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $recordTitleAttribute = 'title';

    // استخدام Schema كما يتوقع الـ Resource الأب في نسختك
    public static function form(Schema $schema): Schema
    {
        return ExamForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ExamsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListExams::route('/'),
            'create' => CreateExam::route('/create'),
            'edit' => EditExam::route('/{record}/edit'),
        ];
    }
}