import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
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
import type { BrandFormSheetProps, BrandFormValues } from '@/types/brand';

function toFormValues(brand: BrandFormSheetProps['brand']): BrandFormValues {
    return {
        name: brand?.name ?? '',
        primary_color: brand?.primary_color ?? '#111827',
        secondary_color: brand?.secondary_color ?? '#0F766E',
        logo_url: brand?.logo_url ?? '',
        default_font: brand?.default_font ?? '',
    };
}

export function BrandFormSheet({
    brand,
    open,
    onOpenChange,
}: BrandFormSheetProps) {
    const isEditing = brand !== null;
    const form = useForm<BrandFormValues>(toFormValues(brand));

    function handleOpenChange(nextOpen: boolean) {
        if (nextOpen) {
            form.setData(toFormValues(brand));
            form.clearErrors();
        }

        onOpenChange(nextOpen);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            logo_url: data.logo_url.trim() === '' ? null : data.logo_url,
            default_font:
                data.default_font.trim() === '' ? null : data.default_font,
        }));

        form.put('/brand', {
            preserveScroll: true,
            onSuccess: () => onOpenChange(false),
        });
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                side="right"
                className="w-full gap-0 overflow-y-auto sm:max-w-md"
            >
                <SheetHeader className="border-b border-border px-1 pb-4">
                    <SheetTitle>
                        {isEditing ? 'Edit brand kit' : 'Create brand kit'}
                    </SheetTitle>
                    <SheetDescription>
                        Colors, logo, and type used across your asset library.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col gap-6 px-1 py-6"
                >
                    <BrandFormFields
                        values={form.data}
                        errors={form.errors}
                        onChange={(field, value) => form.setData(field, value)}
                    />

                    <SheetFooter className="mt-auto flex-row gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? <Spinner /> : null}
                            {isEditing ? 'Save changes' : 'Create kit'}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
