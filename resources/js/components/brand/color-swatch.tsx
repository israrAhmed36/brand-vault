import { cn } from '@/lib/utils';
import type { ColorSwatchProps } from '@/types/brand';

export function ColorSwatch({ label, hex, className }: ColorSwatchProps) {
    return (
        <div className={cn('flex min-w-0 flex-col gap-2', className)}>
            <div
                className="aspect-[4/3] w-full rounded-lg border border-black/5 shadow-sm"
                style={{ backgroundColor: hex }}
            />
            <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
                    {hex}
                </p>
            </div>
        </div>
    );
}
