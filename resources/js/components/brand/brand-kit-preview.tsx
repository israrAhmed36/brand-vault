import { Pencil, Trash2 } from 'lucide-react';
import { BrandLogoMark } from '@/components/brand/brand-logo-mark';
import { ColorSwatch } from '@/components/brand/color-swatch';
import { Button } from '@/components/ui/button';
import type { BrandKitPreviewProps } from '@/types/brand';

export function BrandKitPreview({
    brand,
    onEdit,
    onDeleteRequest,
    isDeleting,
}: BrandKitPreviewProps) {
    return (
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div
                className="h-1.5 w-full"
                style={{
                    background: `linear-gradient(90deg, ${brand.primary_color}, ${brand.secondary_color})`,
                }}
            />

            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex min-w-0 items-center gap-4">
                    <BrandLogoMark
                        name={brand.name}
                        logoUrl={brand.logo_url}
                        primaryColor={brand.primary_color}
                        secondaryColor={brand.secondary_color}
                    />
                    <div className="min-w-0 space-y-1">
                        <h2
                            className="truncate text-xl font-semibold tracking-tight text-foreground"
                            style={{
                                fontFamily: brand.default_font ?? undefined,
                            }}
                        >
                            {brand.name}
                        </h2>
                        <p className="truncate text-sm text-muted-foreground">
                            {brand.default_font
                                ? `${brand.default_font} · workspace kit`
                                : 'Workspace brand kit'}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 gap-2">
                    <Button type="button" size="sm" onClick={onEdit}>
                        <Pencil className="size-3.5" />
                        Edit
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isDeleting}
                        onClick={onDeleteRequest}
                    >
                        <Trash2 className="size-3.5" />
                        {isDeleting ? 'Removing…' : 'Remove'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-3 border-t border-border bg-muted/30 p-5 sm:grid-cols-2">
                <ColorSwatch label="Primary" hex={brand.primary_color} />
                <ColorSwatch label="Secondary" hex={brand.secondary_color} />
            </div>

            <dl className="grid gap-4 border-t border-border px-5 py-4 text-sm sm:grid-cols-2">
                <div className="min-w-0 space-y-1">
                    <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Logo
                    </dt>
                    <dd className="truncate text-foreground">
                        {brand.logo_url ? (
                            <a
                                href={brand.logo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline-offset-4 hover:underline"
                            >
                                {brand.logo_url}
                            </a>
                        ) : (
                            <span className="text-muted-foreground">
                                Not set
                            </span>
                        )}
                    </dd>
                </div>
                <div className="min-w-0 space-y-1">
                    <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Default font
                    </dt>
                    <dd className="text-foreground">
                        {brand.default_font ?? (
                            <span className="text-muted-foreground">
                                Not set
                            </span>
                        )}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
