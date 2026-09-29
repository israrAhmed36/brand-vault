import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { BrandEmptyState } from '@/components/brand/brand-empty-state';
import { BrandFormSheet } from '@/components/brand/brand-form-sheet';
import { BrandKitPreview } from '@/components/brand/brand-kit-preview';
import type { BrandEditPageProps } from '@/types/brand';

export default function BrandEdit() {
    const { brand, flash } = usePage<
        BrandEditPageProps & { flash?: { success?: string } }
    >().props;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDelete() {
        if (
            !window.confirm(
                'Remove this brand kit? You can create a new one later.',
            )
        ) {
            return;
        }

        setIsDeleting(true);
        router.delete('/brand', {
            preserveScroll: true,
            onFinish: () => setIsDeleting(false),
        });
    }

    return (
        <>
            <Head title="Brand kit" />
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
                <header className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Brand kit
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Your workspace identity for tags, previews, and exports.
                    </p>
                </header>

                {flash?.success ? (
                    <p className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
                        {flash.success}
                    </p>
                ) : null}

                {brand ? (
                    <BrandKitPreview
                        brand={brand}
                        onEdit={() => setSheetOpen(true)}
                        onDelete={handleDelete}
                        isDeleting={isDeleting}
                    />
                ) : (
                    <BrandEmptyState onCreate={() => setSheetOpen(true)} />
                )}
            </div>

            <BrandFormSheet
                brand={brand}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </>
    );
}

BrandEdit.layout = {
    breadcrumbs: [
        {
            title: 'Brand kit',
            href: '/brand',
        },
    ],
};
