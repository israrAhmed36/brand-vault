<?php

namespace App\Modules\ActivityLog\Policies;

use App\Models\User;
use App\Modules\ActivityLog\Models\ActivityLog;

class ActivityLogPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ActivityLog $activityLog): bool
    {
        return $activityLog->user_id === $user->id;
    }
}
