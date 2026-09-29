import {
    ExternalLink,
    FolderInput,
    MoreHorizontal,
    Pencil,
    RotateCcw,
    Sparkles,
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
    onGenerateTags,
    onRestore,
    onForceDelete,
}: AssetActionsProps) {
    const [confirmAction, setConfirmAction] = useState<'trash' | 'force'>(
        'trash',
    );
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const isForceDelete = confirmAction === 'force';

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
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onSelect={() =>
                            window.open(
                                asset.url,
                                '_blank',
                                'noopener,noreferrer',
                            )
                        }
                    >
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
                                onSelect={() => {
                                    setConfirmAction('force');
                                    setIsConfirmOpen(true);
                                }}
                            >
                                <Trash2 className="size-3.5" />
                                Delete forever
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem
                                onSelect={() => onGenerateTags?.(asset)}
                            >
                                <Sparkles className="size-3.5" />
                                Generate tags
                            </DropdownMenuItem>
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
                                onSelect={() => {
                                    setConfirmAction('trash');
                                    setIsConfirmOpen(true);
                                }}
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
                            ? 'will be permanently deleted.'
                            : 'will move to trash.'}
                    </>
                }
                confirmLabel={
                    isForceDelete ? 'Delete forever' : 'Move to trash'
                }
                onOpenChange={setIsConfirmOpen}
                onConfirm={() => {
                    if (isForceDelete) {
                        onForceDelete?.(asset);
                    } else {
                        onDelete?.(asset);
                    }
                    setIsConfirmOpen(false);
                }}
            />
        </div>
    );
}
