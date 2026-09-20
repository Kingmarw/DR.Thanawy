<?php

namespace App\Filament\Resources\Lessons\Schemas;

use App\Models\Course;
use App\Models\Lesson;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Validation\Rule;

class LessonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            // 1. نوع الدرس (يجب أن يكون في الأعلى للتحكم في إظهار الحقول الأخرى بسلاسة)
            Select::make('type')
                ->label('نوع الدرس')
                ->options([
                    'video' => 'فيديو فقط',
                    'pdf' => 'ملف PDF فقط',
                    'text' => 'نص فقط',
                    'video_text' => 'فيديو + نص',
                    'mixed' => 'مختلط (فيديو + PDF + نص)',
                    'quiz' => 'اختبار الدرس',
                ])
                ->default('video')
                ->required()
                ->live()
                ->columnSpanFull(),

            // 2. عنوان الدرس
            TextInput::make('title')
                ->label('عنوان الدرس')
                ->required()
                ->maxLength(255),

            // 3. الصف (مع حساب الترتيب تلقائياً بأمان لـ PHP 8.4)
            Select::make('course_id')
                ->label('الصف')
                ->relationship('course', 'name') // أو 'name' حسب اسم الحقل في جدول courses
                ->searchable()
                ->preload()
                ->required()
                ->live()
                ->afterStateUpdated(function ($state, callable $set) {
                    $nextOrder = Lesson::where('course_id', $state)->max('order') ?? 0;
                    $set('order', $nextOrder + 1);
                }),

            // 4. ترتيب الدرس (قابل للتعديل مع تحقق من عدم التكرار)
            TextInput::make('order')
                ->label('ترتيب الدرس')
                ->numeric()
                ->required()
                ->minValue(1)
                ->rules(function (callable $get, ?Lesson $record) {
                    return [
                        Rule::unique('lessons', 'order')
                            ->where('course_id', $get('course_id'))
                            ->ignore($record?->id),
                    ];
                })
                ->helperText('يتم حسابه تلقائياً، ويمكنك تعديله يدوياً.'),

            // 5. رابط الفيديو (يظهر إذا كان النوع فيديو أو مختلط أو فيديو+نص)
            TextInput::make('video_url')
                ->label('رابط الفيديو (YouTube)')
                ->url()
                ->placeholder('https://youtube.com/...')
                ->nullable()
                ->visible(fn ($get) => in_array($get('type'), ['video', 'mixed', 'video_text']))
                ->columnSpanFull(),

            // 6. رابط ملف PDF (يظهر فقط إذا كان النوع PDF أو مختلط)
            TextInput::make('pdf_file')
                ->label('رابط ملف PDF (Google Drive)')
                ->placeholder('https://drive.google.com/file/d/...')
                ->url()
                ->rule('regex:/^https:\/\/drive\.google\.com\/file\/d\//')
                ->formatStateUsing(function ($state) {
                    // لو القيمة المخزنة عبارة عن ID بس (مش رابط كامل)، رجّعها كرابط
                    // عشان الفورم يعرضها صح وتعدّي على الـ validation وقت التعديل
                    if ($state && !str_starts_with($state, 'http')) {
                        return "https://drive.google.com/file/d/{$state}/view";
                    }
                    return $state;
                })
                ->dehydrateStateUsing(function ($state) {
                    if (!$state) {
                        return null;
                    }
                    preg_match('/\/file\/d\/([a-zA-Z0-9_-]+)/', $state, $matches);
                    return $matches[1] ?? $state;
                })
                ->visible(fn ($get) => in_array($get('type'), ['pdf', 'mixed']))
                ->columnSpanFull(),

            // 7. محتوى الدرس (محرر نصوص متقدم، يظهر للنص أو المختلط أو فيديو+نص)
            RichEditor::make('content')
                ->label('محتوى الدرس')
                ->nullable()
                ->visible(fn ($get) => in_array($get('type'), ['text', 'mixed', 'video_text']))
                ->columnSpanFull()
                ->textColors([
                    '#000000' => 'أسود',
                    '#DC2626' => 'أحمر',
                    '#EA580C' => 'برتقالي',
                    '#CA8A04' => 'أصفر',
                    '#16A34A' => 'أخضر',
                    '#0891B2' => 'سماوي',
                    '#2563EB' => 'أزرق',
                    '#7C3AED' => 'بنفسجي',
                    '#DB2777' => 'وردي',
                    '#6B7280' => 'رمادي',
                ])
                ->toolbarButtons([
                    'bold',
                    'italic',
                    'underline',
                    'strike',
                    'textColor',
                    'link',
                    'blockquote',
                    'bulletList',
                    'orderedList',
                    'h2',
                    'h3',
                    'codeBlock',
                    'table',
                    'undo',
                    'redo',
                ]),

            // 8. اختبار الدرس (يظهر فقط إذا كان النوع اختبار أو مختلط)
            Repeater::make('quiz')
                ->label('أسئلة الدرس')
                ->visible(fn ($get) => in_array($get('type'), ['quiz', 'mixed']))
                ->schema([
                    TextInput::make('question')
                        ->label('نص السؤال')
                        ->required()
                        ->columnSpanFull(),

                    Repeater::make('options')
                        ->label('خيارات الإجابة')
                        ->schema([
                            TextInput::make('text')
                                ->label('الخيار')
                                ->required(),
                        ])
                        ->minItems(2)
                        ->maxItems(6)
                        ->required()
                        ->columnSpanFull(),

                    Radio::make('answer')
                        ->label('الإجابة الصحيحة')
                        ->options(function (callable $get) {
                            $options = $get('options') ?? [];
                            return collect($options)
                                ->values()
                                ->mapWithKeys(fn ($option, $index) => [
                                    (string) $index => $option['text'] ?? "خيار " . ($index + 1)
                                ])
                                ->toArray();
                        })
                        ->required(),
                ])
                ->default([])
                ->columnSpanFull()
                ->collapsible()
                ->itemLabel(fn (array $state): ?string => $state['question'] ?? 'سؤال جديد'),

            // 9. حالة النشاط
            Toggle::make('is_active')
                ->label('نشط')
                ->default(true)
                ->required(),

            // 10. معاينة مجانية (يقدر يشوفها أي حد حتى لو مش مشترك)
            Toggle::make('is_preview')
                ->label('معاينة مجانية؟')
                ->helperText('لو مفعّل، أي زائر (حتى غير المشترك) هيقدر يفتح الدرس ده كمعاينة.')
                ->default(false),
        ]);
    }
}