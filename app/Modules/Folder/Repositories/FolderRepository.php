<?php

namespace App\Modules\Folder\Repositories;

use App\Modules\Folder\Models\Folder;
use Illuminate\Support\Collection;

class FolderRepository implements FolderRepositoryInterface
{
    public function findForUser(int $userId, int $folderId): ?Folder
    {
        return Folder::query()
            ->where('user_id', $userId)
            ->whereKey($folderId)
            ->first();
    }

    public function childrenForUser(int $userId, ?int $parentId): Collection
    {
        return Folder::query()
            ->where('user_id', $userId)
            ->where('parent_id', $parentId)
            ->orderBy('name')
            ->get();
    }

    public function allForUser(int $userId): Collection
    {
        return Folder::query()
            ->where('user_id', $userId)
            ->withCount('assets')
            ->orderBy('depth')
            ->orderBy('name')
            ->get();
    }

    public function countForUser(int $userId): int
    {
        return Folder::query()->where('user_id', $userId)->count();
    }

    public function createForUser(int $userId, array $attributes): Folder
    {
        return Folder::query()->create([
            'user_id' => $userId,
            'parent_id' => $attributes['parent_id'] ?? null,
            'name' => $attributes['name'],
            'depth' => $attributes['depth'],
        ]);
    }

    public function updateForUser(int $userId, Folder $folder, array $attributes): Folder
    {
        abort_unless($folder->user_id === $userId, 403);

        $folder->fill([
            'name' => $attributes['name'],
        ])->save();

        return $folder->refresh();
    }

    public function deleteForUser(int $userId, Folder $folder): bool
    {
        abort_unless($folder->user_id === $userId, 403);

        return (bool) $folder->delete();
    }

    public function hasChildren(Folder $folder): bool
    {
        return $folder->children()->exists();
    }

    public function hasActiveAssets(Folder $folder): bool
    {
        return $folder->assets()->whereNull('deleted_at')->exists();
    }

    public function reparentSubtreeForUser(
        int $userId,
        Folder $folder,
        ?int $parentId,
        int $depth,
        Collection $descendants,
        int $depthDelta,
    ): Folder {
        abort_unless($folder->user_id === $userId, 403);

        $folder->forceFill([
            'parent_id' => $parentId,
            'depth' => $depth,
        ])->save();

        foreach ($descendants as $descendant) {
            abort_unless($descendant->user_id === $userId, 403);
            $descendant->forceFill([
                'depth' => $descendant->depth + $depthDelta,
            ])->save();
        }

        return $folder->refresh();
    }
}
