<?php

namespace App\Modules\Asset\Enums;

enum AssetType: string
{
    case Image = 'image';
    case Video = 'video';
    case Document = 'document';
    case Link = 'link';
    case Other = 'other';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
