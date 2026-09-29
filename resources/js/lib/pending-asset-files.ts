import type { AssetType } from '@/types/asset';
import type { PendingAssetFile } from '@/types/asset-form';

const DOCUMENT_EXTENSIONS = new Set([
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
]);

export const MAX_PENDING_ASSET_FILES = 20;

export function createPendingAssetFile(file: File): PendingAssetFile {
    const previewUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : null;

    return {
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl,
    };
}

export function revokePendingAssetFiles(files: PendingAssetFile[]): void {
    for (const item of files) {
        if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
        }
    }
}

export function assetNameFromFile(file: File): string {
    const base = file.name.replace(/\.[^.]+$/, '').trim();

    return base || 'Untitled asset';
}

export function assetTypeFromFile(file: File): AssetType {
    if (file.type.startsWith('image/')) {
        return 'image';
    }

    if (file.type.startsWith('video/')) {
        return 'video';
    }

    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (DOCUMENT_EXTENSIONS.has(extension) || file.type.startsWith('text/')) {
        return 'document';
    }

    return 'other';
}
