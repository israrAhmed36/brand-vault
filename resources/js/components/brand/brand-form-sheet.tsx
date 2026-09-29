import { useForm } from '@inertiajs/react';
import { useEffect, type FormEvent } from 'react';
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
import { toastFormErrors } from '@/lib/toast-form-errors';
import type {
    Brand,
    BrandFormSheetProps,
    BrandFormValues,
} from '@/types/brand';

const EMPTY_BRAND_FORM: BrandFormValues = {
    name: '',
    primary_color: '#111827',
    secondary_color: '#0F766E',
    logo_url: '',
    default_font: '',
};

function toFormValues(brand: Brand | null): BrandFormValues {
    if (brand === null) {
        return { ...EMPTY_BRAND_FORM };
    }

    return {
        name: brand.name,
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        logo_url: brand.logo_url ?? '',
        default_font: brand.default_font ?? '',
    };
}

export function BrandFormSheet({
    brand,
    open,
    onOpenChange,
}: BrandFormSheetProps) {
    const isEditing = brand !== null;
    const form = useForm<BrandFormValues>(toFormValues(brand));
    const brandKey = brand?.id ?? 'new';

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData(toFormValues(brand));
        form.clearErrors();
    }, [open, brandKey]);

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
                        Colors, logo, and type used across your asset library.
                    </SheetDescription>
                </SheetHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col gap-6 px-6 py-6"
                >
                    <BrandFormFields
                        values={form.data}
                        errors={form.errors}
                        onChange={(field, value) => form.setData(field, value)}
                    />

                    <SheetFooter className="mt-auto flex-row gap-2 border-t border-border px-0 pt-4 pb-0 sm:justify-end">
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
