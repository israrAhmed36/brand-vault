import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { PasswordMatchStatus } from '@/components/password/password-match-status';
import { PasswordRequirements } from '@/components/password/password-requirements';
import { Label } from '@/components/ui/label';
import type { NewPasswordFieldsProps } from '@/types/password';

export function NewPasswordFields({
    password,
    passwordConfirmation,
    passwordValidation,
    errors,
    passwordLabel = 'Password',
    confirmationLabel = 'Confirm password',
    passwordPlaceholder,
    confirmationPlaceholder,
    passwordRef,
    onChange,
}: NewPasswordFieldsProps) {
    return (
        <>
            <div className="grid gap-3">
                <Label htmlFor="password">{passwordLabel}</Label>
                <PasswordInput
                    id="password"
                    name="password"
                    required
                    ref={passwordRef}
                    autoComplete="new-password"
                    placeholder={passwordPlaceholder}
                    value={password}
                    onChange={(event) =>
                        onChange('password', event.target.value)
                    }
                />
                <PasswordRequirements
                    rules={passwordValidation.rules}
                    hasStartedTyping={password.length > 0}
                />
                <InputError message={errors.password} />
            </div>

            <div className="grid gap-3">
                <Label htmlFor="password_confirmation">
                    {confirmationLabel}
                </Label>
                <PasswordInput
                    id="password_confirmation"
                    name="password_confirmation"
                    required
                    autoComplete="new-password"
                    placeholder={confirmationPlaceholder}
                    value={passwordConfirmation}
                    onChange={(event) =>
                        onChange('password_confirmation', event.target.value)
                    }
                />
                <PasswordMatchStatus
                    showConfirmationError={
                        passwordValidation.showConfirmationError
                    }
                    isConfirmationValid={passwordValidation.isConfirmationValid}
                />
                <InputError message={errors.password_confirmation} />
            </div>
        </>
    );
}
