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
        <div className="flex flex-col gap-3 border-t border-border/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground tabular-nums">
                {activityLogRangeLabel(currentPage, perPage, total)}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        Rows per page
                    </span>
                    <Select
                        value={String(perPage)}
                        onValueChange={(value) => {
                            navigate(1, Number(value) as ActivityLogPerPage);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[4.5rem]" size="sm">
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

                <ActivityLogsPageButtons
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    pageItems={buildActivityLogPageItems(currentPage, lastPage)}
                    onNavigate={navigate}
                />
            </div>
        </div>
    );
}
