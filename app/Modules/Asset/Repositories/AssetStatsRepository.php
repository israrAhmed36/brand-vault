<?php

namespace App\Modules\Asset\Repositories;

use App\Modules\Asset\Models\Asset;
use Illuminate\Support\Collection;

class AssetStatsRepository implements AssetStatsRepositoryInterface
{
    public function countByTypeForUser(int $userId): array
    {
        return Asset::query()
            ->where('user_id', $userId)
            ->selectRaw('type, COUNT(*) as aggregate')
            ->groupBy('type')
            ->pluck('aggregate', 'type')
            ->map(static fn ($count): int => (int) $count)
            ->all();
    }

    public function countWithoutTagsForUser(int $userId): int
    {
        return Asset::query()
            ->where('user_id', $userId)
            ->where(function ($query): void {
                $query
                    ->whereNull('tags')
                    ->orWhereJsonLength('tags', 0);
            })
            ->count();
    }

    public function recentForUser(int $userId, int $limit = 5): Collection
    {
        return Asset::query()
            ->where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->limit(max(1, $limit))
            ->get();
    }
}
