import { Link } from '@inertiajs/react';
import {
    FolderOpen,
    FolderTree,
    Sparkles,
    Trash2,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
    DashboardStatCardItem,
    DashboardStatCardsProps,
} from '@/types/dashboard';

const STAT_ITEMS: Array<
    Omit<DashboardStatCardItem, 'value'> & {
        tone: string;
        iconTone: string;
    }
> = [
    {
        key: 'assets',
        label: 'Assets',
        hint: 'Active in your library',
        href: '/assets',
        icon: 'assets',
        tone: 'from-sky-500/12 via-card to-card',
        iconTone:
            'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    },
    {
        key: 'folders',
        label: 'Folders',
        hint: 'Organization depth ≤ 2',
        href: '/assets',
        icon: 'folders',
        tone: 'from-emerald-500/12 via-card to-card',
        iconTone:
            'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    {
        key: 'trash',
        label: 'In trash',
        hint: 'Soft-deleted assets',
        href: '/trash',
        icon: 'trash',
        tone: 'from-rose-500/12 via-card to-card',
        iconTone:
            'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    },
    {
        key: 'untagged',
        label: 'Untagged',
        hint: 'Ready for AI tagging',
        href: '/assets',
        icon: 'untagged',
        tone: 'from-amber-500/12 via-card to-card',
        iconTone:
            'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
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
                        className={cn(
                            'group rounded-xl border border-border/80 bg-gradient-to-br p-4 shadow-sm transition duration-200',
                            'hover:-translate-y-0.5 hover:border-border hover:shadow-md',
                            item.tone,
                        )}
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
                            <span
                                className={cn(
                                    'rounded-lg border p-2 shadow-xs transition-transform group-hover:scale-105',
                                    item.iconTone,
                                )}
                            >
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
