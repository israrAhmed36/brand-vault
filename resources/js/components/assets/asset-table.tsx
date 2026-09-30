import { ImagePlus } from 'lucide-react';
import { AssetTypeSection } from '@/components/assets/asset-type-section';
import { TrashBulkToolbar } from '@/components/assets/trash-bulk-toolbar';
import { Spinner } from '@/components/ui/spinner';
import { assetCountLabel, groupAssetsByType } from '@/lib/asset-display';
import { cn } from '@/lib/utils';
import type { AssetTableProps } from '@/types/asset';

export function AssetTable({
    assets,
    isLoading = false,
    showRestore = false,
    searchQuery = null,
    onEdit,
    onDelete,
    onMove,
    onGenerateTags,
    onRestore,
    onForceDelete,
    trashSelection,
    onBulkRestoreSelected,
    onBulkForceDeleteSelected,
}: AssetTableProps) {
    const activeSearch = searchQuery?.trim() ?? '';
    const assetGroups = groupAssetsByType(assets);

    return (
        <section className="flex h-full min-h-80 flex-col overflow-hidden rounded-lg border border-border bg-muted/25">
            <div className="flex items-center justify-between border-b border-border/80 bg-card/80 px-4 py-3 backdrop-blur-sm">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Assets
                </h2>
                {isLoading ? (
                    <Spinner className="size-4 text-muted-foreground" />
                ) : (
                    <p className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                        {assetCountLabel(assets.length)}
                    </p>
                )}
            </div>

            {trashSelection &&
            onBulkRestoreSelected &&
            onBulkForceDeleteSelected &&
            assets.length > 0 ? (
                <TrashBulkToolbar
                    selectedCount={trashSelection.selectedCount}
                    isAllSelected={trashSelection.isAllSelected}
                    isIndeterminate={trashSelection.isIndeterminate}
                    onSelectAllChange={(selectAll) => {
                        if (selectAll) {
                            trashSelection.selectAll();
                        } else {
                            trashSelection.clearSelection();
                        }
                    }}
                    onRestore={onBulkRestoreSelected}
                    onForceDelete={onBulkForceDeleteSelected}
                />
            ) : null}

            <div
                className={cn(
                    'flex-1 p-4 transition-opacity duration-150 md:p-5',
                    isLoading && 'opacity-55',
                )}
                aria-busy={isLoading}
            >
                {assets.length === 0 ? (
                    <AssetEmptyState
                        showRestore={showRestore}
                        searchQuery={activeSearch}
                    />
                ) : (
                    <div className="space-y-8">
                        {assetGroups.map((group) => (
                            <AssetTypeSection
                                key={group.type}
                                type={group.type}
                                assets={group.assets}
                                showRestore={showRestore}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onMove={onMove}
                                onGenerateTags={onGenerateTags}
                                onRestore={onRestore}
                                onForceDelete={onForceDelete}
                                trashSelection={trashSelection}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function AssetEmptyState({
    showRestore,
    searchQuery = '',
}: Pick<AssetTableProps, 'showRestore'> & { searchQuery?: string }) {
    const hasSearch = searchQuery !== '';

    return (
        <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ImagePlus className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
                {hasSearch
                    ? `No results for “${searchQuery}”`
                    : showRestore
                      ? 'Trash is empty'
                      : 'No assets in this folder'}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {hasSearch
                    ? 'Try a different name, clear search, or change the date.'
                    : showRestore
                      ? 'Deleted assets will appear here until you restore or remove them.'
                      : 'Add a file or link. It will show up here as a card.'}
            </p>
        </div>
    );
}
