<?php

namespace App\Modules\Folder\Repositories;

use App\Modules\Folder\Models\Folder;
use Illuminate\Support\Collection;

interface FolderRepositoryInterface
{
    public function findForUser(int $userId, int $folderId): ?Folder;

    /**
     * @return Collection<int, Folder>
     */
    public function childrenForUser(int $userId, ?int $parentId): Collection;

    /**
     * @return Collection<int, Folder>
     */
    public function allForUser(int $userId): Collection;

    public function countForUser(int $userId): int;

    /**
     * @param  array{name: string, parent_id?: int|null, depth: int}  $attributes
     */
    public function createForUser(int $userId, array $attributes): Folder;

    /**
     * @param  array{name: string}  $attributes
     */
    public function updateForUser(int $userId, Folder $folder, array $attributes): Folder;

    public function deleteForUser(int $userId, Folder $folder): bool;

    public function hasChildren(Folder $folder): bool;

    public function hasActiveAssets(Folder $folder): bool;

    /**
     * @param  Collection<int, Folder>  $descendants
     */
    public function reparentSubtreeForUser(
        int $userId,
        Folder $folder,
        ?int $parentId,
        int $depth,
        Collection $descendants,
        int $depthDelta,
    ): Folder;
}
