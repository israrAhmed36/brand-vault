<?php

namespace App\Modules\Brand\Services;

use App\Models\User;
use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use App\Modules\ActivityLog\Services\ActivityLogService;
use App\Modules\ActivityLog\Support\ActivitySnapshot;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use App\Modules\Webhook\Enums\WebhookEvent;
use App\Modules\Webhook\Services\WebhookNotifier;
use Illuminate\Auth\Access\AuthorizationException;

class BrandService
{
    public function __construct(
        private readonly BrandRepositoryInterface $brands,
        private readonly ActivityLogService $activityLogs,
        private readonly WebhookNotifier $webhooks,
    ) {}

    public function forUser(User $user): ?Brand
    {
        return $this->brands->findForUser($user->id);
    }

    /**
     * @param  array{name: string, primary_color: string, secondary_color: string, logo_url?: string|null, default_font?: string|null}  $attributes
     */
    public function upsert(User $user, array $attributes): Brand
    {
        $existing = $this->brands->findForUser($user->id);
        $oldValues = $existing !== null ? ActivitySnapshot::brand($existing) : null;
        $brand = $this->brands->upsertForUser($user->id, $attributes);
        $action = $existing === null ? ActivityAction::Created : ActivityAction::Updated;

        $this->activityLogs->record(
            $user,
            ActivityModule::Brand,
            $action,
            $brand,
            $oldValues,
            ActivitySnapshot::brand($brand),
            $brand->name,
        );

        $this->webhooks->send(
            WebhookEvent::BrandUpdated,
            $brand->id,
            (string) $user->email,
            $user->id,
        );

        return $brand;
    }

    /**
     * @throws AuthorizationException
     */
    public function delete(User $user): void
    {
        $existing = $this->brands->findForUser($user->id);

        if ($existing === null) {
            throw new AuthorizationException('Brand kit not found.');
        }

        $oldValues = ActivitySnapshot::brand($existing);
        $label = $existing->name;
        $deleted = $this->brands->deleteForUser($user->id);

        if (! $deleted) {
            throw new AuthorizationException('Brand kit not found.');
        }

        $this->activityLogs->record(
            $user,
            ActivityModule::Brand,
            ActivityAction::Deleted,
            null,
            $oldValues,
            null,
            $label,
        );
    }
}
