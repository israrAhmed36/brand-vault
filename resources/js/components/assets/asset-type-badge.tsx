import { cn } from '@/lib/utils';
import type { AssetType, AssetTypeBadgeProps } from '@/types/asset';

const TYPE_STYLES: Record<AssetType, string> = {
    image: 'bg-secondary text-secondary-foreground',
    video: 'bg-chart-2/15 text-chart-2',
    document: 'bg-chart-4/20 text-chart-5',
    link: 'bg-primary/10 text-primary',
    other: 'bg-muted text-muted-foreground',
};

export function AssetTypeBadge({ type, overlay = false }: AssetTypeBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
                TYPE_STYLES[type],
                overlay &&
                    'border border-white/40 bg-background/85 text-foreground shadow-sm backdrop-blur-md',
            )}
        >
            {type}
        </span>
    );
}
