<?php

namespace App\Enums;

enum Grade: string
{
    case First = 'first';
    case Second = 'second';
    case Third = 'third';

    public function label(): string
    {
        return match ($this) {
            self::First => 'الصف الأول الثانوي',
            self::Second => 'الصف الثاني الثانوي',
            self::Third => 'الصف الثالث الثانوي',
        };
    }
}