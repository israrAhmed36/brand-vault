<?php

namespace App\Modules\Brand\Repositories;

use App\Modules\Brand\Models\Brand;

class BrandRepository implements BrandRepositoryInterface
{
    public function findForUser(int $userId): ?Brand
    {
        return Brand::query()->where('user_id', $userId)->first();
    }

    public function upsertForUser(int $userId, array $attributes): Brand
    {
        $brand = Brand::query()->firstOrNew(['user_id' => $userId]);

        $brand->fill([
            'name' => $attributes['name'],
            'primary_color' => $attributes['primary_color'],
            'secondary_color' => $attributes['secondary_color'],
            'logo_url' => $attributes['logo_url'] ?? null,
            'default_font' => $attributes['default_font'] ?? null,
        ]);

        $brand->save();

        return $brand->refresh();
    }

    public function deleteForUser(int $userId): bool
    {
        $brand = $this->findForUser($userId);

        if ($brand === null) {
            return false;
        }

        return (bool) $brand->delete();
    }
}
