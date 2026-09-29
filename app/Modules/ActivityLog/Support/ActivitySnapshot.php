<?php

namespace App\Modules\ActivityLog\Support;

use App\Modules\Asset\Models\Asset;
use App\Modules\Brand\Models\Brand;
use App\Modules\Folder\Models\Folder;

final class ActivitySnapshot
{
    private const ROOT_LABEL = 'Library (root)';

    /**
     * @return array<string, mixed>
     */
    public static function brand(Brand $brand): array
    {
        return [
            'name' => $brand->name,
            'primary_color' => $brand->primary_color,
            'secondary_color' => $brand->secondary_color,
            'logo_url' => $brand->logo_url,
            'default_font' => $brand->default_font,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function folder(Folder $folder): array
    {
        return [
            'name' => $folder->name,
            'parent' => self::folderLabel($folder->parent_id),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function asset(Asset $asset): array
    {
        return [
            'name' => $asset->name,
            'type' => $asset->type,
            'url' => $asset->url,
            'folder' => self::folderLabel($asset->folder_id),
            'tags' => $asset->tags,
        ];
    }

    public static function folderLabel(?int $folderId): string
    {
        if ($folderId === null) {
            return self::ROOT_LABEL;
        }

        $name = Folder::query()->whereKey($folderId)->value('name');

        return is_string($name) && $name !== '' ? $name : 'Unknown folder';
    }
}
