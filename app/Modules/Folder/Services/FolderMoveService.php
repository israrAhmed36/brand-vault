<?php

namespace App\Modules\Folder\Services;

use App\Models\User;
use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use App\Modules\Folder\Support\FolderDepth;
use App\Shared\Exceptions\FolderDepthExceededException;
use App\Shared\Exceptions\LastRootFolderException;
use Illuminate\Support\Collection;

class FolderMoveService
{
    public function __construct(
        private readonly FolderRepositoryInterface $folders,
    ) {}

    /**
     * @throws FolderDepthExceededException
     * @throws LastRootFolderException
     */
    public function move(User $user, Folder $folder, ?int $newParentId): Folder
    {
        if ($folder->parent_id === $newParentId) {
            return $folder;
        }

        /** @var Collection<int, Folder> $all */
        $all = $this->folders->allForUser($user->id)->keyBy('id');
        abort_unless($all->has($folder->id), 404);

        if ($folder->parent_id === null && $newParentId !== null) {
            $rootCount = $all->whereNull('parent_id')->count();

            if ($rootCount <= 1) {
                throw new LastRootFolderException;
            }
        }

        $newDepth = 0;

        if ($newParentId !== null) {
            $parent = $all->get($newParentId);
            abort_if($parent === null, 404);

            if ($this->isUnderFolder($all, $folder->id, $newParentId)) {
                abort(422, 'Cannot move a folder into itself or its child.');
            }

            $newDepth = $parent->depth + 1;
        }

        $depthDelta = $newDepth - $folder->depth;
        $descendants = $this->descendantsOf($all, $folder->id);
        $maxNewDepth = $newDepth;

        foreach ($descendants as $descendant) {
            $maxNewDepth = max($maxNewDepth, $descendant->depth + $depthDelta);
        }

        if ($maxNewDepth > FolderDepth::MAX) {
            throw new FolderDepthExceededException;
        }

        return $this->folders->reparentSubtreeForUser(
            $user->id,
            $folder,
            $newParentId,
            $newDepth,
            $descendants,
            $depthDelta,
        );
    }

    /**
     * @param  Collection<int, Folder>  $all
     */
    private function isUnderFolder(Collection $all, int $folderId, int $candidateId): bool
    {
        $current = $all->get($candidateId);

        while ($current !== null) {
            if ($current->id === $folderId) {
                return true;
            }

            $current = $current->parent_id !== null
                ? $all->get($current->parent_id)
                : null;
        }

        return false;
    }

    /**
     * @param  Collection<int, Folder>  $all
     * @return Collection<int, Folder>
     */
    private function descendantsOf(Collection $all, int $folderId): Collection
    {
        $result = collect();
        $queue = [$folderId];

        while ($queue !== []) {
            $parentId = array_shift($queue);

            foreach ($all as $folder) {
                if ($folder->parent_id === $parentId) {
                    $result->push($folder);
                    $queue[] = $folder->id;
                }
            }
        }

        return $result;
    }
}
