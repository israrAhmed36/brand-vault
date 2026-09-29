import { useEffect, useState, type FormEvent } from 'react';
import { TriangleAlert } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
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

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canDelete || isDeleting) {
            return;
        }

        onConfirm();
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (isDeleting) {
                    return;
                }

                onOpenChange(nextOpen);
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex size-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                        <TriangleAlert className="size-4" />
                    </div>
                    <AlertDialogTitle>Remove brand kit?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes your workspace brand kit. Type{' '}
                        <span className="font-medium text-foreground">
                            {brandName}
                        </span>{' '}
                        to confirm.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="brand-delete-confirmation">
                            Brand name
                        </Label>
                        <Input
                            id="brand-delete-confirmation"
                            value={confirmation}
                            autoComplete="off"
                            autoFocus
                            placeholder={brandName}
                            disabled={isDeleting}
                            onChange={(event) =>
                                setConfirmation(event.target.value)
                            }
                        />
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={!canDelete || isDeleting}
                        >
                            {isDeleting ? <Spinner /> : null}
                            {isDeleting ? 'Removing…' : 'Remove kit'}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
