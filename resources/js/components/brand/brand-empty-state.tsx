import { Button } from '@/components/ui/button';
import type { BrandEmptyStateProps } from '@/types/brand';

export function BrandEmptyState({ onCreate }: BrandEmptyStateProps) {
    return (
        <section className="flex flex-col items-start gap-6 rounded-2xl border border-dashed border-border bg-[linear-gradient(180deg,oklch(0.98_0.01_95),oklch(0.96_0.01_95))] px-8 py-12 dark:bg-[linear-gradient(180deg,oklch(0.22_0.01_95),oklch(0.18_0.01_95))]">
            <div className="space-y-2">
                <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Brand kit
                </p>
                <h2 className="max-w-md text-3xl font-semibold tracking-tight text-foreground">
                    Set the look your assets follow
                </h2>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                    One kit per workspace — primary and secondary colors, logo,
                    and default font. Edit anytime from the sheet on the right.
                </p>
            </div>
            <Button type="button" onClick={onCreate}>
                Create brand kit
            </Button>
        </section>
    );
}
