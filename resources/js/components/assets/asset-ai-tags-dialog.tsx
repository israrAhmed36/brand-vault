import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { AssetAiTagsForm } from '@/components/assets/asset-ai-tags-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { AssetAiTagsDialogProps } from '@/types/ai-tagging';

export function AssetAiTagsDialog({
    open,
    assetName,
    isGenerating,
    isSaving,
    error,
    suggestion,
    onOpenChange,
    onSuggestionChange,
    onRegenerate,
    onSave,
}: AssetAiTagsDialogProps) {
    const isBusy = isGenerating || isSaving;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 sm:max-w-xl">
                <DialogHeader className="border-b border-border/80 bg-muted/30 px-6 py-5">
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="size-4 text-amber-600 dark:text-amber-400" />
                        Review AI suggestion
                    </DialogTitle>
                    <DialogDescription>
                        Generated for{' '}
                        <span className="font-medium text-foreground">
                            {assetName}
                        </span>
                        . Edit anything before saving to the asset record.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 px-6 py-5">
                    {isGenerating && suggestion === null ? (
                        <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Generating tags and description…
                            </p>
                        </div>
                    ) : null}

                    {suggestion ? (
                        <AssetAiTagsForm
                            suggestion={suggestion}
                            disabled={isBusy}
                            onChange={onSuggestionChange}
                        />
                    ) : null}

                    {error ? (
                        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {error}
                        </p>
                    ) : null}
                </div>

                <DialogFooter className="border-t border-border/80 bg-muted/20 px-6 py-4 sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isBusy}
                        onClick={onRegenerate}
                    >
                        {isGenerating ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <RefreshCw className="size-4" />
                        )}
                        Regenerate
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={isBusy}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={isBusy || suggestion === null}
                            onClick={onSave}
                        >
                            {isSaving ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : null}
                            Save to asset
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
