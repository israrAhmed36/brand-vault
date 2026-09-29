import { Plus, SwatchBook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BrandEmptyStateProps } from '@/types/brand';

export function BrandEmptyState({ onCreate }: BrandEmptyStateProps) {
    return (
        <section className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border bg-muted/20 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
                    <SwatchBook className="size-4" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                        No brand kit yet
                    </h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Add colors, logo, and type once — used across assets and
                        tagging.
                    </p>
                </div>
            </div>
            <Button type="button" size="sm" onClick={onCreate}>
                <Plus className="size-3.5" />
                Create kit
            </Button>
        </section>
    );
}
