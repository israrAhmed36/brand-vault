<?php

namespace App\Modules\ActivityLog\Services;

use App\Models\User;
use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use App\Modules\ActivityLog\Models\ActivityLog;
use App\Modules\ActivityLog\Repositories\ActivityLogRepositoryInterface;
use App\Modules\ActivityLog\Support\ActivityLogHumanizer;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class ActivityLogService
{
    public function __construct(
        private readonly ActivityLogRepositoryInterface $activityLogs,
        private readonly FolderRepositoryInterface $folders,
    ) {}

    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public function record(
        User $user,
        ActivityModule $module,
        ActivityAction $action,
        ?Model $subject = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $subjectLabel = null,
    ): ActivityLog {
        return $this->activityLogs->createForUser($user->id, [
            'module' => $module->value,
            'action' => $action->value,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'subject_label' => $subjectLabel,
            'old_values' => $oldValues,
            'new_values' => $newValues,
        ]);
    }

    /**
     * @param  array{search?: string|null, module?: string|null, action?: string|null, page?: int|null, per_page?: int|null}  $filters
     * @return LengthAwarePaginator<int, ActivityLog>
     */
    public function list(User $user, array $filters): LengthAwarePaginator
    {
        $paginator = $this->activityLogs->listForUser($user->id, $filters);
        $folderNames = $this->folders
            ->allForUser($user->id)
            ->pluck('name', 'id')
            ->all();

        foreach ($paginator->items() as $log) {
            $log->setAttribute(
                'old_values',
                ActivityLogHumanizer::values($log->old_values, $folderNames),
            );
            $log->setAttribute(
                'new_values',
                ActivityLogHumanizer::values($log->new_values, $folderNames),
            );
        }

        return $paginator;
    }
}
