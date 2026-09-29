<?php

namespace App\Modules\Folder\Services;

use App\Models\User;
use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use App\Modules\ActivityLog\Services\ActivityLogService;
use App\Modules\ActivityLog\Support\ActivitySnapshot;
use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use App\Modules\Folder\Support\FolderDepth;
use App\Modules\Folder\Support\FolderPresentation;
use App\Shared\Exceptions\FolderDepthExceededException;
use App\Shared\Exceptions\FolderNotEmptyException;
use Illuminate\Support\Collection;

class FolderService
{
    public function __construct(
        private readonly FolderRepositoryInterface $folders,
        private readonly ActivityLogService $activityLogs,
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
        return FolderPresentation::options($this->folders->allForUser($user->id));
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public function breadcrumbs(?Folder $folder): array
    {
        return FolderPresentation::breadcrumbs($folder);
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

        $folder = $this->folders->createForUser($user->id, [
            'name' => $attributes['name'],
            'parent_id' => $parentId,
            'depth' => $depth,
        ]);

        $this->activityLogs->record(
            $user,
            ActivityModule::Folder,
            ActivityAction::Created,
            $folder,
            null,
            ActivitySnapshot::folder($folder),
            $folder->name,
        );

        return $folder;
    }

    /**
     * @param  array{name: string}  $attributes
     */
    public function update(User $user, Folder $folder, array $attributes): Folder
    {
        $oldValues = ActivitySnapshot::folder($folder);
        $updated = $this->folders->updateForUser($user->id, $folder, $attributes);

        $this->activityLogs->record(
            $user,
            ActivityModule::Folder,
            ActivityAction::Updated,
            $updated,
            $oldValues,
            ActivitySnapshot::folder($updated),
            $updated->name,
        );

        return $updated;
    }

    /**
     * @throws FolderNotEmptyException
     */
    public function delete(User $user, Folder $folder): void
    {
        if ($this->folders->hasChildren($folder) || $this->folders->hasActiveAssets($folder)) {
            throw new FolderNotEmptyException;
        }

        $oldValues = ActivitySnapshot::folder($folder);
        $label = $folder->name;
        $this->folders->deleteForUser($user->id, $folder);

        $this->activityLogs->record(
            $user,
            ActivityModule::Folder,
            ActivityAction::Deleted,
            null,
            $oldValues,
            null,
            $label,
        );
    }
}
