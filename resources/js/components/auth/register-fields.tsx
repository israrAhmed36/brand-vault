import InputError from '@/components/input-error';
import { NewPasswordFields } from '@/components/password/new-password-fields';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RegisterFieldsProps } from '@/types/auth-forms';

export function RegisterFields({
    name,
    email,
    password,
    passwordConfirmation,
    errors,
    passwordValidation,
    onChange,
}: RegisterFieldsProps) {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    required
                    autoFocus
                    autoComplete="name"
                    placeholder="Full name"
                    value={name}
                    onChange={(event) => onChange('name', event.target.value)}
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(event) => onChange('email', event.target.value)}
                />
                <InputError message={errors.email} />
            </div>

            <NewPasswordFields
                password={password}
                passwordConfirmation={passwordConfirmation}
                passwordValidation={passwordValidation}
                errors={errors}
                onChange={(field, value) => onChange(field, value)}
            />
        </>
    );
}
