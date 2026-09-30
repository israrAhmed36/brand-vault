import { router } from '@inertiajs/react';
import { ActivityLogsPageButtons } from '@/components/activity-logs/activity-logs-page-buttons';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    ACTIVITY_LOG_PER_PAGE_OPTIONS,
    activityLogRangeLabel,
    buildActivityLogPageItems,
    buildActivityLogQuery,
    type ActivityLogPerPage,
} from '@/lib/activity-log-query';

type ActivityLogsPaginationProps = {
    currentPage: number;
    lastPage: number;
    perPage: ActivityLogPerPage;
    total: number;
    search: string;
    module: string;
    action: string;
};

export function ActivityLogsPagination({
    currentPage,
    lastPage,
    perPage,
    total,
    search,
    module,
    action,
}: ActivityLogsPaginationProps) {
    function navigate(page: number, nextPerPage = perPage): void {
        router.get(
            '/activity-logs',
            buildActivityLogQuery({
                search,
                module,
                action,
                perPage: nextPerPage,
                page,
            }),
            {
                preserveState: true,
                preserveScroll: true,
                only: ['logs', 'filters'],
            },
        );
    }

    return (
        <div className="shrink-0 space-y-2 border-t border-border/80 bg-card/80 px-3 py-3 backdrop-blur-sm sm:px-4">
            <p className="text-xs text-muted-foreground tabular-nums">
                {activityLogRangeLabel(currentPage, perPage, total)}
            </p>

            <div className="flex items-center justify-between gap-2">
                <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">
                        Per page
                    </span>
                    <Select
                        value={String(perPage)}
                        onValueChange={(value) => {
                            navigate(1, Number(value) as ActivityLogPerPage);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[4.25rem]" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ACTIVITY_LOG_PER_PAGE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="min-w-0 overflow-x-auto">
                    <ActivityLogsPageButtons
                        currentPage={currentPage}
                        lastPage={lastPage}
                        total={total}
                        pageItems={buildActivityLogPageItems(
                            currentPage,
                            lastPage,
                        )}
                        onNavigate={navigate}
                    />
                </div>
            </div>
        </div>
    );
}
