<?php

namespace App\Services;

use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    public function __construct()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key' => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ],
            'url' => [
                'secure' => true,
            ],
        ]);
    }

    public function upload(
        string $filePath,
        string $folder = 'courses/thumbnails'
    ): array {
        $result = (new UploadApi())->upload($filePath, [
            'folder' => $folder,
            'resource_type' => 'image',
        ]);

        return [
            'url' => $result['secure_url'] ?? null,
            'public_id' => $result['public_id'] ?? null,
        ];
    }

    public function delete(?string $publicId): void
    {
        if (!$publicId) {
            return;
        }

        (new UploadApi())->destroy($publicId, [
            'resource_type' => 'image',
            'invalidate' => true,
        ]);
    }
}