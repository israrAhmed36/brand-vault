import { FolderPlus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { canNestUnderFolder } from '@/lib/folder-depth';
import type { FolderTreeActionsProps } from '@/types/folder';

export function FolderTreeActions({
    folder,
    onRename,
    onDelete,
    onCreateChild,
}: FolderTreeActionsProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const canAddChild =
        canNestUnderFolder(folder.depth) && onCreateChild !== undefined;

    return (
        <div data-no-dnd>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-7 text-muted-foreground hover:text-foreground"
                    >
                        <MoreHorizontal className="size-3.5" />
                        <span className="sr-only">Folder actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {canAddChild ? (
                        <DropdownMenuItem
                            onSelect={() => onCreateChild(folder)}
                        >
                            <FolderPlus className="size-3.5" />
                            New subfolder
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onSelect={() => onRename(folder)}>
                        <Pencil className="size-3.5" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setIsConfirmOpen(true)}
                    >
                        <Trash2 className="size-3.5" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <ConfirmDialog
                open={isConfirmOpen}
                title="Delete folder?"
                description={
                    <>
                        <span className="font-medium text-foreground">
                            {folder.name}
                        </span>{' '}
                        will be permanently deleted. It must be empty first.
                    </>
                }
                confirmLabel="Delete folder"
                onOpenChange={setIsConfirmOpen}
                onConfirm={() => {
                    onDelete(folder);
                    setIsConfirmOpen(false);
                }}
            />
        </div>
    );
}
