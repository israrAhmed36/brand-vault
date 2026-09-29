<?php

namespace App\Modules\Asset\Repositories;

use App\Modules\Asset\Models\Asset;
use Illuminate\Support\Collection;

interface AssetStatsRepositoryInterface
{
    /**
     * @return array<string, int>
     */
    public function countByTypeForUser(int $userId): array;

    public function countWithoutTagsForUser(int $userId): int;

    /**
     * @return Collection<int, Asset>
     */
    public function recentForUser(int $userId, int $limit = 5): Collection;
}
