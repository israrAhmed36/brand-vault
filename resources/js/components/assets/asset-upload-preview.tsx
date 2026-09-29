import { FileUp, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { assetFileLabel, urlLooksLikeImage } from '@/lib/asset-display';
import type { AssetUploadPreviewProps } from '@/types/asset-form';

export function AssetUploadPreview({
    url,
    disabled = false,
    onClear,
}: AssetUploadPreviewProps) {
    const [hasImageError, setHasImageError] = useState(false);
    const showImage = urlLooksLikeImage(url) && !hasImageError;

    return (
        <div className="flex items-center gap-3 p-3">
            <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                {showImage ? (
                    <img
                        src={url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-full object-cover"
                        onError={() => setHasImageError(true)}
                    />
                ) : (
                    <FileUp className="size-5 text-muted-foreground" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                    Ready to save
                </p>
                <p className="truncate text-xs text-muted-foreground">
                    {assetFileLabel(url)}
                </p>
            </div>
            <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled}
                onClick={onClear}
                aria-label="Clear file"
            >
                <X className="size-4" />
            </Button>
        </div>
    );
}
