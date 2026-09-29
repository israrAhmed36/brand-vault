<?php

namespace App\Modules\Asset\Services;

use App\Models\User;
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

        return $this->assets->createForUser($user->id, $attributes);
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

        if ($file !== null) {
            $attributes['url'] = $this->files->store($user, $file);
        }

        $attributes['url'] = (string) $this->files->toCanonicalUrl($attributes['url']);

        return $this->assets->updateForUser($user->id, $asset, $attributes);
    }

    public function move(User $user, Asset $asset, ?int $folderId): Asset
    {
        $this->assertFolderOwned($user, $folderId);

        return $this->assets->moveForUser($user->id, $asset, $folderId);
    }

    public function softDelete(User $user, Asset $asset): void
    {
        $this->assets->softDeleteForUser($user->id, $asset);
    }

    /**
     * @return array{asset: Asset, restored_to_root: bool}
     */
    public function restore(User $user, Asset $asset): array
    {
        $restored = $this->assets->restoreForUser($user->id, $asset);
        $restoredToRoot = false;

        if ($restored->folder_id !== null) {
            $folder = $this->folders->findForUser($user->id, $restored->folder_id);

            if ($folder === null) {
                $restored->forceFill(['folder_id' => null])->save();
                $restoredToRoot = true;
            }
        }

        return [
            'asset' => $restored->refresh(),
            'restored_to_root' => $restoredToRoot,
        ];
    }

    public function forceDelete(User $user, Asset $asset): void
    {
        $this->assets->forceDeleteForUser($user->id, $asset);
    }

    private function assertFolderOwned(User $user, ?int $folderId): void
    {
        if ($folderId === null) {
            return;
        }

        abort_if($this->folders->findForUser($user->id, $folderId) === null, 404);
    }
}
