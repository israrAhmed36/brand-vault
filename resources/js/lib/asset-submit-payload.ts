import type { Asset } from '@/types/asset';
import type { AssetFormValues, PendingAssetFile } from '@/types/asset-form';

export function toAssetFormValues(
    asset: Asset | null,
    folderId: number | null,
): AssetFormValues {
    return {
        name: asset?.name ?? '',
        type: asset?.type ?? 'image',
        url: asset?.url ?? '',
        folder_id: asset?.folder_id ?? folderId,
    };
}

type AssetSubmitPayload = Record<string, string | number | File | File[]>;

export function toAssetSubmitPayload(
    data: AssetFormValues,
    pendingFiles: PendingAssetFile[],
    isEditing: boolean,
): AssetSubmitPayload {
    const payload: AssetSubmitPayload = {};
    const usesPerFileDetails = !isEditing && pendingFiles.length > 1;

    if (!usesPerFileDetails) {
        payload.name = data.name;
        payload.type = data.type;
    }

    if (data.folder_id !== null) {
        payload.folder_id = data.folder_id;
    }

    if (!isEditing && pendingFiles.length > 0) {
        payload.files = pendingFiles.map((item) => item.file);

        return payload;
    }

    if (isEditing && pendingFiles.length > 0) {
        payload.file = pendingFiles[0].file;
    }

    if (data.url.trim() !== '') {
        payload.url = data.url;
    }

    return payload;
}

export function assetFileError(errors: object): string | undefined {
    const bag = errors as Partial<Record<string, string>>;

    if (bag.files) {
        return bag.files;
    }

    if (bag.file) {
        return bag.file;
    }

    const nested = Object.entries(bag).find(
        ([key, value]) =>
            key.startsWith('files.') &&
            typeof value === 'string' &&
            value !== '',
    );

    return nested?.[1];
}
