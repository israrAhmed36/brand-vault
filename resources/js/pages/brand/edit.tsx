import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { BrandDeleteDialog } from '@/components/brand/brand-delete-dialog';
import { BrandEmptyState } from '@/components/brand/brand-empty-state';
import { BrandFormSheet } from '@/components/brand/brand-form-sheet';
import { BrandKitPreview } from '@/components/brand/brand-kit-preview';
import type { BrandEditPageProps } from '@/types/brand';

export default function BrandEdit() {
    const { brand } = usePage<BrandEditPageProps>().props;
    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function handleDeleteConfirm() {
        setIsDeleting(true);
        router.delete('/brand', {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                setSheetOpen(false);
            },
            onError: () => {
                toast.error('Could not remove brand kit.');
            },
            onFinish: () => setIsDeleting(false),
        });
    }

    return (
        <>
            <Head title="Brand kit" />
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:p-6">
                <header className="flex items-end justify-between gap-4">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Brand kit
                    </h1>
                </header>

                {brand ? (
                    <BrandKitPreview
                        brand={brand}
                        onEdit={() => setSheetOpen(true)}
                        onDeleteRequest={() => setDeleteOpen(true)}
                        isDeleting={isDeleting}
                    />
                ) : (
                    <BrandEmptyState onCreate={() => setSheetOpen(true)} />
                )}
            </div>

            <BrandFormSheet
                key={brand?.id ?? 'create'}
                brand={brand}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />

            {brand ? (
                <BrandDeleteDialog
                    brandName={brand.name}
                    open={deleteOpen}
                    isDeleting={isDeleting}
                    onOpenChange={setDeleteOpen}
                    onConfirm={handleDeleteConfirm}
                />
            ) : null}
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
