import { useForm } from '@inertiajs/react';
import { useEffect, type FormEvent } from 'react';
import { AssetFormFields } from '@/components/assets/asset-form-fields';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { usePendingAssetFiles } from '@/hooks/use-pending-asset-files';
import {
    assetNameFromFile,
    assetTypeFromFile,
} from '@/lib/pending-asset-files';
import {
    assetFileError,
    toAssetFormValues,
    toAssetSubmitPayload,
} from '@/lib/asset-submit-payload';
import { toastFormErrors } from '@/lib/toast-form-errors';
import type { AssetFormSheetProps, AssetFormValues } from '@/types/asset-form';

export function AssetFormSheet({
    open,
    asset,
    folderId,
    folderOptions,
    onOpenChange,
}: AssetFormSheetProps) {
    const isEditing = asset !== null;
    const form = useForm<AssetFormValues>(toAssetFormValues(asset, folderId));
    const pending = usePendingAssetFiles(open, asset?.id ?? null);

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData(toAssetFormValues(asset, folderId));
        form.clearErrors();
    }, [open, asset, folderId]);

    function handleFilesAdded(incoming: File[]) {
        const next = pending.addFiles(incoming, !isEditing);

        if (isEditing || next.length !== 1) {
            return;
        }

        const file = next[0].file;

        form.setData({
            ...form.data,
            name:
                form.data.name.trim() === ''
                    ? assetNameFromFile(file)
                    : form.data.name,
            type: assetTypeFromFile(file),
        });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform((data) =>
            toAssetSubmitPayload(data, pending.files, isEditing),
        );

        const options = {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
            onError: toastFormErrors,
        };

        if (isEditing && asset) {
            form.put(`/assets/${asset.id}`, options);

            return;
        }

        form.post('/assets', options);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-md"
            >
                <SheetHeader className="shrink-0 border-b border-border px-6 pt-6 pr-14 pb-5">
                    <SheetTitle>
                        {isEditing ? 'Edit asset' : 'Add asset'}
                    </SheetTitle>
                    <SheetDescription>
                        Files upload when you save, or paste a URL.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
                        <AssetFormFields
                            data={form.data}
                            folderOptions={folderOptions}
                            files={pending.files}
                            allowMultiple={!isEditing}
                            fileError={assetFileError(form.errors)}
                            errors={form.errors}
                            onChange={(key, value) => {
                                form.setData({ ...form.data, [key]: value });
                            }}
                            onFilesAdded={handleFilesAdded}
                            onRemoveFile={pending.removeFile}
                        />
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
