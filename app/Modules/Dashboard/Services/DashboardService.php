<?php

namespace App\Modules\Dashboard\Services;

use App\Models\User;
use App\Modules\ActivityLog\Models\ActivityLog;
use App\Modules\ActivityLog\Repositories\ActivityLogRepositoryInterface;
use App\Modules\Asset\Enums\AssetType;
use App\Modules\Asset\Models\Asset;
use App\Modules\Asset\Repositories\AssetRepositoryInterface;
use App\Modules\Asset\Repositories\AssetStatsRepositoryInterface;
use App\Modules\Asset\Services\AssetFileService;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Services\BrandLogoService;
use App\Modules\Brand\Services\BrandService;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;

class DashboardService
{
    public function __construct(
        private readonly AssetRepositoryInterface $assets,
        private readonly AssetStatsRepositoryInterface $assetStats,
        private readonly FolderRepositoryInterface $folders,
        private readonly ActivityLogRepositoryInterface $activityLogs,
        private readonly BrandService $brandService,
        private readonly BrandLogoService $brandLogoService,
        private readonly AssetFileService $assetFiles,
    ) {}

    /**
     * @return array{
     *     stats: array{assets: int, folders: int, trash: int, untagged: int},
     *     assetTypes: list<array{type: string, count: int}>,
     *     brand: Brand|null,
     *     recentAssets: list<Asset>,
     *     recentActivity: list<ActivityLog>
     * }
     */
    public function summary(User $user): array
    {
        $typeCounts = $this->assetStats->countByTypeForUser($user->id);

        return [
            'stats' => [
                'assets' => $this->assets->countForUser($user->id),
                'folders' => $this->folders->countForUser($user->id),
                'trash' => $this->assets->countForUser($user->id, trashed: true),
                'untagged' => $this->assetStats->countWithoutTagsForUser($user->id),
            ],
            'assetTypes' => $this->buildTypeBreakdown($typeCounts),
            'brand' => $this->brandLogoService->present(
                $this->brandService->forUser($user),
            ),
            'recentAssets' => $this->presentRecentAssets($user),
            'recentActivity' => $this->activityLogs
                ->recentForUser($user->id)
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  array<string, int>  $typeCounts
     * @return list<array{type: string, count: int}>
     */
    private function buildTypeBreakdown(array $typeCounts): array
    {
        $breakdown = [];

        foreach (AssetType::cases() as $type) {
            $breakdown[] = [
                'type' => $type->value,
                'count' => $typeCounts[$type->value] ?? 0,
            ];
        }

        return $breakdown;
    }

    /**
     * @return list<Asset>
     */
    private function presentRecentAssets(User $user): array
    {
        $assets = $this->assetStats->recentForUser($user->id);

        foreach ($assets as $asset) {
            $asset->setAttribute(
                'url',
                $this->assetFiles->presentUrl($asset->url),
            );
        }

        return $assets->values()->all();
    }
}
