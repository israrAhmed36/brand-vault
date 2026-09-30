import { Head, usePage } from '@inertiajs/react';
import { ActivityLogsDataTable } from '@/components/activity-logs/activity-logs-data-table';
import { ActivityLogsPagination } from '@/components/activity-logs/activity-logs-pagination';
import { ActivityLogsToolbar } from '@/components/activity-logs/activity-logs-toolbar';
import { useActivityLogsQuery } from '@/hooks/use-activity-logs-query';
import type { ActivityLogsPageProps } from '@/types/activity-log';

export default function ActivityLogsIndex() {
    const { logs, filters, moduleOptions, actionOptions } =
        usePage<ActivityLogsPageProps>().props;
    const { search, module, action, setSearch, setModule, setAction } =
        useActivityLogsQuery({ filters });

    return (
        <>
            <Head title="Activity log" />
            <div className="flex min-h-0 flex-1 flex-col p-3 md:p-6">
                <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-gradient-to-b from-muted/40 via-background to-background shadow-sm md:min-h-[70vh] md:rounded-xl">
                    <ActivityLogsToolbar
                        search={search}
                        module={module}
                        action={action}
                        moduleOptions={moduleOptions}
                        actionOptions={actionOptions}
                        total={logs.total}
                        onSearchChange={setSearch}
                        onModuleChange={setModule}
                        onActionChange={setAction}
                    />
                    <div className="min-h-0 flex-1 overflow-auto">
                        <ActivityLogsDataTable
                            logs={logs.data}
                            page={logs.current_page}
                            perPage={logs.per_page}
                        />
                    </div>
                    <ActivityLogsPagination
                        currentPage={logs.current_page}
                        lastPage={logs.last_page}
                        perPage={logs.per_page}
                        total={logs.total}
                        search={search}
                        module={module}
                        action={action}
                    />
                </section>
            </div>
        </>
    );
}

ActivityLogsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Activity log',
            href: '/activity-logs',
        },
    ],
};
