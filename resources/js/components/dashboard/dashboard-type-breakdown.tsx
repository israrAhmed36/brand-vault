import { AssetTypeBadge } from '@/components/assets/asset-type-badge';
import type { DashboardTypeBreakdownProps } from '@/types/dashboard';

export function DashboardTypeBreakdown({
    assetTypes,
    totalAssets,
}: DashboardTypeBreakdownProps) {
    return (
        <section className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
            <header className="mb-4 space-y-1">
                <h2 className="text-sm font-semibold tracking-tight">
                    Asset mix
                </h2>
                <p className="text-xs text-muted-foreground">
                    Distribution by type across your library
                </p>
            </header>

            {totalAssets === 0 ? (
                <p className="my-auto text-sm text-muted-foreground">
                    Upload assets to see type breakdown here.
                </p>
            ) : (
                <ul className="flex flex-1 flex-col justify-center gap-3">
                    {assetTypes.map((item) => {
                        const percent =
                            totalAssets === 0
                                ? 0
                                : Math.round((item.count / totalAssets) * 100);

                        return (
                            <li key={item.type} className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <AssetTypeBadge type={item.type} />
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {item.count} · {percent}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-foreground/70 transition-[width] duration-500"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
