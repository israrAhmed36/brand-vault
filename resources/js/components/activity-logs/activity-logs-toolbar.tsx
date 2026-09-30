import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ActivityFilterOption } from '@/types/activity-log';

type ActivityLogsToolbarProps = {
    search: string;
    module: string;
    action: string;
    moduleOptions: ActivityFilterOption[];
    actionOptions: ActivityFilterOption[];
    total: number;
    onSearchChange: (value: string) => void;
    onModuleChange: (value: string) => void;
    onActionChange: (value: string) => void;
};

export function ActivityLogsToolbar({
    search,
    module,
    action,
    moduleOptions,
    actionOptions,
    total,
    onSearchChange,
    onModuleChange,
    onActionChange,
}: ActivityLogsToolbarProps) {
    return (
        <div className="shrink-0 space-y-3 border-b border-border/80 bg-card/70 px-4 py-4 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                        Activity log
                    </h1>
                    <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
                        Audit trail of brand, folder, and asset changes.
                    </p>
                </div>
                <p className="shrink-0 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground tabular-nums">
                    {total} {total === 1 ? 'event' : 'events'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center">
                <Input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search…"
                    className="col-span-2 md:w-64"
                />
                <Select
                    value={module || 'all'}
                    onValueChange={(value) =>
                        onModuleChange(value === 'all' ? '' : value)
                    }
                >
                    <SelectTrigger className="w-full md:w-36">
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All modules</SelectItem>
                        {moduleOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={action || 'all'}
                    onValueChange={(value) =>
                        onActionChange(value === 'all' ? '' : value)
                    }
                >
                    <SelectTrigger className="w-full md:w-40">
                        <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All actions</SelectItem>
                        {actionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
