import { Form, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { register } from '@/routes';
import { demo as storeDemoLogin, store as storeLogin } from '@/routes/login';
import type { LoginFormProps } from '@/types/auth-forms';

export function LoginForm({ className, status }: LoginFormProps) {
    return (
        <div className={cn('flex flex-col gap-6', className)}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Login to your account
                </h1>
                <p className="text-sm text-balance text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>

            {status ? (
                <p className="text-center text-sm font-medium text-green-600">
                    {status}
                </p>
            ) : null}

            <Form
                {...storeLogin.form()}
                resetOnSuccess={['password']}
                className="grid gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="email"
                                placeholder="m@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoComplete="current-password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="remember" name="remember" />
                            <Label htmlFor="remember" className="font-normal">
                                Remember me
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing ? <Spinner /> : null}
                            Login
                        </Button>
                    </>
                )}
            </Form>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>

            <Form {...storeDemoLogin.form()}>
                {({ processing }) => (
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                        disabled={processing}
                        data-test="demo-login-button"
                    >
                        {processing ? <Spinner /> : null}
                        Continue as Demo
                    </Button>
                )}
            </Form>

            <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                    href={register()}
                    className="underline underline-offset-4"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
