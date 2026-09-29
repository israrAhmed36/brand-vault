import { useEffect, useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BrandDeleteDialogProps } from '@/types/brand';

export function BrandDeleteDialog({
    brandName,
    open,
    isDeleting,
    onOpenChange,
    onConfirm,
}: BrandDeleteDialogProps) {
    const [confirmation, setConfirmation] = useState('');
    const canDelete = confirmation === brandName;

    useEffect(() => {
        if (!open) {
            setConfirmation('');
        }
    }, [open]);

    return (
        <ConfirmDialog
            open={open}
            title="Remove brand kit?"
            description={
                <>
                    This permanently deletes your workspace brand kit. Type{' '}
                    <span className="font-medium text-foreground">
                        {brandName}
                    </span>{' '}
                    to confirm.
                </>
            }
            confirmLabel="Remove kit"
            pendingLabel="Removing…"
            isPending={isDeleting}
            confirmDisabled={!canDelete}
            onOpenChange={onOpenChange}
            onConfirm={onConfirm}
        >
            <div className="grid gap-2">
                <Label htmlFor="brand-delete-confirmation">Brand name</Label>
                <Input
                    id="brand-delete-confirmation"
                    value={confirmation}
                    autoComplete="off"
                    autoFocus
                    placeholder={brandName}
                    disabled={isDeleting}
                    onChange={(event) => setConfirmation(event.target.value)}
                />
            </div>
        </ConfirmDialog>
    );
}
