import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AssetNameFieldProps } from '@/types/asset-form';

export function AssetNameField({
    name,
    usesFileNames,
    error,
    onChange,
}: AssetNameFieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="asset-name">Name</Label>
            <Input
                id="asset-name"
                value={name}
                disabled={usesFileNames}
                placeholder="e.g. Hero banner"
                onChange={(event) => onChange(event.target.value)}
            />
            {usesFileNames ? (
                <p className="text-xs text-muted-foreground">
                    Each file keeps its own name.
                </p>
            ) : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
