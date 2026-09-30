import { useForm } from '@inertiajs/react';
import { useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { folderDepthLabel } from '@/lib/folder-depth';
import { toastFormErrors } from '@/lib/toast-form-errors';
import type {
    Folder,
    FolderFormSheetProps,
    FolderFormValues,
} from '@/types/folder';

function toFormValues(
    folder: Folder | null,
    parentId: number | null,
): FolderFormValues {
    return {
        name: folder?.name ?? '',
        parent_id: folder?.parent_id ?? parentId,
    };
}

export function FolderFormSheet({
    open,
    parentId,
    parentName = null,
    folder,
    onOpenChange,
}: FolderFormSheetProps) {
    const isEditing = folder !== null;
    const form = useForm<FolderFormValues>(toFormValues(folder, parentId));
    const isSubfolder = !isEditing && parentId !== null;

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData(toFormValues(folder, parentId));
        form.clearErrors();
    }, [open, folder, parentId]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isEditing && folder) {
            form.put(`/folders/${folder.id}`, {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
                onError: (errors) => toastFormErrors(errors),
            });

            return;
        }

        form.post('/folders', {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
            onError: (errors) => toastFormErrors(errors),
        });
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md"
            >
                <SheetHeader className="shrink-0 border-b border-border px-6 pt-6 pr-14 pb-5">
                    <SheetTitle>
                        {isEditing
                            ? 'Rename folder'
                            : isSubfolder
                              ? 'New subfolder'
                              : 'New parent folder'}
                    </SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? 'Update the folder name.'
                            : isSubfolder
                              ? `Nested under “${parentName ?? 'folder'}”. ${folderDepthLabel()}.`
                              : 'Creates a top-level folder in the library.'}
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="folder-name">Name</Label>
                            <Input
                                id="folder-name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                placeholder="Campaigns"
                            />
                            {form.errors.name ? (
                                <p className="text-sm text-destructive">
                                    {form.errors.name}
                                </p>
                            ) : null}
                            {form.errors.parent_id ? (
                                <p className="text-sm text-destructive">
                                    {form.errors.parent_id}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    <SheetFooter className="mt-auto shrink-0 flex-row gap-2 border-t border-border bg-background px-6 py-4 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? <Spinner /> : null}
                            {isEditing ? 'Save' : 'Create'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
