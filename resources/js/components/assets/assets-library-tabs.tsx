import { router, usePage } from '@inertiajs/react';
import { FolderOpen, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
    AssetsIndexPageProps,
    AssetsLibraryTab,
    AssetsLibraryTabsProps,
} from '@/types/asset';

const TABS: Array<{
    value: AssetsLibraryTab;
    label: string;
    href: string;
    icon: typeof FolderOpen;
}> = [
    { value: 'assets', label: 'Assets', href: '/assets', icon: FolderOpen },
    { value: 'trash', label: 'Trash', href: '/trash', icon: Trash2 },
];

export function AssetsLibraryTabs({ active }: AssetsLibraryTabsProps) {
    const { counts } = usePage<Pick<AssetsIndexPageProps, 'counts'>>().props;

    return (
        <div
            role="tablist"
            aria-label="Library views"
            className="inline-flex rounded-xl border border-border bg-muted/50 p-1"
        >
            {TABS.map(({ value, label, href, icon: Icon }) => {
                const isActive = active === value;

                return (
                    <button
                        key={value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all',
                            isActive
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                        onClick={() => {
                            if (!isActive) {
                                router.visit(href, { preserveScroll: true });
                            }
                        }}
                    >
                        <Icon className="size-3.5" />
                        {label}
                        <span
                            className={cn(
                                'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted-foreground/15 text-muted-foreground',
                            )}
                        >
                            {counts[value] > 99 ? '99+' : counts[value]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
