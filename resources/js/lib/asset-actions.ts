import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type { Asset } from '@/types/asset';
import type { Folder } from '@/types/folder';

export function trashAsset(asset: Asset): void {
    router.delete(`/assets/${asset.id}`, {
        preserveScroll: true,
        onError: () => toast.error('Could not trash asset.'),
    });
}

export function deleteFolder(folder: Folder): void {
    if (!window.confirm(`Delete folder “${folder.name}”?`)) {
        return;
    }

    router.delete(`/folders/${folder.id}`, { preserveScroll: true });
}

export function moveFolder(folderId: number, parentId: number | null): void {
    router.put(
        `/folders/${folderId}/move`,
        { parent_id: parentId },
        {
            preserveScroll: true,
            onError: () => toast.error('Could not move folder.'),
        },
    );
}

export function restoreAsset(asset: Asset): void {
    router.post(
        `/assets/${asset.id}/restore`,
        {},
        {
            preserveScroll: true,
            onError: () => toast.error('Could not restore asset.'),
        },
    );
}

export function forceDeleteAsset(asset: Asset): void {
    router.delete(`/assets/${asset.id}/force`, {
        preserveScroll: true,
        onError: () => toast.error('Could not delete asset.'),
    });
}
