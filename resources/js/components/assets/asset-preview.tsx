import { useState } from 'react';
import { ASSET_TYPE_VISUAL, shouldPreviewImage } from '@/lib/asset-display';
import { cn } from '@/lib/utils';
import type { AssetCardProps } from '@/types/asset';

export function AssetPreview({ asset }: Pick<AssetCardProps, 'asset'>) {
    const [hasImageError, setHasImageError] = useState(false);
    const [isImageReady, setIsImageReady] = useState(false);
    const visual = ASSET_TYPE_VISUAL[asset.type];
    const Icon = visual.icon;
    const showImage =
        shouldPreviewImage(asset.type, asset.url) && !hasImageError;

    return (
        <div
            className={cn(
                'relative aspect-[16/10] overflow-hidden',
                showImage ? 'bg-muted/60' : visual.tileClassName,
            )}
        >
            {showImage ? (
                <img
                    src={asset.url}
                    alt=""
                    referrerPolicy="no-referrer"
                    className={cn(
                        'size-full object-contain p-4 transition duration-300 ease-out',
                        isImageReady
                            ? 'opacity-100 group-hover:scale-[1.03]'
                            : 'absolute inset-0 opacity-0',
                    )}
                    onLoad={() => setIsImageReady(true)}
                    onError={() => setHasImageError(true)}
                />
            ) : null}

            {isImageReady ? null : (
                <div className="flex size-full items-center justify-center">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-border/50 bg-card/90 shadow-sm">
                        <Icon className={cn('size-4', visual.iconClassName)} />
                    </span>
                </div>
            )}
        </div>
    );
}
