import { Link } from '@inertiajs/react';
import {
    FolderOpen,
    FolderTree,
    Sparkles,
    Trash2,
    type LucideIcon,
} from 'lucide-react';
import type {
    DashboardStatCardItem,
    DashboardStatCardsProps,
} from '@/types/dashboard';

const STAT_ITEMS: Omit<DashboardStatCardItem, 'value'>[] = [
    {
        key: 'assets',
        label: 'Assets',
        hint: 'Active in your library',
        href: '/assets',
        icon: 'assets',
    },
    {
        key: 'folders',
        label: 'Folders',
        hint: 'Organization depth ≤ 2',
        href: '/assets',
        icon: 'folders',
    },
    {
        key: 'trash',
        label: 'In trash',
        hint: 'Soft-deleted assets',
        href: '/trash',
        icon: 'trash',
    },
    {
        key: 'untagged',
        label: 'Untagged',
        hint: 'Ready for AI tagging',
        href: '/assets',
        icon: 'untagged',
    },
];

const ICONS: Record<DashboardStatCardItem['icon'], LucideIcon> = {
    assets: FolderOpen,
    folders: FolderTree,
    trash: Trash2,
    untagged: Sparkles,
};

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {STAT_ITEMS.map((item) => {
                const Icon = ICONS[item.icon];

                return (
                    <Link
                        key={item.key}
                        href={item.href}
                        className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-foreground/15 hover:bg-muted/40"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    {item.label}
                                </p>
                                <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                                    {stats[item.key]}
                                </p>
                            </div>
                            <span className="rounded-lg border border-border bg-muted/60 p-2 text-muted-foreground transition-colors group-hover:text-foreground">
                                <Icon className="size-4" />
                            </span>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            {item.hint}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
}
