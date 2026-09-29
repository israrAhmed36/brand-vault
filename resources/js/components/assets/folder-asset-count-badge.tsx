import { cn } from '@/lib/utils';
import type { FolderAssetCountBadgeProps } from '@/types/folder';

export function FolderAssetCountBadge({
    count = 0,
    className,
}: FolderAssetCountBadgeProps) {
    if (count < 1) {
        return null;
    }

    return (
        <span
            className={cn(
                'inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground tabular-nums',
                className,
            )}
            aria-label={`${count} assets`}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}
