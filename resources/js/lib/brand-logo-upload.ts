import { getXsrfToken } from '@/lib/csrf';

export type LogoUploadResult = {
    success: true;
    data: {
        logo_url: string;
    };
};

export type LogoUploadError = {
    success: false;
    error?: {
        message?: string;
    };
    message?: string;
    errors?: Record<string, string[]>;
};

export async function uploadBrandLogo(file: File): Promise<string> {
    const body = new FormData();
    body.append('logo', file);

    const response = await fetch('/brand/logo', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        credentials: 'same-origin',
        body,
    });

    const payload = (await response.json()) as
        | LogoUploadResult
        | LogoUploadError;

    if (!response.ok || !('success' in payload) || !payload.success) {
        const errorPayload = payload as LogoUploadError;
        const fieldError = errorPayload.errors?.logo?.[0];

        throw new Error(
            fieldError ??
                errorPayload.error?.message ??
                errorPayload.message ??
                'Logo upload failed.',
        );
    }

    return payload.data.logo_url;
}
