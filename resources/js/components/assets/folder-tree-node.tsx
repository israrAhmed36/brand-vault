import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Folder as FolderIcon,
    FolderOpen,
    GripVertical,
} from 'lucide-react';
import { useState, type DragEvent } from 'react';
import { FolderAssetCountBadge } from '@/components/assets/folder-asset-count-badge';
import { FolderTreeActions } from '@/components/assets/folder-tree-actions';
import { isAssetDrag, readAssetDragId } from '@/lib/asset-drag';
import { assetIndexVisit } from '@/lib/asset-index-visit';
import { canNestUnderFolder } from '@/lib/folder-depth';
import { canMoveFolder } from '@/lib/folder-tree';
import { cn } from '@/lib/utils';
import type { FolderTreeNodeRowProps } from '@/types/folder';

export function FolderTreeNodeRow(props: FolderTreeNodeRowProps) {
    const {
        node,
        folders,
        currentFolderId,
        draggingId,
        onRename,
        onDelete,
        onCreateChild,
        onDragStart,
        onDragEnd,
        onDropOnFolder,
        onAssetDrop,
    } = props;
    const [isOpen, setIsOpen] = useState(true);
    const [isOver, setIsOver] = useState(false);
    const hasChildren = node.children.length > 0;
    const isExpanded = hasChildren && isOpen;
    const FolderGlyph = isExpanded ? FolderOpen : FolderIcon;
    const canAcceptFolder =
        draggingId !== null && canMoveFolder(folders, draggingId, node.id);

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        if (
            !(isAssetDrag(event.dataTransfer) && onAssetDrop) &&
            !canAcceptFolder
        ) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        setIsOver(true);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsOver(false);
        const assetId = readAssetDragId(event.dataTransfer);
        if (assetId !== null && onAssetDrop) {
            onAssetDrop(assetId, node.id);
            return;
        }
        if (canAcceptFolder) {
            onDropOnFolder(node.id);
        }
    }

    return (
        <li>
            <div
                className={cn(
                    'group flex items-center gap-1 rounded-md py-1.5 pr-1.5 transition-colors hover:bg-accent',
                    currentFolderId === node.id &&
                        'bg-primary/10 text-primary hover:bg-primary/15',
                    isOver && 'bg-accent ring-1 ring-primary/40',
                )}
                style={{ paddingLeft: `${8 + node.depth * 14}px` }}
                draggable
                onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', String(node.id));
                    event.dataTransfer.effectAllowed = 'move';
                    onDragStart(node.id);
                }}
                onDragEnd={onDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsOver(false)}
                onDrop={handleDrop}
            >
                <GripVertical className="size-3.5 shrink-0 cursor-grab text-muted-foreground/70 active:cursor-grabbing" />
                {hasChildren ? (
                    <button
                        type="button"
                        className="rounded p-0.5 text-muted-foreground hover:bg-accent"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-label={isOpen ? 'Collapse' : 'Expand'}
                    >
                        <ChevronRight
                            className={cn(
                                'size-3.5 transition-transform',
                                isOpen && 'rotate-90',
                            )}
                        />
                    </button>
                ) : (
                    <span className="size-4 shrink-0" />
                )}
                <FolderGlyph
                    className={cn(
                        'size-3.5 shrink-0',
                        currentFolderId === node.id
                            ? 'text-primary'
                            : 'text-muted-foreground',
                    )}
                />
                <Link
                    href={`/assets/folder/${node.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
                    {...assetIndexVisit}
                >
                    {node.name}
                </Link>
                <FolderAssetCountBadge count={node.assets_count} />
                <FolderTreeActions
                    folder={node}
                    onRename={onRename}
                    onDelete={onDelete}
                    onCreateChild={
                        canNestUnderFolder(node.depth)
                            ? onCreateChild
                            : undefined
                    }
                />
            </div>
            {hasChildren && isOpen ? (
                <ul>
                    {node.children.map((child) => (
                        <FolderTreeNodeRow
                            key={child.id}
                            {...props}
                            node={child}
                        />
                    ))}
                </ul>
            ) : null}
        </li>
    );
}
