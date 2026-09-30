import { Link } from '@inertiajs/react';
import {
    FolderOpen,
    ScrollText,
    Sparkles,
    SwatchBook,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DashboardQuickActionsProps } from '@/types/dashboard';

type QuickAction = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    iconTone: string;
};

export function DashboardQuickActions({
    hasBrand,
    assetCount,
}: DashboardQuickActionsProps) {
    const actions: QuickAction[] = [
        {
            title: hasBrand ? 'Edit brand kit' : 'Create brand kit',
            description: hasBrand
                ? 'Update colors, logo, and font'
                : 'Establish your workspace identity',
            href: '/brand',
            icon: SwatchBook,
            iconTone:
                'border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
        },
        {
            title: assetCount > 0 ? 'Browse assets' : 'Add first asset',
            description: 'Organize files into folders',
            href: '/assets',
            icon: FolderOpen,
            iconTone:
                'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300',
        },
        {
            title: 'Review activity',
            description: 'Audit recent workspace changes',
            href: '/activity-logs',
            icon: ScrollText,
            iconTone:
                'border-teal-500/20 bg-teal-500/10 text-teal-700 dark:text-teal-300',
        },
        {
            title: 'AI tagging',
            description: 'Generate tags from the asset library',
            href: '/assets',
            icon: Sparkles,
            iconTone:
                'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
        },
    ];

    return (
        <section className="rounded-xl border border-border/80 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm">
            <header className="mb-4 space-y-1">
                <h2 className="text-sm font-semibold tracking-tight">
                    Quick actions
                </h2>
                <p className="text-xs text-muted-foreground">
                    Jump into the most common BrandVault workflows
                </p>
            </header>
            <div className="grid gap-2 sm:grid-cols-2">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/70 p-3 shadow-xs transition duration-200 hover:border-border hover:bg-card hover:shadow-sm"
                    >
                        <span
                            className={cn(
                                'rounded-md border p-2 shadow-xs',
                                action.iconTone,
                            )}
                        >
                            <action.icon className="size-4" />
                        </span>
                        <span className="min-w-0 space-y-0.5">
                            <span className="block text-sm font-medium">
                                {action.title}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                                {action.description}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
