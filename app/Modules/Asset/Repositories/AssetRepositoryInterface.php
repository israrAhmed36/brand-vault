<?php

namespace App\Modules\Asset\Repositories;

use App\Modules\Asset\Models\Asset;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AssetRepositoryInterface
{
    public function findForUser(int $userId, int $assetId): ?Asset;

    /**
     * @param  array{search?: string|null, sort?: string|null, folder_id?: int|null, page?: int|null, per_page?: int|null}  $filters
     * @return LengthAwarePaginator<int, Asset>
     */
    public function listForUser(int $userId, array $filters, bool $trashed = false): LengthAwarePaginator;

    public function countForUser(int $userId, bool $trashed = false): int;

    /**
     * @param  array{name: string, type: string, url: string, folder_id?: int|null}  $attributes
     */
    public function createForUser(int $userId, array $attributes): Asset;

    /**
     * @param  array{name: string, type: string, url: string, folder_id?: int|null}  $attributes
     */
    public function updateForUser(int $userId, Asset $asset, array $attributes): Asset;

    public function moveForUser(int $userId, Asset $asset, ?int $folderId): Asset;

    public function softDeleteForUser(int $userId, Asset $asset): void;

    public function restoreForUser(int $userId, Asset $asset): Asset;

    public function forceDeleteForUser(int $userId, Asset $asset): void;
}
