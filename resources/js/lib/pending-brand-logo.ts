import type { PendingBrandLogo } from '@/types/brand';

export const MAX_BRAND_LOGO_BYTES = 2 * 1024 * 1024;

const ALLOWED_LOGO_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
]);

export function validateBrandLogoFile(file: File): string | null {
    if (!ALLOWED_LOGO_TYPES.has(file.type)) {
        return 'Logo must be a JPG, PNG, WEBP, or SVG file.';
    }

    if (file.size > MAX_BRAND_LOGO_BYTES) {
        return 'Logo may not be larger than 2MB.';
    }

    return null;
}

export function createPendingBrandLogo(file: File): PendingBrandLogo {
    return {
        key: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        previewUrl: URL.createObjectURL(file),
    };
}

export function revokePendingBrandLogo(pending: PendingBrandLogo | null): void {
    if (pending === null) {
        return;
    }

    URL.revokeObjectURL(pending.previewUrl);
}
