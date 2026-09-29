import { toast } from 'sonner';
import { getXsrfToken } from '@/lib/csrf';
import type { AiTagSuggestion } from '@/types/ai-tagging';

type ApiSuccess<T> = {
    success: true;
    data: T;
};

type ApiError = {
    success?: false;
    error?: { message?: string; code?: string };
    message?: string;
};

function errorMessage(payload: ApiError, fallback: string): string {
    return payload.error?.message ?? payload.message ?? fallback;
}

export async function generateAssetTags(
    assetId: number,
): Promise<AiTagSuggestion | null> {
    const response = await fetch(`/api/assets/${assetId}/generate-tags`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        credentials: 'same-origin',
    });

    const payload = (await response.json()) as
        | ApiSuccess<AiTagSuggestion>
        | ApiError;

    if (!response.ok || !('success' in payload) || !payload.success) {
        toast.error(
            errorMessage(payload as ApiError, 'Could not generate tags.'),
        );

        return null;
    }

    return payload.data;
}

export async function saveAssetTags(
    assetId: number,
    suggestion: AiTagSuggestion,
): Promise<boolean> {
    const response = await fetch(`/api/assets/${assetId}/tags`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(suggestion),
    });

    const payload = (await response.json()) as ApiSuccess<unknown> | ApiError;

    if (!response.ok || !('success' in payload) || !payload.success) {
        toast.error(
            errorMessage(payload as ApiError, 'Could not save AI suggestion.'),
        );

        return false;
    }

    toast.success('AI tags saved.');

    return true;
}

export function parseTagsText(tagsText: string): string[] {
    return tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');
}
