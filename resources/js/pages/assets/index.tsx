import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AssetFormSheet } from '@/components/assets/asset-form-sheet';
import { AssetMoveDialog } from '@/components/assets/asset-move-dialog';
import { AssetTable } from '@/components/assets/asset-table';
import { AssetsPageHeader } from '@/components/assets/assets-page-header';
import { AssetsPageShell } from '@/components/assets/assets-page-shell';
import { FolderFormSheet } from '@/components/assets/folder-form-sheet';
import { FolderTree } from '@/components/assets/folder-tree';
import { SearchSortBar } from '@/components/assets/search-sort-bar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssetsFiltering } from '@/hooks/use-assets-filtering';
import { useAssetsListQuery } from '@/hooks/use-assets-list-query';
import { useFolderSheet } from '@/hooks/use-folder-sheet';
import { deleteFolder, moveFolder, trashAsset } from '@/lib/asset-actions';
import { moveAssetToFolder } from '@/lib/move-asset';
import type { Asset, AssetsIndexPageProps } from '@/types/asset';

export default function AssetsIndex() {
    const {
        assets,
        folders,
        folderOptions,
        breadcrumbs,
        currentFolder,
        filters,
    } = usePage<AssetsIndexPageProps>().props;
    const { isLoading, error } = useAssetsFiltering();
    const folderSheet = useFolderSheet(folders);
    const listPath = currentFolder
        ? `/assets/folder/${currentFolder.id}`
        : '/assets';
    const { search, sort, setSearch, setSort } = useAssetsListQuery({
        listPath,
        filters,
        syncKey: currentFolder?.id ?? 'root',
    });
    const [assetSheetOpen, setAssetSheetOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [movingAsset, setMovingAsset] = useState<Asset | null>(null);

    async function handleAssetDrop(
        assetId: number,
        folderId: number | null,
    ): Promise<void> {
        const asset = assets.data.find((item) => item.id === assetId);

        if (!asset || asset.folder_id === folderId) {
            return;
        }

        await moveAssetToFolder(assetId, folderId);
    }

    return (
        <>
            <Head title="Assets" />
            <AssetsPageShell
                sidebar={
                    <FolderTree
                        folders={folders}
                        currentFolderId={currentFolder?.id ?? null}
                        onCreateParent={folderSheet.openCreateParent}
                        onCreateChild={folderSheet.openCreateChild}
                        onRename={folderSheet.openRename}
                        onDelete={deleteFolder}
                        onMove={moveFolder}
                        onAssetDrop={(assetId, folderId) => {
                            void handleAssetDrop(assetId, folderId);
                        }}
                    />
                }
            >
                <AssetsPageHeader
                    activeTab="assets"
                    breadcrumbs={breadcrumbs}
                    onAddAsset={() => {
                        setEditingAsset(null);
                        setAssetSheetOpen(true);
                    }}
                />

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
                    searchQuery={search}
                    onEdit={(asset) => {
                        setEditingAsset(asset);
                        setAssetSheetOpen(true);
                    }}
                    onMove={setMovingAsset}
                    onDelete={trashAsset}
                />
            </AssetsPageShell>

            <AssetFormSheet
                key={
                    editingAsset?.id ?? `create-${currentFolder?.id ?? 'root'}`
                }
                open={assetSheetOpen}
                asset={editingAsset}
                folderId={currentFolder?.id ?? null}
                folderOptions={folderOptions}
                onOpenChange={setAssetSheetOpen}
            />

            <AssetMoveDialog
                key={movingAsset?.id ?? 'move-closed'}
                open={movingAsset !== null}
                asset={movingAsset}
                folderOptions={folderOptions}
                onOpenChange={(open) => {
                    if (!open) {
                        setMovingAsset(null);
                    }
                }}
            />

            <FolderFormSheet
                key={
                    folderSheet.editingFolder?.id ??
                    `create-under-${folderSheet.createParentId ?? 'root'}`
                }
                open={folderSheet.open}
                parentId={folderSheet.createParentId}
                parentName={folderSheet.createParentName}
                folder={folderSheet.editingFolder}
                onOpenChange={folderSheet.setOpen}
            />
        </>
    );
}

AssetsIndex.layout = {
    breadcrumbs: [{ title: 'Assets', href: '/assets' }],
};
