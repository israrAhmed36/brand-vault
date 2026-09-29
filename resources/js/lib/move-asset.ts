import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { ASSET_INDEX_PARTIAL } from '@/lib/asset-index-visit';
import { getXsrfToken } from '@/lib/csrf';

type MoveSuccess = {
    success: true;
    data: { id: number; folder_id: number | null };
};

type MoveError = {
    success?: false;
    message?: string;
    error?: { message?: string };
    errors?: Record<string, string[]>;
};

export async function moveAssetToFolder(
    assetId: number,
    folderId: number | null,
): Promise<boolean> {
    const response = await fetch(`/api/assets/${assetId}/move`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ folder_id: folderId }),
    });

    const payload = (await response.json()) as MoveSuccess | MoveError;

    if (!response.ok || !('success' in payload) || !payload.success) {
        const errorPayload = payload as MoveError;
        toast.error(
            errorPayload.errors?.folder_id?.[0] ??
                errorPayload.error?.message ??
                errorPayload.message ??
                'Could not move asset.',
        );

        return false;
    }

    toast.success('Asset moved.');
    router.reload({
        only: [...ASSET_INDEX_PARTIAL],
    });

    return true;
}
