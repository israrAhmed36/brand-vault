import { ColorSwatch } from '@/components/brand/color-swatch';
import { Button } from '@/components/ui/button';
import type { BrandKitPreviewProps } from '@/types/brand';

export function BrandKitPreview({
    brand,
    onEdit,
    onDelete,
    isDeleting,
}: BrandKitPreviewProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div
                className="relative min-h-48 px-8 py-10 text-white"
                style={{
                    background: `linear-gradient(135deg, ${brand.primary_color} 0%, ${brand.secondary_color} 100%)`,
                }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-3">
                        {brand.logo_url ? (
                            <img
                                src={brand.logo_url}
                                alt={`${brand.name} logo`}
                                className="h-12 w-auto max-w-48 object-contain drop-shadow-sm"
                            />
                        ) : (
                            <p className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">
                                Brand kit
                            </p>
                        )}
                        <h2
                            className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl"
                            style={{
                                fontFamily: brand.default_font ?? undefined,
                            }}
                        >
                            {brand.name}
                        </h2>
                        {brand.default_font ? (
                            <p className="text-sm text-white/75">
                                Typeface · {brand.default_font}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="bg-white text-neutral-900 hover:bg-white/90"
                            onClick={onEdit}
                        >
                            Edit kit
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                            disabled={isDeleting}
                            onClick={onDelete}
                        >
                            {isDeleting ? 'Removing…' : 'Remove'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">
                <ColorSwatch label="Primary" hex={brand.primary_color} />
                <ColorSwatch label="Secondary" hex={brand.secondary_color} />
            </div>
        </section>
    );
}
