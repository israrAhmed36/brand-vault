<?php

namespace App\Modules\Brand\Policies;

use App\Models\User;
use App\Modules\Brand\Models\Brand;

class BrandPolicy
{
    public function view(User $user, Brand $brand): bool
    {
        return $brand->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Brand $brand): bool
    {
        return $brand->user_id === $user->id;
    }

    public function delete(User $user, Brand $brand): bool
    {
        return $brand->user_id === $user->id;
    }
}
