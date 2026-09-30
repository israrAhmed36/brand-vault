import { useForm } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { BrandFormFields } from '@/components/brand/brand-form-fields';
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
import { usePendingBrandLogo } from '@/hooks/use-pending-brand-logo';
import { uploadBrandLogo } from '@/lib/brand-logo-upload';
import {
    toBrandFormValues,
    toBrandSubmitPayload,
} from '@/lib/brand-form-values';
import { toastFormErrors } from '@/lib/toast-form-errors';
import type { BrandFormSheetProps, BrandFormValues } from '@/types/brand';

export function BrandFormSheet({
    brand,
    open,
    onOpenChange,
}: BrandFormSheetProps) {
    const isEditing = brand !== null;
    const form = useForm<BrandFormValues>(toBrandFormValues(brand));
    const brandKey = brand?.id ?? 'new';
    const pendingLogo = usePendingBrandLogo(open);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const isBusy = form.processing || isUploadingLogo;

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData(toBrandFormValues(brand));
        form.clearErrors();
    }, [open, brandKey]);

    function handleLogoClear() {
        pendingLogo.clear();
        form.setData('logo_url', '');
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let logoUrl =
            form.data.logo_url.trim() === '' ? null : form.data.logo_url;

        if (pendingLogo.pending !== null) {
            setIsUploadingLogo(true);

            try {
                logoUrl = await uploadBrandLogo(pendingLogo.pending.file);
            } catch (caught) {
                toast.error(
                    caught instanceof Error
                        ? caught.message
                        : 'Logo upload failed.',
                );
                setIsUploadingLogo(false);

                return;
            }

            setIsUploadingLogo(false);
        }

        form.transform((data) => toBrandSubmitPayload(data, logoUrl));
        form.put('/brand', {
            preserveScroll: true,
            onSuccess: () => {
                pendingLogo.clear();
                onOpenChange(false);
            },
            onError: (errors) => toastFormErrors(errors),
        });
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
            >
                <SheetHeader className="space-y-1.5 border-b border-border px-6 pt-6 pr-14 pb-5">
                    <SheetTitle>
                        {isEditing ? 'Edit brand kit' : 'Create brand kit'}
                    </SheetTitle>
                    <SheetDescription>
                        Colors, logo, and type for your library. Logo uploads
                        when you save.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col gap-6 px-6 py-6"
                >
                    <BrandFormFields
                        values={form.data}
                        errors={form.errors}
                        logoPreviewUrl={
                            pendingLogo.pending?.previewUrl ??
                            form.data.logo_url
                        }
                        hasPendingLogo={pendingLogo.pending !== null}
                        onChange={(field, value) => form.setData(field, value)}
                        onLogoFileSelected={pendingLogo.selectFile}
                        onLogoClear={handleLogoClear}
                    />

                    <SheetFooter className="mt-auto border-t border-border px-0 pt-4 pb-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isBusy}>
                            {isBusy ? <Spinner /> : null}
                            {isEditing ? 'Save changes' : 'Create kit'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
