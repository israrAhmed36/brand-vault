import {
    ExternalLink,
    FolderInput,
    MoreHorizontal,
    Pencil,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { AssetCardProps } from '@/types/asset';

type AssetActionsProps = AssetCardProps & {
    overlay?: boolean;
};

export function AssetActions({
    asset,
    showRestore = false,
    overlay = false,
    onEdit,
    onDelete,
    onMove,
    onRestore,
    onForceDelete,
}: AssetActionsProps) {
    const [confirmAction, setConfirmAction] = useState<'trash' | 'force'>(
        'trash',
    );
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const isForceDelete = confirmAction === 'force';

    function handleOpen() {
        window.open(asset.url, '_blank', 'noopener,noreferrer');
    }

    function handleConfirm() {
        if (isForceDelete) {
            onForceDelete?.(asset);
        } else {
            onDelete?.(asset);
        }

        setIsConfirmOpen(false);
    }

    function openConfirm(action: 'trash' | 'force') {
        setConfirmAction(action);
        setIsConfirmOpen(true);
    }

    return (
        <div data-no-dnd>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className={cn(
                            'size-8 shrink-0',
                            overlay
                                ? 'border border-border/70 bg-background/90 text-foreground shadow-sm backdrop-blur-md hover:bg-background'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Asset actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={handleOpen}>
                        <ExternalLink className="size-3.5" />
                        Open
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {showRestore ? (
                        <>
                            <DropdownMenuItem
                                onSelect={() => onRestore?.(asset)}
                            >
                                <RotateCcw className="size-3.5" />
                                Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => openConfirm('force')}
                            >
                                <Trash2 className="size-3.5" />
                                Delete forever
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onSelect={() => onEdit?.(asset)}>
                                <Pencil className="size-3.5" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onMove?.(asset)}>
                                <FolderInput className="size-3.5" />
                                Move
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => openConfirm('trash')}
                            >
                                <Trash2 className="size-3.5" />
                                Move to trash
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={isConfirmOpen}
                title={isForceDelete ? 'Delete forever?' : 'Move to trash?'}
                description={
                    <>
                        <span className="font-medium text-foreground">
                            {asset.name}
                        </span>{' '}
                        {isForceDelete
                            ? 'will be permanently deleted. This cannot be undone.'
                            : 'will move to trash. You can restore it later.'}
                    </>
                }
                confirmLabel={
                    isForceDelete ? 'Delete forever' : 'Move to trash'
                }
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
