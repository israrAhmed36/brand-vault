import { Head, usePage } from '@inertiajs/react';
import { AssetTable } from '@/components/assets/asset-table';
import { AssetsPageHeader } from '@/components/assets/assets-page-header';
import { AssetsPageShell } from '@/components/assets/assets-page-shell';
import { SearchSortBar } from '@/components/assets/search-sort-bar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssetsFiltering } from '@/hooks/use-assets-filtering';
import { useAssetsListQuery } from '@/hooks/use-assets-list-query';
import { useTrashAssetSelection } from '@/hooks/use-trash-asset-selection';
import {
    bulkForceDeleteAssets,
    bulkRestoreAssets,
    forceDeleteAsset,
    restoreAsset,
} from '@/lib/asset-actions';
import type { AssetsTrashPageProps } from '@/types/asset';

export default function AssetsTrash() {
    const { assets, filters } = usePage<AssetsTrashPageProps>().props;
    const { isLoading, error } = useAssetsFiltering();
    const trashSelection = useTrashAssetSelection(assets.data);
    const { search, sort, addedOn, setSearch, setSort, setAddedOn } =
        useAssetsListQuery({
            listPath: '/trash',
            filters,
            syncKey: 'trash',
        });

    function handleBulkRestore() {
        bulkRestoreAssets([...trashSelection.selectedIds], () => {
            trashSelection.clearSelection();
        });
    }

    function handleBulkForceDelete() {
        bulkForceDeleteAssets([...trashSelection.selectedIds], () => {
            trashSelection.clearSelection();
        });
    }

    return (
        <>
            <Head title="Trash" />
            <AssetsPageShell>
                <AssetsPageHeader activeTab="trash" />

                {error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : null}

                <SearchSortBar
                    search={search}
                    sort={sort}
                    addedOn={addedOn}
                    onSearchChange={setSearch}
                    onSortChange={setSort}
                    onAddedOnChange={setAddedOn}
                />

                <AssetTable
                    assets={assets.data}
                    isLoading={isLoading}
                    showRestore
                    searchQuery={search}
                    trashSelection={trashSelection}
                    onBulkRestoreSelected={handleBulkRestore}
                    onBulkForceDeleteSelected={handleBulkForceDelete}
                    onRestore={restoreAsset}
                    onForceDelete={forceDeleteAsset}
                />
            </AssetsPageShell>
        </>
    );
}

AssetsTrash.layout = {
    breadcrumbs: [
        { title: 'Assets', href: '/assets' },
        { title: 'Trash', href: '/trash' },
    ],
};
