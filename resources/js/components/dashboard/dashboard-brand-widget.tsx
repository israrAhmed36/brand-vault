import { Link } from '@inertiajs/react';
import { ArrowRight, SwatchBook } from 'lucide-react';
import { BrandLogoMark } from '@/components/brand/brand-logo-mark';
import { ColorSwatch } from '@/components/brand/color-swatch';
import { Button } from '@/components/ui/button';
import type { DashboardBrandWidgetProps } from '@/types/dashboard';

export function DashboardBrandWidget({ brand }: DashboardBrandWidgetProps) {
    return (
        <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
            {brand ? (
                <>
                    <div
                        className="h-2 w-full"
                        style={{
                            background: `linear-gradient(90deg, ${brand.primary_color}, ${brand.secondary_color})`,
                        }}
                    />
                    <div className="flex flex-1 flex-col gap-5 bg-gradient-to-b from-muted/30 to-card p-5">
                        <div className="flex items-center gap-3">
                            <BrandLogoMark
                                name={brand.name}
                                logoUrl={brand.logo_url}
                                primaryColor={brand.primary_color}
                                secondaryColor={brand.secondary_color}
                                size="sm"
                            />
                            <div className="min-w-0">
                                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                    Brand kit
                                </p>
                                <h2
                                    className="truncate text-lg font-semibold tracking-tight"
                                    style={{
                                        fontFamily:
                                            brand.default_font ?? undefined,
                                    }}
                                >
                                    {brand.name}
                                </h2>
                            </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <ColorSwatch
                                label="Primary"
                                hex={brand.primary_color}
                            />
                            <ColorSwatch
                                label="Secondary"
                                hex={brand.secondary_color}
                            />
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="mt-auto w-fit"
                        >
                            <Link href="/brand">
                                Manage brand kit
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex flex-1 flex-col items-start justify-center gap-4 bg-gradient-to-br from-indigo-500/8 via-card to-card p-5">
                    <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-2.5 text-indigo-700 dark:text-indigo-300">
                        <SwatchBook className="size-5" />
                    </span>
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Set up your brand kit
                        </h2>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            Define colors, logo, and typography so your asset
                            library stays on-brand.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/brand">
                            Create brand kit
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </Button>
                </div>
            )}
        </section>
    );
}
