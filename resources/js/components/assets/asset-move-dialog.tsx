import { useEffect, useState } from 'react';
import { AssetMoveFolderList } from '@/components/assets/asset-move-folder-list';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { moveAssetToFolder } from '@/lib/move-asset';
import type { AssetMoveDialogProps } from '@/types/asset';

export function AssetMoveDialog({
    open,
    asset,
    folderOptions,
    onOpenChange,
}: AssetMoveDialogProps) {
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
        null,
    );
    const [isMoving, setIsMoving] = useState(false);
    const currentFolderId = asset?.folder_id ?? null;
    const canConfirm = selectedFolderId !== currentFolderId && !isMoving;

    useEffect(() => {
        if (open) {
            setSelectedFolderId(asset?.folder_id ?? null);
            setIsMoving(false);
        }
    }, [open, asset]);

    async function handleConfirm() {
        if (!asset || !canConfirm) {
            return;
        }

        setIsMoving(true);
        const didMove = await moveAssetToFolder(asset.id, selectedFolderId);
        setIsMoving(false);

        if (didMove) {
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Move asset</DialogTitle>
                    <DialogDescription>
                        {asset
                            ? `Choose a folder for “${asset.name}”.`
                            : 'Choose a destination folder.'}
                    </DialogDescription>
                </DialogHeader>

                <AssetMoveFolderList
                    options={folderOptions}
                    selectedFolderId={selectedFolderId}
                    currentFolderId={currentFolderId}
                    onSelect={setSelectedFolderId}
                />

                <DialogFooter className="gap-2 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={!canConfirm}
                        onClick={() => void handleConfirm()}
                    >
                        {isMoving ? <Spinner /> : null}
                        Move here
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
