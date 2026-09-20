<?php

namespace App\Filament\Resources\Exams\Schemas;

use Closure;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;

class ExamForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // بيانات الامتحان الأساسية
                Select::make('course_id')
                    ->relationship('course', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->label('الصف'),

                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->label('عنوان الامتحان'),

                Select::make('type')
                    ->options([
                        'exam' => 'اختبار رسمي',
                        'practice' => 'تدريب / تمرين',
                    ])
                    ->default('practice')
                    ->required()
                    ->label('نوع الاختبار')
                    ->live(),

                TextInput::make('duration_minutes')
                    ->numeric()
                    ->suffix('دقيقة')
                    ->label('مدة الامتحان'),

                TextInput::make('passing_score')
                    ->numeric()
                    ->suffix('%')
                    ->label('درجة النجاح'),

                TextInput::make('max_attempts')
                    ->numeric()
                    ->minValue(1)
                    ->default(1)
                    ->label('عدد المحاولات المسموح بها')
                    ->visible(fn (callable $get): bool => $get('type') === 'exam'),

                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->label('الترتيب'),

                Toggle::make('is_active')
                    ->default(true)
                    ->label('مفعل'),

                Textarea::make('description')
                    ->columnSpanFull()
                    ->label('الوصف'),

                // أسئلة الامتحان
                Repeater::make('questions')
                    ->relationship()
                    ->schema([
                        // نوع السؤال: اختيار من متعدد / صح وغلط
                        Select::make('type')
                            ->label('نوع السؤال')
                            ->options([
                                'multiple_choice' => 'اختيار من متعدد',
                                'true_false' => 'صح / غلط',
                            ])
                            ->default('multiple_choice')
                            ->required()
                            ->native(false)
                            ->live()
                            ->afterStateUpdated(function (?string $state, Set $set): void {
                                // أول ما تختار "صح / غلط" الخيارات بتتظبط لوحدها (صح ✅ / غلط)
                                if ($state === 'true_false') {
                                    $set('options', [
                                        ['option_text' => 'صح', 'is_correct' => true],
                                        ['option_text' => 'غلط', 'is_correct' => false],
                                    ]);
                                }
                            }),

                        Textarea::make('question_text')
                            ->required()
                            ->rows(2)
                            ->label('نص السؤال'),

                        Repeater::make('options')
                            ->relationship()
                            ->schema([
                                TextInput::make('option_text')
                                    ->required()
                                    // في صح/غلط النص ثابت
                                    ->readOnly(fn (Get $get): bool => $get('../../type') === 'true_false')
                                    ->label('نص الاختيار'),

                                Toggle::make('is_correct')
                                    ->label('إجابة صحيحة؟'),
                            ])
                            ->columns(2)
                            ->defaultItems(4)
                            ->minItems(2)
                            // في صح/غلط: اختيارين بس، مينفعش تضيف أو تمسح أو تعيد الترتيب
                            ->addable(fn (Get $get): bool => $get('type') !== 'true_false')
                            ->deletable(fn (Get $get): bool => $get('type') !== 'true_false')
                            ->reorderable(fn (Get $get): bool => $get('type') !== 'true_false')
                            // لازم إجابة صحيحة واحدة بالظبط (السيرفر بيصحح على correct_option_id واحد)
                            ->rules([
                                fn (): Closure => function (string $attribute, mixed $value, Closure $fail): void {
                                    $correct = collect($value)
                                        ->filter(fn ($option) => ! empty($option['is_correct']))
                                        ->count();

                                    if ($correct !== 1) {
                                        $fail('لازم تحدد إجابة صحيحة واحدة بالظبط في كل سؤال.');
                                    }
                                },
                            ])
                            ->label('الخيارات'),

                        Textarea::make('explanation')
                            ->rows(2)
                            ->label('توضيح / شرح الإجابة'),
                    ])
                    ->orderColumn('order')
                    ->defaultItems(1)
                    ->collapsible()
                    ->cloneable()
                    ->itemLabel(function (array $state): ?string {
                        $text = $state['question_text'] ?? null;

                        if (! $text) {
                            return null;
                        }

                        return ($state['type'] ?? null) === 'true_false'
                            ? "[صح/غلط] {$text}"
                            : $text;
                    })
                    ->label('قائمة الأسئلة')
                    ->columnSpanFull(),
            ]);
    }
}