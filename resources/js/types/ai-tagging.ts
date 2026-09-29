export type AiTagSuggestion = {
    tags: string[];
    description: string;
    usage_suggestion: string;
};

export type AiTagSuggestionForm = {
    tagsText: string;
    description: string;
    usage_suggestion: string;
};

export type AssetAiTagsDialogProps = {
    open: boolean;
    assetName: string;
    isGenerating: boolean;
    isSaving: boolean;
    error: string | null;
    suggestion: AiTagSuggestionForm | null;
    onOpenChange: (open: boolean) => void;
    onSuggestionChange: (suggestion: AiTagSuggestionForm) => void;
    onRegenerate: () => void;
    onSave: () => void;
};
