import { Head, usePage } from '@inertiajs/react';
import { AssetTable } from '@/components/assets/asset-table';
import { AssetsPageHeader } from '@/components/assets/assets-page-header';
import { AssetsPageShell } from '@/components/assets/assets-page-shell';
import { SearchSortBar } from '@/components/assets/search-sort-bar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssetsFiltering } from '@/hooks/use-assets-filtering';
import { useAssetsListQuery } from '@/hooks/use-assets-list-query';
import { forceDeleteAsset, restoreAsset } from '@/lib/asset-actions';
import type { AssetsTrashPageProps } from '@/types/asset';

export default function AssetsTrash() {
    const { assets, filters } = usePage<AssetsTrashPageProps>().props;
    const { isLoading, error } = useAssetsFiltering();
    const { search, sort, setSearch, setSort } = useAssetsListQuery({
        listPath: '/trash',
        filters,
        syncKey: 'trash',
    });

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
                    onSearchChange={setSearch}
                    onSortChange={setSort}
                />

                <AssetTable
                    assets={assets.data}
                    isLoading={isLoading}
                    showRestore
                    searchQuery={search}
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
