import type { Brand, BrandFormValues } from '@/types/brand';

export const EMPTY_BRAND_FORM: BrandFormValues = {
    name: '',
    primary_color: '#111827',
    secondary_color: '#0F766E',
    logo_url: '',
    default_font: '',
};

export function toBrandFormValues(brand: Brand | null): BrandFormValues {
    if (brand === null) {
        return { ...EMPTY_BRAND_FORM };
    }

    return {
        name: brand.name,
        primary_color: brand.primary_color,
        secondary_color: brand.secondary_color,
        logo_url: brand.logo_url ?? '',
        default_font: brand.default_font ?? '',
    };
}

export function toBrandSubmitPayload(
    data: BrandFormValues,
    logoUrl: string | null,
): Record<string, string | null> {
    return {
        ...data,
        logo_url: logoUrl,
        default_font:
            data.default_font.trim() === '' ? null : data.default_font,
    };
}
