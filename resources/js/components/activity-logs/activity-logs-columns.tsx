import type { LegacyColumnDef } from '@tanstack/react-table/legacy';
import {
    ActivityActionBadge,
    ActivityModuleBadge,
} from '@/components/activity-logs/activity-badges';
import { ActivityChangeDiff } from '@/components/activity-logs/activity-change-diff';
import { formatActivityDateTime } from '@/lib/activity-log-display';
import type { ActivityLog } from '@/types/activity-log';

export type ActivityLogsTableMeta = {
    page: number;
    perPage: number;
};

export const activityLogsColumns: LegacyColumnDef<ActivityLog>[] = [
    {
        id: 'index',
        header: '#',
        cell: ({ row, table }) => {
            const meta = table.options.meta as
                | ActivityLogsTableMeta
                | undefined;
            const page = meta?.page ?? 1;
            const perPage = meta?.perPage ?? 20;

            return (
                <span className="text-sm text-muted-foreground tabular-nums">
                    {(page - 1) * perPage + row.index + 1}
                </span>
            );
        },
    },
    {
        id: 'created_at',
        header: 'Date / time',
        cell: ({ row }) => (
            <time
                dateTime={row.original.created_at}
                className="text-sm whitespace-nowrap text-foreground tabular-nums"
            >
                {formatActivityDateTime(row.original.created_at)}
            </time>
        ),
    },
    {
        id: 'module',
        header: 'Module',
        cell: ({ row }) => <ActivityModuleBadge module={row.original.module} />,
    },
    {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => <ActivityActionBadge action={row.original.action} />,
    },
    {
        id: 'subject',
        header: 'Subject',
        cell: ({ row }) => (
            <span className="max-w-48 truncate text-sm font-medium text-foreground">
                {row.original.subject_label ?? '—'}
            </span>
        ),
    },
    {
        id: 'changes',
        header: 'Changes',
        cell: ({ row }) => (
            <ActivityChangeDiff
                oldValues={row.original.old_values}
                newValues={row.original.new_values}
            />
        ),
    },
];
