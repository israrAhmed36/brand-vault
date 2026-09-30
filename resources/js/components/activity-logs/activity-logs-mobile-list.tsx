import {
    ActivityActionBadge,
    ActivityModuleBadge,
} from '@/components/activity-logs/activity-badges';
import { ActivityChangeDiff } from '@/components/activity-logs/activity-change-diff';
import { formatActivityDateTime } from '@/lib/activity-log-display';
import type { ActivityLog } from '@/types/activity-log';

type ActivityLogsMobileListProps = {
    logs: ActivityLog[];
    page: number;
    perPage: number;
};

export function ActivityLogsMobileList({
    logs,
    page,
    perPage,
}: ActivityLogsMobileListProps) {
    if (logs.length === 0) {
        return null;
    }

    return (
        <ul className="divide-y divide-border/70 md:hidden">
            {logs.map((log, index) => (
                <li key={log.id} className="space-y-3 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                            <p className="truncate text-sm font-semibold text-foreground">
                                {log.subject_label ?? 'Untitled'}
                            </p>
                            <time
                                dateTime={log.created_at}
                                className="block text-xs text-muted-foreground tabular-nums"
                            >
                                {formatActivityDateTime(log.created_at)}
                            </time>
                        </div>
                        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                            #{(page - 1) * perPage + index + 1}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <ActivityModuleBadge module={log.module} />
                        <ActivityActionBadge action={log.action} />
                    </div>

                    <ActivityChangeDiff
                        oldValues={log.old_values}
                        newValues={log.new_values}
                    />
                </li>
            ))}
        </ul>
    );
}
