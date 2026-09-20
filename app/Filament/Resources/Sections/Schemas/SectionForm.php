<?php

namespace App\Filament\Resources\Sections\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class SectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('course_id')
                    ->required()
                    ->numeric(),
                TextInput::make('title')
                    ->required(),
                TextInput::make('order')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
