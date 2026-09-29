<?php

namespace App\Modules\Asset\Policies;

use App\Models\User;
use App\Modules\Asset\Models\Asset;

class AssetPolicy
{
    public function view(User $user, Asset $asset): bool
    {
        return $asset->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Asset $asset): bool
    {
        return $asset->user_id === $user->id;
    }

    public function delete(User $user, Asset $asset): bool
    {
        return $asset->user_id === $user->id;
    }

    public function restore(User $user, Asset $asset): bool
    {
        return $asset->user_id === $user->id;
    }

    public function forceDelete(User $user, Asset $asset): bool
    {
        return $asset->user_id === $user->id && $asset->trashed();
    }
}
