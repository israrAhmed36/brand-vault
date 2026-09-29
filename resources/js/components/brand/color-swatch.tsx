import { cn } from '@/lib/utils';
import type { ColorSwatchProps } from '@/types/brand';

export function ColorSwatch({ label, hex, className }: ColorSwatchProps) {
    return (
        <div
            className={cn(
                'flex min-w-0 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5',
                className,
            )}
        >
            <span
                className="size-9 shrink-0 rounded-md border border-black/10 shadow-inner"
                style={{ backgroundColor: hex }}
                aria-hidden
            />
            <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {hex}
                </p>
            </div>
        </div>
    );
}
