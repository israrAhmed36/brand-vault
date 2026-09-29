import type { ActivityAction, ActivityModule } from '@/types/activity-log';
import { Badge } from '@/components/ui/badge';
import {
    formatActivityAction,
    formatActivityModule,
} from '@/lib/activity-log-display';
import { cn } from '@/lib/utils';

const moduleClassName: Record<ActivityModule, string> = {
    brand: 'border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200',
    folder: 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200',
    asset: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
};

const actionClassName: Record<ActivityAction, string> = {
    created:
        'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
    updated:
        'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-200',
    deleted:
        'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-200',
    moved: 'border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-200',
    trashed:
        'border-orange-500/30 bg-orange-500/10 text-orange-900 dark:text-orange-200',
    restored:
        'border-teal-500/30 bg-teal-500/10 text-teal-900 dark:text-teal-200',
    force_deleted:
        'border-rose-600/40 bg-rose-600/15 text-rose-900 dark:text-rose-100',
};

type ActivityModuleBadgeProps = {
    module: ActivityModule;
};

type ActivityActionBadgeProps = {
    action: ActivityAction;
};

export function ActivityModuleBadge({ module }: ActivityModuleBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn('capitalize', moduleClassName[module])}
        >
            {formatActivityModule(module)}
        </Badge>
    );
}

export function ActivityActionBadge({ action }: ActivityActionBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn('capitalize', actionClassName[action])}
        >
            {formatActivityAction(action)}
        </Badge>
    );
}
