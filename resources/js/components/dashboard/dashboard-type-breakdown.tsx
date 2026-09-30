import { AssetTypeBadge } from '@/components/assets/asset-type-badge';
import { ASSET_TYPE_VISUAL } from '@/lib/asset-display';
import { cn } from '@/lib/utils';
import type { DashboardTypeBreakdownProps } from '@/types/dashboard';

const BAR_TONES: Record<string, string> = {
    image: 'bg-sky-500',
    video: 'bg-teal-500',
    document: 'bg-amber-500',
    link: 'bg-indigo-500',
    other: 'bg-slate-400',
};

export function DashboardTypeBreakdown({
    assetTypes,
    totalAssets,
}: DashboardTypeBreakdownProps) {
    return (
        <section className="flex h-full flex-col rounded-xl border border-border/80 bg-gradient-to-b from-muted/25 to-card p-5 shadow-sm">
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
                <ul className="flex flex-1 flex-col justify-center gap-3.5">
                    {assetTypes.map((item) => {
                        const percent =
                            totalAssets === 0
                                ? 0
                                : Math.round((item.count / totalAssets) * 100);
                        const visual = ASSET_TYPE_VISUAL[item.type];

                        return (
                            <li key={item.type} className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                'flex size-7 items-center justify-center rounded-md border border-border/50',
                                                visual.tileClassName,
                                            )}
                                        >
                                            <visual.icon
                                                className={cn(
                                                    'size-3.5',
                                                    visual.iconClassName,
                                                )}
                                            />
                                        </span>
                                        <AssetTypeBadge type={item.type} />
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                                        {item.count} · {percent}%
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted/80">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-[width] duration-500',
                                            BAR_TONES[item.type] ??
                                                'bg-foreground/60',
                                        )}
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
