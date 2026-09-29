<?php

namespace App\Modules\ActivityLog\Repositories;

use App\Modules\ActivityLog\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ActivityLogRepository implements ActivityLogRepositoryInterface
{
    public function createForUser(int $userId, array $attributes): ActivityLog
    {
        return ActivityLog::query()->create([
            ...$attributes,
            'user_id' => $userId,
        ]);
    }

    public function listForUser(int $userId, array $filters): LengthAwarePaginator
    {
        $query = ActivityLog::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        $search = $filters['search'] ?? null;

        if (is_string($search) && $search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('subject_label', 'ilike', "%{$search}%")
                    ->orWhere('module', 'ilike', "%{$search}%")
                    ->orWhere('action', 'ilike', "%{$search}%");
            });
        }

        $module = $filters['module'] ?? null;

        if (is_string($module) && $module !== '') {
            $query->where('module', $module);
        }

        $action = $filters['action'] ?? null;

        if (is_string($action) && $action !== '') {
            $query->where('action', $action);
        }

        $perPage = (int) ($filters['per_page'] ?? 20);

        return $query->paginate($perPage, ['*'], 'page', (int) ($filters['page'] ?? 1));
    }

    public function recentForUser(int $userId, int $limit = 8): Collection
    {
        return ActivityLog::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(max(1, $limit))
            ->get();
    }
}
