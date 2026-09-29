<?php

namespace App\Modules\Brand\Services;

use App\Models\User;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;

class BrandService
{
    public function __construct(
        private readonly BrandRepositoryInterface $brands,
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
        return $this->brands->upsertForUser($user->id, $attributes);
    }

    /**
     * @throws AuthorizationException
     */
    public function delete(User $user): void
    {
        $deleted = $this->brands->deleteForUser($user->id);

        if (! $deleted) {
            throw new AuthorizationException('Brand kit not found.');
        }
    }
}
