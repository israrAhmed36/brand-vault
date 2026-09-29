<?php

namespace App\Modules\Brand\Repositories;

use App\Modules\Brand\Models\Brand;

interface BrandRepositoryInterface
{
    public function findForUser(int $userId): ?Brand;

    /**
     * @param  array{name: string, primary_color: string, secondary_color: string, logo_url?: string|null, default_font?: string|null}  $attributes
     */
    public function upsertForUser(int $userId, array $attributes): Brand;

    public function deleteForUser(int $userId): bool;
}
