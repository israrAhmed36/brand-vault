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
use App\Modules\Webhook\Enums\WebhookEvent;
use App\Modules\Webhook\Services\WebhookNotifier;

class AssetTrashService
{
    public function __construct(
        private readonly AssetRepositoryInterface $assets,
        private readonly FolderRepositoryInterface $folders,
        private readonly ActivityLogService $activityLogs,
        private readonly WebhookNotifier $webhooks,
    ) {}

    public function softDelete(User $user, Asset $asset): void
    {
        $oldValues = ActivitySnapshot::asset($asset);
        $this->assets->softDeleteForUser($user->id, $asset);

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::Trashed,
            $asset,
            $oldValues,
            null,
            $asset->name,
        );
    }

    /**
     * @return array{asset: Asset, restored_to_root: bool}
     */
    public function restore(User $user, Asset $asset): array
    {
        $oldValues = ActivitySnapshot::asset($asset);
        $restored = $this->assets->restoreForUser($user->id, $asset);
        $restoredToRoot = false;

        if ($restored->folder_id !== null) {
            $folder = $this->folders->findForUser($user->id, $restored->folder_id);

            if ($folder === null) {
                $restored->forceFill(['folder_id' => null])->save();
                $restoredToRoot = true;
            }
        }

        $restored = $restored->refresh();

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::Restored,
            $restored,
            $oldValues,
            ActivitySnapshot::asset($restored),
            $restored->name,
        );

        $this->webhooks->send(
            WebhookEvent::AssetRestored,
            $restored->id,
            (string) $user->email,
            $user->id,
        );

        return [
            'asset' => $restored,
            'restored_to_root' => $restoredToRoot,
        ];
    }

    public function forceDelete(User $user, Asset $asset): void
    {
        $oldValues = ActivitySnapshot::asset($asset);
        $label = $asset->name;
        $this->assets->forceDeleteForUser($user->id, $asset);

        $this->activityLogs->record(
            $user,
            ActivityModule::Asset,
            ActivityAction::ForceDeleted,
            null,
            $oldValues,
            null,
            $label,
        );
    }
}
