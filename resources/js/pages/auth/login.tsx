import { Head } from '@inertiajs/react';
import { AppSplashScreen } from '@/components/app-splash-screen';
import { AuthSplitShell } from '@/components/auth/auth-split-shell';
import { LoginForm } from '@/components/auth/login-form';
import type { LoginPageProps } from '@/types/auth-forms';

export default function Login({ status }: LoginPageProps) {
    return (
        <>
            <Head title="Log in" />
            <AppSplashScreen />
            <AuthSplitShell
                panelTitle="Your brand assets, organised."
                panelSubtitle="Sign in to manage folders, assets, and AI-assisted tagging for your workspace."
            >
                <LoginForm status={status} />
            </AuthSplitShell>
        </>
    );
}

Login.layout = null;
