import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { AssetTable } from '@/components/assets/asset-table';
import { AssetsIndexDialogs } from '@/components/assets/assets-index-dialogs';
import { AssetsPageHeader } from '@/components/assets/assets-page-header';
import { AssetsPageShell } from '@/components/assets/assets-page-shell';
import { FolderTree } from '@/components/assets/folder-tree';
import { SearchSortBar } from '@/components/assets/search-sort-bar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAssetAiTags } from '@/hooks/use-asset-ai-tags';
import { useAssetsFiltering } from '@/hooks/use-assets-filtering';
import { useAssetsListQuery } from '@/hooks/use-assets-list-query';
import { useFolderSheet } from '@/hooks/use-folder-sheet';
import { deleteFolder, moveFolder, trashAsset } from '@/lib/asset-actions';
import { moveAssetToFolder } from '@/lib/move-asset';
import type { Asset, AssetsIndexPageProps } from '@/types/asset';

export default function AssetsIndex() {
    const page = usePage<AssetsIndexPageProps>().props;
    const { isLoading, error } = useAssetsFiltering();
    const folderSheet = useFolderSheet(page.folders);
    const aiTags = useAssetAiTags();
    const listPath = page.currentFolder
        ? `/assets/folder/${page.currentFolder.id}`
        : '/assets';
    const { search, sort, addedOn, setSearch, setSort, setAddedOn } =
        useAssetsListQuery({
            listPath,
            filters: page.filters,
            syncKey: page.currentFolder?.id ?? 'root',
        });
    const [assetSheetOpen, setAssetSheetOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [movingAsset, setMovingAsset] = useState<Asset | null>(null);

    return (
        <>
            <Head title="Assets" />
            <AssetsPageShell
                sidebar={
                    <FolderTree
                        folders={page.folders}
                        currentFolderId={page.currentFolder?.id ?? null}
                        onCreateParent={folderSheet.openCreateParent}
                        onCreateChild={folderSheet.openCreateChild}
                        onRename={folderSheet.openRename}
                        onDelete={deleteFolder}
                        onMove={moveFolder}
                        onAssetDrop={(assetId, folderId) => {
                            const asset = page.assets.data.find(
                                (item) => item.id === assetId,
                            );
                            if (!asset || asset.folder_id === folderId) {
                                return;
                            }
                            void moveAssetToFolder(assetId, folderId);
                        }}
                    />
                }
            >
                <AssetsPageHeader
                    activeTab="assets"
                    breadcrumbs={page.breadcrumbs}
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
                    addedOn={addedOn}
                    onSearchChange={setSearch}
                    onSortChange={setSort}
                    onAddedOnChange={setAddedOn}
                />
                <AssetTable
                    assets={page.assets.data}
                    isLoading={isLoading}
                    searchQuery={search}
                    onEdit={(asset) => {
                        setEditingAsset(asset);
                        setAssetSheetOpen(true);
                    }}
                    onMove={setMovingAsset}
                    onGenerateTags={(asset) => {
                        void aiTags.openForAsset(asset);
                    }}
                    onDelete={trashAsset}
                />
            </AssetsPageShell>
            <AssetsIndexDialogs
                assetSheetOpen={assetSheetOpen}
                editingAsset={editingAsset}
                currentFolderId={page.currentFolder?.id ?? null}
                folderOptions={page.folderOptions}
                onAssetSheetOpenChange={setAssetSheetOpen}
                movingAsset={movingAsset}
                onMovingAssetOpenChange={(open) => {
                    if (!open) {
                        setMovingAsset(null);
                    }
                }}
                aiOpen={aiTags.open}
                aiAssetName={aiTags.asset?.name ?? ''}
                aiIsGenerating={aiTags.isGenerating}
                aiIsSaving={aiTags.isSaving}
                aiError={aiTags.error}
                aiSuggestion={aiTags.suggestion}
                onAiOpenChange={(open) => {
                    if (!open) {
                        aiTags.close();
                    }
                }}
                onAiSuggestionChange={aiTags.setSuggestion}
                onAiRegenerate={() => {
                    void aiTags.regenerate();
                }}
                onAiSave={() => {
                    void aiTags.save();
                }}
                folderSheetOpen={folderSheet.open}
                createParentId={folderSheet.createParentId}
                createParentName={folderSheet.createParentName}
                editingFolder={folderSheet.editingFolder}
                onFolderSheetOpenChange={folderSheet.setOpen}
            />
        </>
    );
}

AssetsIndex.layout = {
    breadcrumbs: [{ title: 'Assets', href: '/assets' }],
};
