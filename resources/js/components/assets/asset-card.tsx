import { useState, type DragEvent } from 'react';
import { AssetActions } from '@/components/assets/asset-actions';
import { AssetPreview } from '@/components/assets/asset-preview';
import { AssetTypeBadge } from '@/components/assets/asset-type-badge';
import { TrashSelectionCheckbox } from '@/components/assets/trash-selection-checkbox';
import { setAssetDragData } from '@/lib/asset-drag';
import { formatAssetDate } from '@/lib/asset-display';
import { cn } from '@/lib/utils';
import type { AssetCardProps } from '@/types/asset';

export function AssetCard(props: AssetCardProps) {
    const { asset, showRestore = false, trashSelection } = props;
    const [isDragging, setIsDragging] = useState(false);
    const updatedLabel = formatAssetDate(asset.updated_at);
    const canDrag = !showRestore;
    const showSelection = showRestore && trashSelection !== undefined;
    const isSelected = trashSelection?.isSelected(asset.id) ?? false;

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
                'group relative overflow-hidden rounded-md border border-border/80 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition duration-200',
                canDrag &&
                    'cursor-grab hover:-translate-y-0.5 hover:border-border hover:shadow-[0_12px_28px_-16px_rgba(15,23,42,0.28)] active:cursor-grabbing',
                isDragging && 'scale-[0.98] opacity-60',
                isSelected &&
                    'border-primary bg-primary/5 ring-1 ring-primary/25',
            )}
        >
            <div className="relative">
                <AssetPreview asset={asset} />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                    {!showSelection ? (
                        <AssetTypeBadge type={asset.type} overlay />
                    ) : (
                        <span className="rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
                            {asset.type}
                        </span>
                    )}
                    <AssetActions {...props} overlay />
                </div>
            </div>
            <div
                className={cn(
                    'flex items-start gap-2.5 border-t border-border/70 px-3 py-3',
                )}
                data-no-dnd
            >
                {showSelection ? (
                    <div className="pt-0.5" data-no-dnd>
                        <TrashSelectionCheckbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                trashSelection?.toggle(asset.id);
                            }}
                            ariaLabel={`Select ${asset.name}`}
                        />
                    </div>
                ) : null}
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
                        {asset.name}
                    </h3>
                    {asset.tags && asset.tags.length > 0 ? (
                        <p className="mt-1 flex flex-wrap gap-1">
                            {asset.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </p>
                    ) : updatedLabel ? (
                        <p className="truncate text-xs text-muted-foreground">
                            Updated {updatedLabel}
                        </p>
                    ) : null}
                </div>
            </div>
        </article>
    );
}
