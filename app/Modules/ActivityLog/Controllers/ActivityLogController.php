<?php

namespace App\Modules\ActivityLog\Controllers;

use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use App\Modules\ActivityLog\Models\ActivityLog;
use App\Modules\ActivityLog\Requests\ListActivityLogsRequest;
use App\Modules\ActivityLog\Services\ActivityLogService;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController
{
    public function __construct(
        private readonly ActivityLogService $activityLogs,
    ) {}

    public function index(ListActivityLogsRequest $request): Response
    {
        $user = $request->user();
        abort_unless($user->can('viewAny', ActivityLog::class), 403);

        $filters = $request->listFilters();

        return Inertia::render('activity-logs/index', [
            'logs' => $this->activityLogs->list($user, $filters),
            'filters' => [
                'search' => $filters['search'],
                'module' => $filters['module'],
                'action' => $filters['action'],
                'per_page' => $filters['per_page'],
            ],
            'moduleOptions' => array_map(
                static fn (ActivityModule $module): array => [
                    'value' => $module->value,
                    'label' => ucfirst($module->value),
                ],
                ActivityModule::cases(),
            ),
            'actionOptions' => array_map(
                static fn (ActivityAction $action): array => [
                    'value' => $action->value,
                    'label' => str_replace('_', ' ', ucfirst($action->value)),
                ],
                ActivityAction::cases(),
            ),
        ]);
    }
}
