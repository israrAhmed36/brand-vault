<?php

namespace App\Modules\Asset\Support;

use App\Modules\Asset\Enums\AssetType;
use Illuminate\Http\UploadedFile;

final class AssetTypeFromFile
{
    public function resolve(UploadedFile $file): string
    {
        $mime = strtolower((string) $file->getMimeType());

        if (str_starts_with($mime, 'image/')) {
            return AssetType::Image->value;
        }

        if (str_starts_with($mime, 'video/')) {
            return AssetType::Video->value;
        }

        $extension = strtolower($file->getClientOriginalExtension());
        $documents = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

        if (in_array($extension, $documents, true) || str_starts_with($mime, 'text/')) {
            return AssetType::Document->value;
        }

        return AssetType::Other->value;
    }
}
