import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { RegisterFields } from '@/components/auth/register-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { usePasswordValidation } from '@/hooks/use-password-validation';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { RegisterFormProps } from '@/types/auth-forms';

export function RegisterForm({ className }: RegisterFormProps) {
    const form = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const passwordValidation = usePasswordValidation(
        form.data.password,
        form.data.password_confirmation,
    );

    const canSubmit =
        passwordValidation.isPasswordValid &&
        passwordValidation.isConfirmationValid &&
        form.data.name.trim() !== '' &&
        form.data.email.trim() !== '';

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        form.post(store.url(), { preserveScroll: true });
    }

    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Create your account
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                    Enter your details below to get started
                </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
                <RegisterFields
                    name={form.data.name}
                    email={form.data.email}
                    password={form.data.password}
                    passwordConfirmation={form.data.password_confirmation}
                    errors={form.errors}
                    passwordValidation={passwordValidation}
                    onChange={(field, value) =>
                        form.setData(field as keyof typeof form.data, value)
                    }
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.processing || !canSubmit}
                    data-test="register-user-button"
                >
                    {form.processing ? <Spinner /> : null}
                    Create account
                </Button>
            </form>

            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href={login()} className="underline underline-offset-4">
                    Login
                </Link>
            </div>
        </div>
    );
}
