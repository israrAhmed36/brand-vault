import { useState, type DragEvent } from 'react';
import { AssetActions } from '@/components/assets/asset-actions';
import { AssetPreview } from '@/components/assets/asset-preview';
import { AssetTypeBadge } from '@/components/assets/asset-type-badge';
import { setAssetDragData } from '@/lib/asset-drag';
import { formatAssetDate } from '@/lib/asset-display';
import { cn } from '@/lib/utils';
import type { AssetCardProps } from '@/types/asset';

export function AssetCard(props: AssetCardProps) {
    const { asset, showRestore = false } = props;
    const [isDragging, setIsDragging] = useState(false);
    const updatedLabel = formatAssetDate(asset.updated_at);
    const canDrag = !showRestore;

    function handleDragStart(event: DragEvent<HTMLElement>) {
        if (
            !canDrag ||
            (event.target as HTMLElement).closest('[data-no-dnd]')
        ) {
            event.preventDefault();

            return;
        }

        setAssetDragData(event.dataTransfer, asset.id);
        setIsDragging(true);
    }

    return (
        <article
            draggable={canDrag}
            onDragStart={handleDragStart}
            onDragEnd={() => setIsDragging(false)}
            className={cn(
                'group relative cursor-grab overflow-hidden rounded-md border border-border/80 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200 active:cursor-grabbing',
                isDragging
                    ? 'scale-[0.98] opacity-60'
                    : 'hover:-translate-y-0.5 hover:border-border hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,0.28)]',
                !canDrag && 'cursor-default',
            )}
        >
            <div className="relative">
                <AssetPreview asset={asset} />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                    <AssetTypeBadge type={asset.type} overlay />
                    <AssetActions {...props} overlay />
                </div>
            </div>
            <div className="space-y-0.5 border-t border-border/70 px-2.5 py-2">
                <h3 className="truncate text-xs font-semibold tracking-tight text-foreground">
                    {asset.name}
                </h3>
                {updatedLabel ? (
                    <p className="truncate text-[10px] text-muted-foreground">
                        Updated {updatedLabel}
                    </p>
                ) : null}
            </div>
        </article>
    );
}
