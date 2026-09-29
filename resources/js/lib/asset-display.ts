import {
    FileText,
    Film,
    Image as ImageIcon,
    Link2,
    Package,
    type LucideIcon,
} from 'lucide-react';
import type { Asset, AssetType } from '@/types/asset';

const IMAGE_EXTENSION = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

type AssetTypeVisual = {
    icon: LucideIcon;
    tileClassName: string;
    iconClassName: string;
};

export const ASSET_TYPE_VISUAL: Record<AssetType, AssetTypeVisual> = {
    image: {
        icon: ImageIcon,
        tileClassName: 'bg-primary/10',
        iconClassName: 'text-primary',
    },
    video: {
        icon: Film,
        tileClassName: 'bg-chart-2/15',
        iconClassName: 'text-chart-2',
    },
    document: {
        icon: FileText,
        tileClassName: 'bg-chart-4/25',
        iconClassName: 'text-chart-5',
    },
    link: {
        icon: Link2,
        tileClassName: 'bg-primary/10',
        iconClassName: 'text-primary',
    },
    other: {
        icon: Package,
        tileClassName: 'bg-muted',
        iconClassName: 'text-muted-foreground',
    },
};

export function urlLooksLikeImage(url: string): boolean {
    const path = url.split('?')[0] ?? url;

    return IMAGE_EXTENSION.test(path);
}

export function shouldPreviewImage(type: AssetType, url: string): boolean {
    return type === 'image' || urlLooksLikeImage(url);
}

export function assetSourceLabel(url: string): string {
    try {
        const host = new URL(url).hostname.replace(/^www\./, '');

        return host || 'External file';
    } catch {
        return 'External file';
    }
}

export function assetFileLabel(url: string): string {
    try {
        const name = decodeURIComponent(
            new URL(url).pathname.split('/').pop() ?? '',
        );

        return name || assetSourceLabel(url);
    } catch {
        return 'Uploaded file';
    }
}

export function formatAssetDate(iso: string): string {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function assetCountLabel(count: number): string {
    return count === 1 ? '1 asset' : `${count} assets`;
}

export const ASSET_TYPE_ORDER: AssetType[] = [
    'image',
    'video',
    'document',
    'link',
    'other',
];

export const ASSET_TYPE_LABEL: Record<AssetType, string> = {
    image: 'Images',
    video: 'Videos',
    document: 'Documents',
    link: 'Links',
    other: 'Other',
};

export type AssetTypeGroup = {
    type: AssetType;
    assets: Asset[];
};

export function groupAssetsByType(assets: Asset[]): AssetTypeGroup[] {
    const buckets = new Map<AssetType, Asset[]>();

    for (const asset of assets) {
        const group = buckets.get(asset.type) ?? [];
        group.push(asset);
        buckets.set(asset.type, group);
    }

    return ASSET_TYPE_ORDER.filter(
        (type) => (buckets.get(type)?.length ?? 0) > 0,
    ).map((type) => ({
        type,
        assets: buckets.get(type) ?? [],
    }));
}

export const assetGridClassName =
    'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3';
