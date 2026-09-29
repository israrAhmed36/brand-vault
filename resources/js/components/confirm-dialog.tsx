import { TriangleAlert } from 'lucide-react';
import type { FormEvent } from 'react';
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
import { Spinner } from '@/components/ui/spinner';
import type { ConfirmDialogProps } from '@/types/confirm-dialog';

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    pendingLabel,
    cancelLabel = 'Cancel',
    isPending = false,
    confirmDisabled = false,
    onOpenChange,
    onConfirm,
    children,
}: ConfirmDialogProps) {
    const isConfirmBlocked = confirmDisabled || isPending;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isConfirmBlocked) {
            return;
        }

        onConfirm();
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (isPending) {
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
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    {children}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                            {cancelLabel}
                        </AlertDialogCancel>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isConfirmBlocked}
                        >
                            {isPending ? <Spinner /> : null}
                            {isPending
                                ? (pendingLabel ?? confirmLabel)
                                : confirmLabel}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
