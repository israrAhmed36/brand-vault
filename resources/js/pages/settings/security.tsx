import { Head, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import type { FormEvent } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { NewPasswordFields } from '@/components/password/new-password-fields';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePasswordValidation } from '@/hooks/use-password-validation';
import { edit } from '@/routes/security';

export default function Security() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const form = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const passwordValidation = usePasswordValidation(
        form.data.password,
        form.data.password_confirmation,
    );

    const canSubmit =
        form.data.current_password.trim() !== '' &&
        passwordValidation.isPasswordValid &&
        passwordValidation.isConfirmationValid;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        form.put(SecurityController.update.url(), {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: (errors) => {
                if (errors.password) {
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    currentPasswordInput.current?.focus();
                }
            },
        });
    }

    return (
        <>
            <Head title="Security settings" />

            <h1 className="sr-only">Security settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Update password"
                    description="Ensure your account is using a long, random password to stay secure"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-3">
                        <Label htmlFor="current_password">
                            Current password
                        </Label>
                        <PasswordInput
                            id="current_password"
                            ref={currentPasswordInput}
                            name="current_password"
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            placeholder="Current password"
                            value={form.data.current_password}
                            onChange={(event) =>
                                form.setData(
                                    'current_password',
                                    event.target.value,
                                )
                            }
                        />
                        <InputError message={form.errors.current_password} />
                    </div>

                    <NewPasswordFields
                        password={form.data.password}
                        passwordConfirmation={form.data.password_confirmation}
                        passwordValidation={passwordValidation}
                        errors={form.errors}
                        passwordLabel="New password"
                        passwordPlaceholder="New password"
                        confirmationPlaceholder="Confirm password"
                        passwordRef={passwordInput}
                        onChange={(field, value) => form.setData(field, value)}
                    />

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={form.processing || !canSubmit}
                            data-test="update-password-button"
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
