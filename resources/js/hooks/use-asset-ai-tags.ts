import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    generateAssetTags,
    parseTagsText,
    saveAssetTags,
} from '@/lib/asset-ai-tags';
import { ASSET_INDEX_PARTIAL } from '@/lib/asset-index-visit';
import type { AiTagSuggestionForm } from '@/types/ai-tagging';
import type { Asset } from '@/types/asset';

export function useAssetAiTags() {
    const [asset, setAsset] = useState<Asset | null>(null);
    const [suggestion, setSuggestion] = useState<AiTagSuggestionForm | null>(
        null,
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function openForAsset(nextAsset: Asset): Promise<void> {
        setAsset(nextAsset);
        setSuggestion(null);
        setError(null);
        setIsGenerating(true);

        const result = await generateAssetTags(nextAsset.id);
        setIsGenerating(false);

        if (result === null) {
            setError('Generation failed. You can close and try again.');

            return;
        }

        setSuggestion({
            tagsText: result.tags.join(', '),
            description: result.description,
            usage_suggestion: result.usage_suggestion,
        });
    }

    async function regenerate(): Promise<void> {
        if (asset === null) {
            return;
        }

        setIsGenerating(true);
        setError(null);
        const result = await generateAssetTags(asset.id);
        setIsGenerating(false);

        if (result === null) {
            setError('Generation failed. Please retry.');

            return;
        }

        setSuggestion({
            tagsText: result.tags.join(', '),
            description: result.description,
            usage_suggestion: result.usage_suggestion,
        });
    }

    async function save(): Promise<void> {
        if (asset === null || suggestion === null) {
            return;
        }

        const tags = parseTagsText(suggestion.tagsText);

        if (tags.length === 0) {
            setError('Add at least one tag before saving.');

            return;
        }

        setIsSaving(true);
        setError(null);
        const saved = await saveAssetTags(asset.id, {
            tags,
            description: suggestion.description.trim(),
            usage_suggestion: suggestion.usage_suggestion.trim(),
        });
        setIsSaving(false);

        if (!saved) {
            setError('Could not save. Check the fields and retry.');

            return;
        }

        setAsset(null);
        setSuggestion(null);
        router.reload({ only: [...ASSET_INDEX_PARTIAL] });
    }

    return {
        asset,
        open: asset !== null,
        suggestion,
        isGenerating,
        isSaving,
        error,
        openForAsset,
        regenerate,
        save,
        setSuggestion,
        close: () => {
            setAsset(null);
            setSuggestion(null);
            setError(null);
        },
    };
}
