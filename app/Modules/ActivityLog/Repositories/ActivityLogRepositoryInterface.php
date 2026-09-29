<?php

namespace App\Modules\ActivityLog\Repositories;

use App\Modules\ActivityLog\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ActivityLogRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function createForUser(int $userId, array $attributes): ActivityLog;

    /**
     * @param  array{search?: string|null, module?: string|null, action?: string|null, page?: int|null, per_page?: int|null}  $filters
     * @return LengthAwarePaginator<int, ActivityLog>
     */
    public function listForUser(int $userId, array $filters): LengthAwarePaginator;
}
