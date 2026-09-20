<?php

namespace App\Filament\Resources\LessonQuestions;

use App\Filament\Resources\LessonQuestions\Pages;
use App\Filament\Resources\LessonQuestions\Schemas\LessonQuestionForm;
use App\Models\LessonQuestion;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Illuminate\Database\Eloquent\Builder;

class LessonQuestionResource extends Resource
{
    protected static ?string $model = LessonQuestion::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationLabel = 'أسئلة الطلاب';
    protected static ?string $modelLabel = 'سؤال طالب';
    protected static ?string $pluralModelLabel = 'أسئلة الطلاب';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return LessonQuestionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->sortable(),
                Tables\Columns\TextColumn::make('question')
                    ->label('السؤال')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\TextColumn::make('student.name')
                    ->label('الطالب')
                    ->searchable(),
                Tables\Columns\TextColumn::make('lesson.title')
                    ->label('الدرس')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_private')
                    ->label('خاص')
                    ->boolean(),
                Tables\Columns\TextColumn::make('answer')
                    ->label('الإجابة')
                    ->limit(30)
                    ->placeholder('لم تتم الإجابة بعد')
                    ->badge()
                    ->color('success'),
                Tables\Columns\TextColumn::make('answered_at')
                    ->label('تاريخ الإجابة')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('lesson_id')
                    ->relationship('lesson', 'title')
                    ->label('فلترة حسب الدرس'),

                Tables\Filters\TernaryFilter::make('answered')
                    ->label('حالة الإجابة')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNotNull('answer'),
                        false: fn (Builder $query) => $query->whereNull('answer'),
                    ),
            ])
            ->recordActions([
                EditAction::make()
                    ->label('رد على السؤال'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
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
            'index' => Pages\ListLessonQuestions::route('/'),
            'create' => Pages\CreateLessonQuestion::route('/create'),
            'edit' => Pages\EditLessonQuestion::route('/{record}/edit'),
        ];
    }
}