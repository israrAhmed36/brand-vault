import { Head } from '@inertiajs/react';
import { AuthSplitShell } from '@/components/auth/auth-split-shell';
import { RegisterForm } from '@/components/auth/register-form';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <AuthSplitShell
                panelTitle="Set up BrandVault once."
                panelSubtitle="Create an account to keep brand colours, logos, and library assets in a single workspace."
            >
                <RegisterForm />
            </AuthSplitShell>
        </>
    );
}

Register.layout = null;
