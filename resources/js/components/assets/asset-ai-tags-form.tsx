import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { AiTagSuggestionForm } from '@/types/ai-tagging';

const fieldClassName = cn(
    'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs',
    'outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
);

type AssetAiTagsFormProps = {
    suggestion: AiTagSuggestionForm;
    disabled: boolean;
    onChange: (suggestion: AiTagSuggestionForm) => void;
};

export function AssetAiTagsForm({
    suggestion,
    disabled,
    onChange,
}: AssetAiTagsFormProps) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="ai-tags">Tags</Label>
                <Input
                    id="ai-tags"
                    value={suggestion.tagsText}
                    disabled={disabled}
                    onChange={(event) =>
                        onChange({
                            ...suggestion,
                            tagsText: event.target.value,
                        })
                    }
                    placeholder="campaign, social, product"
                />
                <p className="text-xs text-muted-foreground">
                    Comma-separated. Saved as individual tags.
                </p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="ai-description">Description</Label>
                <textarea
                    id="ai-description"
                    rows={3}
                    disabled={disabled}
                    value={suggestion.description}
                    onChange={(event) =>
                        onChange({
                            ...suggestion,
                            description: event.target.value,
                        })
                    }
                    className={fieldClassName}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="ai-usage">Usage suggestion</Label>
                <textarea
                    id="ai-usage"
                    rows={3}
                    disabled={disabled}
                    value={suggestion.usage_suggestion}
                    onChange={(event) =>
                        onChange({
                            ...suggestion,
                            usage_suggestion: event.target.value,
                        })
                    }
                    className={fieldClassName}
                />
            </div>
        </>
    );
}
