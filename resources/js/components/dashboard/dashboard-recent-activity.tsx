import { Link } from '@inertiajs/react';
import { ArrowRight, ScrollText } from 'lucide-react';
import {
    ActivityActionBadge,
    ActivityModuleBadge,
} from '@/components/activity-logs/activity-badges';
import { Button } from '@/components/ui/button';
import { formatActivityDateTime } from '@/lib/activity-log-display';
import type { DashboardRecentActivityProps } from '@/types/dashboard';

export function DashboardRecentActivity({
    logs,
}: DashboardRecentActivityProps) {
    return (
        <section className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="space-y-0.5">
                    <h2 className="text-sm font-semibold tracking-tight">
                        Recent activity
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Changes across brand, folders, and assets
                    </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/activity-logs">
                        Full log
                        <ArrowRight className="size-3.5" />
                    </Link>
                </Button>
            </header>

            {logs.length === 0 ? (
                <div className="flex flex-1 flex-col items-start justify-center gap-3 p-5">
                    <span className="rounded-lg border border-border bg-muted/60 p-2 text-muted-foreground">
                        <ScrollText className="size-4" />
                    </span>
                    <p className="text-sm text-muted-foreground">
                        Activity will appear here as you manage your brand kit
                        and assets.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-border">
                    {logs.map((log) => (
                        <li
                            key={log.id}
                            className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0 space-y-1">
                                <p className="truncate text-sm font-medium">
                                    {log.subject_label ?? 'Workspace change'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatActivityDateTime(log.created_at)}
                                </p>
                            </div>
                            <div className="flex shrink-0 flex-wrap gap-1.5">
                                <ActivityModuleBadge module={log.module} />
                                <ActivityActionBadge action={log.action} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
