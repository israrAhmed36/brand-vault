import { Link } from '@inertiajs/react';
import {
    FolderOpen,
    ScrollText,
    Sparkles,
    SwatchBook,
    type LucideIcon,
} from 'lucide-react';
import type { DashboardQuickActionsProps } from '@/types/dashboard';

type QuickAction = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
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
        },
        {
            title: assetCount > 0 ? 'Browse assets' : 'Add first asset',
            description: 'Organize files into folders',
            href: '/assets',
            icon: FolderOpen,
        },
        {
            title: 'Review activity',
            description: 'Audit recent workspace changes',
            href: '/activity-logs',
            icon: ScrollText,
        },
        {
            title: 'AI tagging',
            description: 'Generate tags from the asset library',
            href: '/assets',
            icon: Sparkles,
        },
    ];

    return (
        <section className="rounded-xl border border-border bg-gradient-to-br from-muted/50 via-background to-background p-5 shadow-sm">
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
                        className="flex items-start gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-card"
                    >
                        <span className="rounded-md border border-border bg-card p-2 text-muted-foreground">
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
