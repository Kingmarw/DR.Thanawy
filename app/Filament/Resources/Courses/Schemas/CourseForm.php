<?php

namespace App\Filament\Resources\Courses\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use App\Services\CloudinaryService;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\HtmlString;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class CourseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('اسم الصف')
                    ->required()
                    ->maxLength(255),

                Textarea::make('description')
                    ->label('وصف الصف')
                    ->default(null)
                    ->columnSpanFull(),

                FileUpload::make('thumbnail')
                    ->label('صورة الغلاف')
                    ->image()
                    ->disk('local')
                    ->directory('temp/courses')
                    ->saveUploadedFileUsing(function (TemporaryUploadedFile $file) {
                        $result = app(CloudinaryService::class)->upload($file->getRealPath());

                        if (empty($result['url']) || empty($result['public_id'])) {
                            return null;
                        }

                        // بنخزن الاتنين مع بعض في نفس القيمة عشان نفكهم بعدين
                        return $result['url'] . '::' . $result['public_id'];
                    })
                    ->nullable()
                    ->required(fn ($record) => $record === null)
                    ->imagePreviewHeight('200')
                    ->preserveFilenames(false)
                    ->acceptedFileTypes([
                        'image/jpeg',
                        'image/png',
                        'image/webp',
                    ])
                    ->maxSize(4096)
                    ->openable()
                    ->downloadable()
                    ->imageEditor(),

                Placeholder::make('thumbnail_preview')
                    ->label('صورة الغلاف الحالية')
                    ->content(function ($record) {
                        if (!$record?->thumbnail) {
                            return 'لا توجد صورة حالية';
                        }

                        return new HtmlString(
                            '<img
                                src="' . e($record->thumbnail) . '"
                                style="
                                    width:180px;
                                    height:120px;
                                    object-fit:cover;
                                    border-radius:12px;
                                "
                                alt="صورة الغلاف"
                            />'
                        );
                    })
                    ->columnSpanFull(),

                TextInput::make('price')
                    ->label('السعر')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('EGP'),

                TextInput::make('order')
                    ->label('الترتيب')
                    ->required()
                    ->numeric()
                    ->default(0),

                Toggle::make('is_active')
                    ->label('نشط')
                    ->default(true)
                    ->required(),
            ]);
    }
}