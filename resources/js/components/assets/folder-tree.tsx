import { Link } from '@inertiajs/react';
import { FolderPlus, Library } from 'lucide-react';
import { useMemo, useState, type DragEvent } from 'react';
import { FolderTreeNodeRow } from '@/components/assets/folder-tree-node';
import { Button } from '@/components/ui/button';
import { isAssetDrag, readAssetDragId } from '@/lib/asset-drag';
import { assetIndexVisit } from '@/lib/asset-index-visit';
import { folderDepthLabel } from '@/lib/folder-depth';
import { buildFolderTree, canMoveFolder } from '@/lib/folder-tree';
import { cn } from '@/lib/utils';
import type { FolderTreeProps } from '@/types/folder';

export function FolderTree({
    folders,
    currentFolderId,
    onCreateParent,
    onCreateChild,
    onRename,
    onDelete,
    onMove,
    onAssetDrop,
}: FolderTreeProps) {
    const tree = useMemo(() => buildFolderTree(folders), [folders]);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [isRootOver, setIsRootOver] = useState(false);
    const canDropFolderOnRoot =
        draggingId !== null && canMoveFolder(folders, draggingId, null);

    function handleRootDragOver(event: DragEvent<HTMLDivElement>) {
        const acceptsAsset = isAssetDrag(event.dataTransfer) && !!onAssetDrop;

        if (!acceptsAsset && !canDropFolderOnRoot) {
            return;
        }

        event.preventDefault();
        setIsRootOver(true);
    }

    function handleRootDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsRootOver(false);

        const assetId = readAssetDragId(event.dataTransfer);

        if (assetId !== null && onAssetDrop) {
            onAssetDrop(assetId, null);
            setDraggingId(null);

            return;
        }

        if (draggingId !== null && canDropFolderOnRoot) {
            onMove(draggingId, null);
        }

        setDraggingId(null);
    }

    return (
        <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4 py-3">
                <h2 className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                    Folders
                </h2>
                <Button type="button" size="sm" onClick={onCreateParent}>
                    <FolderPlus className="size-3.5" />
                    Parent
                </Button>
            </div>

            <p className="shrink-0 px-4 pt-3 text-xs leading-relaxed text-muted-foreground">
                {folderDepthLabel()}. Drag assets onto a folder to move them.
            </p>

            <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
                <div
                    className={cn(
                        'flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent',
                        currentFolderId === null && 'bg-primary/10',
                        isRootOver && 'bg-accent ring-1 ring-primary/40',
                    )}
                    onDragOver={handleRootDragOver}
                    onDragLeave={() => setIsRootOver(false)}
                    onDrop={handleRootDrop}
                >
                    <Library className="size-3.5 text-primary" />
                    <Link
                        href="/assets"
                        className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
                        {...assetIndexVisit}
                    >
                        Library
                    </Link>
                </div>

                {tree.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                        No folders yet. Create a parent folder to get started.
                    </p>
                ) : (
                    <ul className="mt-0.5 flex flex-col gap-0.5">
                        {tree.map((node) => (
                            <FolderTreeNodeRow
                                key={node.id}
                                node={node}
                                folders={folders}
                                currentFolderId={currentFolderId}
                                draggingId={draggingId}
                                onRename={onRename}
                                onDelete={onDelete}
                                onCreateChild={onCreateChild}
                                onDragStart={setDraggingId}
                                onDragEnd={() => {
                                    setDraggingId(null);
                                    setIsRootOver(false);
                                }}
                                onDropOnFolder={(targetId) => {
                                    if (draggingId !== null) {
                                        onMove(draggingId, targetId);
                                    }

                                    setDraggingId(null);
                                }}
                                onAssetDrop={onAssetDrop}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
