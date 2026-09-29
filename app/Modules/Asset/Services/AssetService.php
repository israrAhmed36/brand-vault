<?php

namespace App\Modules\Asset\Services;

use App\Models\User;
use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use App\Modules\ActivityLog\Services\ActivityLogService;
use App\Modules\ActivityLog\Support\ActivitySnapshot;
use App\Modules\Asset\Models\Asset;
use App\Modules\Asset\Repositories\AssetRepositoryInterface;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;

class AssetService
{
    public function __construct(
        private readonly AssetRepositoryInterface $assets,
        private readonly FolderRepositoryInterface $folders,
        private readonly AssetFileService $files,
        private readonly ActivityLogService $activityLogs,
    ) {}

    public function findOwned(User $user, int $assetId): ?Asset
    {
        return $this->assets->findForUser($user->id, $assetId);
    }

    /**
     * @param  array{search?: string|null, sort?: string|null, folder_id?: int|null, page?: int|null, per_page?: int|null}  $filters
     * @return LengthAwarePaginator<int, Asset>
     */
    public function list(User $user, array $filters, bool $trashed = false): LengthAwarePaginator
    {
        $paginator = $this->assets->listForUser($user->id, $filters, $trashed);

        foreach ($paginator->items() as $asset) {
            $asset->setAttribute('url', $this->files->presentUrl($asset->url));
        }

        return $paginator;
    }

    /**
     * @return array{assets: int, trash: int}
     */
    public function libraryCounts(User $user): array
    {
        return [
            'assets' => $this->assets->countForUser($user->id),
            'trash' => $this->assets->countForUser($user->id, trashed: true),
        ];
    }

    /**
     * @param  array{name: string, type: string, url: string, folder_id?: int|null}  $attributes
     */
    public function create(User $user, array $attributes): Asset
    {
        $this->assertFolderOwned($user, $attributes['folder_id'] ?? null);
        $attributes['url'] = (string) $this->files->toCanonicalUrl($attributes['url']);
        $asset = $this->assets->createForUser($user->id, $attributes);

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::Created,
            $asset,
            null,
            ActivitySnapshot::asset($asset),
            $asset->name,
        );

        return $asset;
    }

    /**
     * @param  array{name: string, type: string, url: string, folder_id?: int|null}  $attributes
     */
    public function update(
        User $user,
        Asset $asset,
        array $attributes,
        ?UploadedFile $file = null,
    ): Asset {
        $this->assertFolderOwned($user, $attributes['folder_id'] ?? null);
        $oldValues = ActivitySnapshot::asset($asset);

        if ($file !== null) {
            $attributes['url'] = $this->files->store($user, $file);
        }

        $attributes['url'] = (string) $this->files->toCanonicalUrl($attributes['url']);
        $updated = $this->assets->updateForUser($user->id, $asset, $attributes);

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::Updated,
            $updated,
            $oldValues,
            ActivitySnapshot::asset($updated),
            $updated->name,
        );

        return $updated;
    }

    public function move(User $user, Asset $asset, ?int $folderId): Asset
    {
        $this->assertFolderOwned($user, $folderId);
        $oldValues = ActivitySnapshot::asset($asset);
        $moved = $this->assets->moveForUser($user->id, $asset, $folderId);

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::Moved,
            $moved,
            $oldValues,
            ActivitySnapshot::asset($moved),
            $moved->name,
        );

        return $moved;
    }

    private function assertFolderOwned(User $user, ?int $folderId): void
    {
        if ($folderId === null) {
            return;
        }

        abort_if($this->folders->findForUser($user->id, $folderId) === null, 404);
    }
}
