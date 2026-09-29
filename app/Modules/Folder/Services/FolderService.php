<?php

namespace App\Modules\Folder\Services;

use App\Models\User;
use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use App\Modules\Folder\Support\FolderDepth;
use App\Shared\Exceptions\FolderDepthExceededException;
use App\Shared\Exceptions\FolderNotEmptyException;
use Illuminate\Support\Collection;

class FolderService
{
    public function __construct(
        private readonly FolderRepositoryInterface $folders,
    ) {}

    public function findOwned(User $user, int $folderId): ?Folder
    {
        return $this->folders->findForUser($user->id, $folderId);
    }

    /**
     * @return Collection<int, Folder>
     */
    public function children(User $user, ?int $parentId): Collection
    {
        return $this->folders->childrenForUser($user->id, $parentId);
    }

    /**
     * @return Collection<int, Folder>
     */
    public function all(User $user): Collection
    {
        return $this->folders->allForUser($user->id);
    }

    /**
     * @return list<array{id: int|null, label: string}>
     */
    public function optionsForUser(User $user): array
    {
        $folders = $this->folders->allForUser($user->id);
        $byId = $folders->keyBy('id');
        $options = [
            ['id' => null, 'label' => 'Library (root)'],
        ];

        foreach ($folders as $folder) {
            $parts = [];
            $current = $folder;

            while ($current !== null) {
                array_unshift($parts, $current->name);
                $parentId = $current->parent_id;
                $current = $parentId !== null ? $byId->get($parentId) : null;
            }

            $options[] = [
                'id' => $folder->id,
                'label' => implode(' / ', $parts),
            ];
        }

        return $options;
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public function breadcrumbs(?Folder $folder): array
    {
        if ($folder === null) {
            return [];
        }

        $crumbs = [];
        $current = $folder;

        while ($current !== null) {
            array_unshift($crumbs, [
                'id' => $current->id,
                'name' => $current->name,
            ]);
            $current = $current->parent;
        }

        return $crumbs;
    }

    /**
     * @param  array{name: string, parent_id?: int|null}  $attributes
     *
     * @throws FolderDepthExceededException
     */
    public function create(User $user, array $attributes): Folder
    {
        $parentId = $attributes['parent_id'] ?? null;
        $depth = 0;

        if ($parentId !== null) {
            $parent = $this->folders->findForUser($user->id, (int) $parentId);
            abort_if($parent === null, 404);
            $depth = $parent->depth + 1;
        }

        if ($depth > FolderDepth::MAX) {
            throw new FolderDepthExceededException;
        }

        return $this->folders->createForUser($user->id, [
            'name' => $attributes['name'],
            'parent_id' => $parentId,
            'depth' => $depth,
        ]);
    }

    /**
     * @param  array{name: string}  $attributes
     */
    public function update(User $user, Folder $folder, array $attributes): Folder
    {
        return $this->folders->updateForUser($user->id, $folder, $attributes);
    }

    /**
     * @throws FolderNotEmptyException
     */
    public function delete(User $user, Folder $folder): void
    {
        if ($this->folders->hasChildren($folder) || $this->folders->hasActiveAssets($folder)) {
            throw new FolderNotEmptyException;
        }

        $this->folders->deleteForUser($user->id, $folder);
    }
}
