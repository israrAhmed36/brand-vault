<?php

namespace App\Modules\ActivityLog\Repositories;

use App\Modules\ActivityLog\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

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

    /**
     * @return Collection<int, ActivityLog>
     */
    public function recentForUser(int $userId, int $limit = 8): Collection;
}
