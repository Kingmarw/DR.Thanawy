<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Enums\Grade;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->required(),
                Select::make('grade')
                    ->options(Grade::class)
                    ->required(),
                Toggle::make('is_admin')
                    ->label('حساب أدمن')
                    ->default(false)
                    ->onColor('success')
                    ->offColor('gray')
                    ->live(),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('password')
                    ->password()
                    ->revealable()
                    ->dehydrated(fn ($state) => filled($state))
                    ->dehydrateStateUsing(fn ($state) => filled($state) ? bcrypt($state) : null)
                    ->required(fn (string $operation): bool => $operation === 'create'),
            ]);
    }
}
