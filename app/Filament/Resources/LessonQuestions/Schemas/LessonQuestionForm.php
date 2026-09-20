<?php

namespace App\Filament\Resources\LessonQuestions\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class LessonQuestionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('تفاصيل السؤال')
                    ->schema([
                        TextInput::make('question')
                            ->label('السؤال')
                            ->required()
                            ->disabled()
                            ->columnSpanFull(),

                        Select::make('lesson_id')
                            ->relationship('lesson', 'title')
                            ->label('الدرس المرتبط')
                            ->disabled()
                            ->searchable(),

                        Select::make('user_id')
                            ->relationship('student', 'name')
                            ->label('اسم الطالب')
                            ->disabled(),

                        Toggle::make('is_private')
                            ->label('سؤال خاص')
                            ->disabled(),
                    ])->columns(2),

                Section::make('إجابة المدرس')
                    ->schema([
                        Textarea::make('answer')
                            ->label('الإجابة')
                            ->rows(4)
                            ->required()
                            ->placeholder('اكتب إجابة مفيدة للطالب هنا...'),

                        Select::make('answered_by')
                            ->label('تمت الإجابة بواسطة')
                            ->options(
                                User::where('is_admin', true)->pluck('name', 'id')
                            )
                            ->default(auth()->id())
                            ->required(),
                    ])->columns(1),
            ]);
    }
}