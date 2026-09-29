import { ArrowRight } from 'lucide-react';
import { activityChangeSummary } from '@/lib/activity-log-display';
import type { ActivityLogValues } from '@/types/activity-log';

type ActivityChangeDiffProps = {
    oldValues: ActivityLogValues;
    newValues: ActivityLogValues;
};

export function ActivityChangeDiff({
    oldValues,
    newValues,
}: ActivityChangeDiffProps) {
    const changes = activityChangeSummary(oldValues, newValues);

    if (changes.length === 0) {
        return (
            <span className="text-sm text-muted-foreground">
                No field changes
            </span>
        );
    }

    return (
        <div className="space-y-1.5">
            {changes.map((change) => (
                <div
                    key={change.key}
                    className="grid gap-1 text-xs sm:grid-cols-[7.5rem_1fr]"
                >
                    <span className="font-medium text-muted-foreground">
                        {change.label}
                    </span>
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        {change.previous !== null ? (
                            <span
                                className={
                                    change.next !== null &&
                                    change.previous !== change.next
                                        ? 'truncate text-rose-700 line-through dark:text-rose-300'
                                        : 'truncate text-muted-foreground'
                                }
                                title={change.previous}
                            >
                                {change.previous}
                            </span>
                        ) : null}
                        {change.previous !== null && change.next !== null ? (
                            <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                        ) : null}
                        {change.next !== null ? (
                            <span
                                className={
                                    change.previous !== null &&
                                    change.previous !== change.next
                                        ? 'truncate font-medium text-emerald-800 dark:text-emerald-300'
                                        : 'truncate text-foreground'
                                }
                                title={change.next}
                            >
                                {change.next}
                            </span>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}
