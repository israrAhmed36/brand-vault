<?php

namespace App\Modules\Webhook\Enums;

enum WebhookEvent: string
{
    case AssetTagsSaved = 'asset.tags_saved';
    case AssetRestored = 'asset.restored';
    case BrandUpdated = 'brand.updated';

    public function entityType(): string
    {
        return match ($this) {
            self::AssetTagsSaved, self::AssetRestored => 'asset',
            self::BrandUpdated => 'brand',
        };
    }
}
