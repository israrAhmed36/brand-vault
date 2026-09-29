<?php

namespace App\Modules\Folder\Policies;

use App\Models\User;
use App\Modules\Folder\Models\Folder;

class FolderPolicy
{
    public function view(User $user, Folder $folder): bool
    {
        return $folder->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Folder $folder): bool
    {
        return $folder->user_id === $user->id;
    }

    public function delete(User $user, Folder $folder): bool
    {
        return $folder->user_id === $user->id;
    }
}
