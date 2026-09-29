import { getXsrfToken } from '@/lib/csrf';

type UploadSuccess = {
    success: true;
    data: { url: string };
};

type UploadError = {
    success: false;
    error?: { message?: string };
    message?: string;
    errors?: Record<string, string[]>;
};

export async function uploadAssetFile(file: File): Promise<string> {
    const body = new FormData();
    body.append('file', file);

    const response = await fetch('/assets/upload', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        credentials: 'same-origin',
        body,
    });

    const payload = (await response.json()) as UploadSuccess | UploadError;

    if (!response.ok || !('success' in payload) || !payload.success) {
        const errorPayload = payload as UploadError;
        const fieldError = errorPayload.errors?.file?.[0];

        throw new Error(
            fieldError ??
                errorPayload.error?.message ??
                errorPayload.message ??
                'File upload failed.',
        );
    }

    return payload.data.url;
}
