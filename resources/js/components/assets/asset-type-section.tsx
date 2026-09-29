import { useMemo } from 'react';
import { AssetCard } from '@/components/assets/asset-card';
import { TrashSelectionCheckbox } from '@/components/assets/trash-selection-checkbox';
import {
    ASSET_TYPE_LABEL,
    ASSET_TYPE_VISUAL,
    assetCountLabel,
    assetGridClassName,
} from '@/lib/asset-display';
import { cn } from '@/lib/utils';
import type { AssetTypeSectionProps } from '@/types/asset';

export function AssetTypeSection({
    type,
    assets,
    showRestore = false,
    onEdit,
    onDelete,
    onMove,
    onGenerateTags,
    onRestore,
    onForceDelete,
    trashSelection,
}: AssetTypeSectionProps) {
    const visual = ASSET_TYPE_VISUAL[type];
    const Icon = visual.icon;
    const groupAssetIds = useMemo(
        () => assets.map((asset) => asset.id),
        [assets],
    );
    const showGroupSelection =
        showRestore && trashSelection !== undefined && assets.length > 0;
    const groupCheckboxState = showGroupSelection
        ? trashSelection.groupCheckboxState(groupAssetIds)
        : false;

    return (
        <section className="space-y-3" aria-labelledby={`asset-type-${type}`}>
            <header className="flex items-center gap-2.5 border-b border-border/70 pb-2.5">
                {showGroupSelection ? (
                    <TrashSelectionCheckbox
                        checked={groupCheckboxState}
                        onCheckedChange={(selected) => {
                            trashSelection.setGroupSelected(
                                groupAssetIds,
                                selected,
                            );
                        }}
                        ariaLabel={`Select all ${ASSET_TYPE_LABEL[type]} in trash`}
                        className="mt-1"
                    />
                ) : null}
                <span
                    className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-card shadow-sm',
                        visual.tileClassName,
                    )}
                >
                    <Icon className={cn('size-4', visual.iconClassName)} />
                </span>
                <div className="min-w-0 flex-1">
                    <h3
                        id={`asset-type-${type}`}
                        className="text-sm font-semibold tracking-tight text-foreground"
                    >
                        {ASSET_TYPE_LABEL[type]}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {assetCountLabel(assets.length)}
                    </p>
                </div>
            </header>
            <ul className={assetGridClassName}>
                {assets.map((asset) => (
                    <li key={asset.id}>
                        <AssetCard
                            asset={asset}
                            showRestore={showRestore}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onMove={onMove}
                            onGenerateTags={onGenerateTags}
                            onRestore={onRestore}
                            onForceDelete={onForceDelete}
                            trashSelection={trashSelection}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
