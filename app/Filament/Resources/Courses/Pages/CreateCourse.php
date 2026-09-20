<?php

namespace App\Filament\Resources\Courses\Pages;

use App\Filament\Resources\Courses\CourseResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCourse extends CreateRecord
{
    protected static string $resource = CourseResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (!empty($data['thumbnail']) && str_contains($data['thumbnail'], '::')) {
            [$url, $publicId] = explode('::', $data['thumbnail'], 2);

            $data['thumbnail'] = $url;
            $data['thumbnail_public_id'] = $publicId;
        }

        return $data;
    }
}