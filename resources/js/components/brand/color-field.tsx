import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ColorFieldProps } from '@/types/brand';

export function ColorField({
    id,
    label,
    value,
    error,
    onChange,
}: ColorFieldProps) {
    const safeHex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#000000';

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center gap-3">
                <label
                    htmlFor={`${id}-picker`}
                    className={cn(
                        'size-11 shrink-0 cursor-pointer overflow-hidden rounded-md border border-border shadow-sm transition hover:scale-[1.02]',
                    )}
                    style={{ backgroundColor: safeHex }}
                >
                    <span className="sr-only">Pick {label}</span>
                    <input
                        id={`${id}-picker`}
                        type="color"
                        value={safeHex}
                        onChange={(event) =>
                            onChange(event.target.value.toUpperCase())
                        }
                        className="size-full cursor-pointer opacity-0"
                    />
                </label>
                <Input
                    id={id}
                    name={id}
                    value={value}
                    placeholder="#111827"
                    maxLength={7}
                    className="font-mono tracking-wide uppercase"
                    onChange={(event) => onChange(event.target.value)}
                />
            </div>
            <InputError message={error} />
        </div>
    );
}
