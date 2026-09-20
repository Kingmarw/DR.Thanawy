<?php

namespace App\Filament\Resources\Sections;

use App\Filament\Resources\Sections\Pages\CreateSection;
use App\Filament\Resources\Sections\Pages\EditSection;
use App\Filament\Resources\Sections\Pages\ListSections;
use App\Filament\Resources\Sections\RelationManagers\LessonsRelationManager;
use App\Models\Course;
use App\Models\Section;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SectionResource extends Resource
{
    protected static ?string $model = Section::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $navigationLabel = 'أقسام الصفوف';

    protected static ?string $modelLabel = 'قسم';

    protected static ?string $pluralModelLabel = 'أقسام';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('course_id')
                ->label('الصف')
                ->options(fn () => Course::query()->orderBy('name')->pluck('name', 'id'))
                ->searchable()
                ->preload()
                ->required(),

            TextInput::make('title')
                ->label('اسم القسم')
                ->placeholder('مثال: الوحدة الأولى - الأفعال')
                ->required()
                ->maxLength(255),

            TextInput::make('order')
                ->label('الترتيب')
                ->numeric()
                ->default(0)
                ->helperText('الأقسام بتترتب في السايدبار من الأصغر للأكبر.'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('course.name')
                    ->label('الصف')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('title')
                    ->label('اسم القسم')
                    ->searchable(),

                TextColumn::make('order')
                    ->label('الترتيب')
                    ->sortable(),

                TextColumn::make('lessons_count')
                    ->label('عدد الدروس')
                    ->counts('lessons'),

                TextColumn::make('created_at')
                    ->label('أُنشئ في')
                    ->dateTime('Y-m-d')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('order')
            ->filters([
                SelectFilter::make('course_id')
                    ->label('الصف')
                    ->options(fn () => Course::query()->orderBy('name')->pluck('name', 'id'))
                    ->searchable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
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
            LessonsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSections::route('/'),
            'create' => CreateSection::route('/create'),
            'edit' => EditSection::route('/{record}/edit'),
        ];
    }
}