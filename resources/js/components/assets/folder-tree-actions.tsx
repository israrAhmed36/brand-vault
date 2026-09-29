import { FolderPlus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
    const canAddChild =
        canNestUnderFolder(folder.depth) && onCreateChild !== undefined;

    return (
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
                    <DropdownMenuItem onClick={() => onCreateChild(folder)}>
                        <FolderPlus className="size-3.5" />
                        New subfolder
                    </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onClick={() => onRename(folder)}>
                    <Pencil className="size-3.5" />
                    Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(folder)}
                >
                    <Trash2 className="size-3.5" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
