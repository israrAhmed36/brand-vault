import { AssetAiTagsDialog } from '@/components/assets/asset-ai-tags-dialog';
import { AssetFormSheet } from '@/components/assets/asset-form-sheet';
import { AssetMoveDialog } from '@/components/assets/asset-move-dialog';
import { FolderFormSheet } from '@/components/assets/folder-form-sheet';
import type { AiTagSuggestionForm } from '@/types/ai-tagging';
import type { Asset, FolderOption } from '@/types/asset';
import type { Folder } from '@/types/folder';

type AssetsIndexDialogsProps = {
    assetSheetOpen: boolean;
    editingAsset: Asset | null;
    currentFolderId: number | null;
    folderOptions: FolderOption[];
    onAssetSheetOpenChange: (open: boolean) => void;
    movingAsset: Asset | null;
    onMovingAssetOpenChange: (open: boolean) => void;
    aiOpen: boolean;
    aiAssetName: string;
    aiIsGenerating: boolean;
    aiIsSaving: boolean;
    aiError: string | null;
    aiSuggestion: AiTagSuggestionForm | null;
    onAiOpenChange: (open: boolean) => void;
    onAiSuggestionChange: (suggestion: AiTagSuggestionForm) => void;
    onAiRegenerate: () => void;
    onAiSave: () => void;
    folderSheetOpen: boolean;
    createParentId: number | null;
    createParentName: string | null;
    editingFolder: Folder | null;
    onFolderSheetOpenChange: (open: boolean) => void;
};

export function AssetsIndexDialogs(props: AssetsIndexDialogsProps) {
    return (
        <>
            <AssetFormSheet
                key={
                    props.editingAsset?.id ??
                    `create-${props.currentFolderId ?? 'root'}`
                }
                open={props.assetSheetOpen}
                asset={props.editingAsset}
                folderId={props.currentFolderId}
                folderOptions={props.folderOptions}
                onOpenChange={props.onAssetSheetOpenChange}
            />
            <AssetMoveDialog
                key={props.movingAsset?.id ?? 'move-closed'}
                open={props.movingAsset !== null}
                asset={props.movingAsset}
                folderOptions={props.folderOptions}
                onOpenChange={props.onMovingAssetOpenChange}
            />
            <AssetAiTagsDialog
                open={props.aiOpen}
                assetName={props.aiAssetName}
                isGenerating={props.aiIsGenerating}
                isSaving={props.aiIsSaving}
                error={props.aiError}
                suggestion={props.aiSuggestion}
                onOpenChange={props.onAiOpenChange}
                onSuggestionChange={props.onAiSuggestionChange}
                onRegenerate={props.onAiRegenerate}
                onSave={props.onAiSave}
            />
            <FolderFormSheet
                key={
                    props.editingFolder?.id ??
                    `create-under-${props.createParentId ?? 'root'}`
                }
                open={props.folderSheetOpen}
                parentId={props.createParentId}
                parentName={props.createParentName}
                folder={props.editingFolder}
                onOpenChange={props.onFolderSheetOpenChange}
            />
        </>
    );
}
