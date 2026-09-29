import { Link } from '@inertiajs/react';
import { ArrowRight, FileBox } from 'lucide-react';
import { AssetTypeBadge } from '@/components/assets/asset-type-badge';
import { Button } from '@/components/ui/button';
import { formatActivityDateTime } from '@/lib/activity-log-display';
import type { DashboardRecentAssetsProps } from '@/types/dashboard';

export function DashboardRecentAssets({ assets }: DashboardRecentAssetsProps) {
    return (
        <section className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div className="space-y-0.5">
                    <h2 className="text-sm font-semibold tracking-tight">
                        Recent assets
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Latest updates in your library
                    </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/assets">
                        View all
                        <ArrowRight className="size-3.5" />
                    </Link>
                </Button>
            </header>

            {assets.length === 0 ? (
                <div className="flex flex-1 flex-col items-start justify-center gap-3 p-5">
                    <span className="rounded-lg border border-border bg-muted/60 p-2 text-muted-foreground">
                        <FileBox className="size-4" />
                    </span>
                    <p className="text-sm text-muted-foreground">
                        No assets yet. Add your first file from the library.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/assets">Open library</Link>
                    </Button>
                </div>
            ) : (
                <ul className="divide-y divide-border">
                    {assets.map((asset) => (
                        <li
                            key={asset.id}
                            className="flex items-center justify-between gap-3 px-5 py-3"
                        >
                            <div className="min-w-0 space-y-1">
                                <p className="truncate text-sm font-medium">
                                    {asset.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatActivityDateTime(asset.updated_at)}
                                </p>
                            </div>
                            <AssetTypeBadge type={asset.type} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
