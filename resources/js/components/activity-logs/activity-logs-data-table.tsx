import { flexRender } from '@tanstack/react-table';
import { getCoreRowModel, useLegacyTable } from '@tanstack/react-table/legacy';
import {
    activityLogsColumns,
    type ActivityLogsTableMeta,
} from '@/components/activity-logs/activity-logs-columns';
import type { ActivityLog } from '@/types/activity-log';

type ActivityLogsDataTableProps = {
    logs: ActivityLog[];
    page: number;
    perPage: number;
};

export function ActivityLogsDataTable({
    logs,
    page,
    perPage,
}: ActivityLogsDataTableProps) {
    const table = useLegacyTable({
        data: logs,
        columns: activityLogsColumns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => String(row.id),
        meta: { page, perPage } satisfies ActivityLogsTableMeta,
    });

    if (logs.length === 0) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
                <p className="text-sm font-medium text-foreground">
                    No activity yet
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                    Create or update a brand kit, folder, or asset and the
                    change will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="border-b border-border bg-muted/40">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext(),
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="border-b border-border/70 transition-colors hover:bg-muted/30"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-4 py-3 align-top"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
