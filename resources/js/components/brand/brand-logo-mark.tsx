import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BrandLogoMarkProps } from '@/types/brand';

function initialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return 'BV';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

export function BrandLogoMark({
    name,
    logoUrl,
    primaryColor,
    secondaryColor,
    size = 'md',
}: BrandLogoMarkProps) {
    const [hasImageError, setHasImageError] = useState(false);
    const showImage = Boolean(logoUrl) && !hasImageError;
    const sizeClass = size === 'sm' ? 'size-10 text-sm' : 'size-14 text-base';

    return (
        <div
            className={cn(
                'flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted font-semibold tracking-tight text-white shadow-sm',
                sizeClass,
            )}
            style={
                showImage
                    ? undefined
                    : {
                          background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
                      }
            }
        >
            {showImage ? (
                <img
                    src={logoUrl ?? undefined}
                    alt=""
                    className="size-full object-cover"
                    onError={() => setHasImageError(true)}
                />
            ) : (
                <span aria-hidden>{initialsFromName(name)}</span>
            )}
            <span className="sr-only">{name} mark</span>
        </div>
    );
}
