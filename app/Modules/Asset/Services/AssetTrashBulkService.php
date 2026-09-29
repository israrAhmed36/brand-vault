<?php

namespace App\Modules\Asset\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class AssetTrashBulkService
{
    public function __construct(
        private readonly AssetService $assets,
        private readonly AssetTrashService $trash,
    ) {}

    /**
     * @param  list<int>  $assetIds
     */
    public function restore(User $user, array $assetIds): int
    {
        $restoredCount = 0;

        DB::transaction(function () use ($user, $assetIds, &$restoredCount): void {
            foreach ($assetIds as $assetId) {
                $asset = $this->assets->findOwned($user, $assetId);

                if ($asset === null || $asset->deleted_at === null) {
                    continue;
                }

                abort_unless($user->can('restore', $asset), 403);
                $this->trash->restore($user, $asset);
                $restoredCount++;
            }
        });

        return $restoredCount;
    }

    /**
     * @param  list<int>  $assetIds
     */
    public function forceDelete(User $user, array $assetIds): int
    {
        $deletedCount = 0;

        DB::transaction(function () use ($user, $assetIds, &$deletedCount): void {
            foreach ($assetIds as $assetId) {
                $asset = $this->assets->findOwned($user, $assetId);

                if ($asset === null || $asset->deleted_at === null) {
                    continue;
                }

                abort_unless($user->can('forceDelete', $asset), 403);
                $this->trash->forceDelete($user, $asset);
                $deletedCount++;
            }
        });

        return $deletedCount;
    }
}
