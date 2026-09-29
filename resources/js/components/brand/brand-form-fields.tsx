import { ColorField } from '@/components/brand/color-field';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BrandFormFieldsProps } from '@/types/brand';

export function BrandFormFields({
    values,
    errors,
    onChange,
}: BrandFormFieldsProps) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-2">
                <Label htmlFor="name">Brand name</Label>
                <Input
                    id="name"
                    name="name"
                    value={values.name}
                    placeholder="Acme Studio"
                    autoComplete="organization"
                    onChange={(event) => onChange('name', event.target.value)}
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <ColorField
                    id="primary_color"
                    label="Primary"
                    value={values.primary_color}
                    error={errors.primary_color}
                    onChange={(value) => onChange('primary_color', value)}
                />
                <ColorField
                    id="secondary_color"
                    label="Secondary"
                    value={values.secondary_color}
                    error={errors.secondary_color}
                    onChange={(value) => onChange('secondary_color', value)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                    id="logo_url"
                    name="logo_url"
                    type="url"
                    value={values.logo_url}
                    placeholder="https://cdn.example.com/logo.svg"
                    onChange={(event) =>
                        onChange('logo_url', event.target.value)
                    }
                />
                <InputError message={errors.logo_url} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="default_font">Default font</Label>
                <Input
                    id="default_font"
                    name="default_font"
                    value={values.default_font}
                    placeholder="Montserrat"
                    onChange={(event) =>
                        onChange('default_font', event.target.value)
                    }
                />
                <InputError message={errors.default_font} />
            </div>
        </div>
    );
}
