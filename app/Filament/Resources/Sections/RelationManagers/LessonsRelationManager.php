<?php

namespace App\Filament\Resources\Sections\RelationManagers;

use App\Models\Lesson;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LessonsRelationManager extends RelationManager
{
    protected static string $relationship = 'lessons';

    protected static ?string $title = 'دروس هذا القسم';

    public function form(Schema $schema): Schema
    {
        // بيتفتح بس وقت تعديل درس موجود بالفعل من داخل القسم (عنوان/ترتيب)
        return $schema->components([
            TextInput::make('title')
                ->label('عنوان الدرس')
                ->required()
                ->maxLength(255),

            TextInput::make('order')
                ->label('الترتيب')
                ->numeric(),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                TextColumn::make('title')->label('عنوان الدرس'),
                TextColumn::make('type')->label('النوع'),
                IconColumn::make('is_preview')->label('معاينة مجانية')->boolean(),
                TextColumn::make('order')->label('الترتيب')->sortable(),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->headerActions([
                // ربط درس موجود بالفعل في نفس الصف (مش إنشاء درس جديد)
                Action::make('assignLesson')
                    ->label('ربط درس بالقسم')
                    ->icon('heroicon-o-link')
                    ->schema([
                        Select::make('lesson_id')
                            ->label('اختر درس من نفس الصف')
                            ->options(function () {
                                $courseId = $this->getOwnerRecord()->course_id;

                                return Lesson::query()
                                    ->where('course_id', $courseId)
                                    ->where(function ($q) {
                                        $q->whereNull('section_id')
                                            ->orWhere('section_id', '!=', $this->getOwnerRecord()->id);
                                    })
                                    ->orderBy('order')
                                    ->pluck('title', 'id');
                            })
                            ->searchable()
                            ->required(),
                    ])
                    ->action(function (array $data) {
                        Lesson::where('id', $data['lesson_id'])
                            ->update(['section_id' => $this->getOwnerRecord()->id]);
                    }),
            ])
            ->recordActions([
                EditAction::make(),
                // إزالة الدرس من القسم (مش حذف الدرس نفسه) — بيرجع "بدون قسم"
                Action::make('removeFromSection')
                    ->label('إزالة من القسم')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (Lesson $record) => $record->update(['section_id' => null])),
            ]);
    }
}