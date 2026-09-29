import { RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { TrashSelectionCheckbox } from '@/components/assets/trash-selection-checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { TrashBulkToolbarProps } from '@/types/trash-selection';

export function TrashBulkToolbar({
    selectedCount,
    isAllSelected,
    isIndeterminate,
    onSelectAllChange,
    onRestore,
    onForceDelete,
}: TrashBulkToolbarProps) {
    const [isForceConfirmOpen, setIsForceConfirmOpen] = useState(false);
    const hasSelection = selectedCount > 0;
    const selectAllChecked = isIndeterminate ? 'indeterminate' : isAllSelected;

    function handleForceConfirm() {
        onForceDelete();
        setIsForceConfirmOpen(false);
    }

    return (
        <>
            <div className="flex flex-col gap-3 border-b border-border/80 bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                    <TrashSelectionCheckbox
                        id="trash-select-all"
                        checked={selectAllChecked}
                        onCheckedChange={onSelectAllChange}
                        ariaLabel="Select all trash items"
                    />
                    <Label
                        htmlFor="trash-select-all"
                        className="cursor-pointer text-sm font-medium"
                    >
                        Select all
                    </Label>
                    {hasSelection ? (
                        <span className="text-xs text-muted-foreground tabular-nums">
                            {selectedCount} selected
                        </span>
                    ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={!hasSelection}
                        onClick={onRestore}
                    >
                        <RotateCcw className="size-3.5" />
                        Restore selected
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={!hasSelection}
                        onClick={() => setIsForceConfirmOpen(true)}
                    >
                        <Trash2 className="size-3.5" />
                        Delete forever
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={isForceConfirmOpen}
                title="Delete selected forever?"
                description={
                    <>
                        <span className="font-medium text-foreground">
                            {selectedCount}{' '}
                            {selectedCount === 1 ? 'asset' : 'assets'}
                        </span>{' '}
                        will be permanently deleted. This cannot be undone.
                    </>
                }
                confirmLabel="Delete forever"
                onOpenChange={setIsForceConfirmOpen}
                onConfirm={handleForceConfirm}
            />
        </>
    );
}
