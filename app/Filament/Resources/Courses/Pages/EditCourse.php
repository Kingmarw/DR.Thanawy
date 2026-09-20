<?php

namespace App\Filament\Resources\Courses\Pages;

use App\Filament\Resources\Courses\CourseResource;
use App\Services\CloudinaryService;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Storage;

class EditCourse extends EditRecord
{
    protected static string $resource = CourseResource::class;

    public ?string $oldThumbnailPublicId = null;

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (!empty($data['thumbnail']) && str_contains($data['thumbnail'], '::')) {
            [$url, $publicId] = explode('::', $data['thumbnail'], 2);

            $this->oldThumbnailPublicId = $this->record->thumbnail_public_id;

            $data['thumbnail'] = $url;
            $data['thumbnail_public_id'] = $publicId;
        } else {
            // القيمة زي ما هي (URL قديم أو فاضية) - محدش غيّرها
            unset($data['thumbnail']);
        }

        return $data;
    }

    protected function afterSave(): void
    {
        /*
         * بعد نجاح حفظ الصف في Database
         * نحذف الصورة القديمة من Cloudinary.
         */
        if ($this->oldThumbnailPublicId) {
            app(CloudinaryService::class)
                ->delete($this->oldThumbnailPublicId);

            $this->oldThumbnailPublicId = null;
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->after(function () {

                    /*
                     * حذف thumbnail من Cloudinary
                     * عند حذف الصف.
                     */
                    app(CloudinaryService::class)
                        ->delete(
                            $this->record->thumbnail_public_id
                        );
                }),
        ];
    }
}