import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { MobileSettingsMenu } from '@/components/settings/mobile-settings-menu';
import { Button } from '@/components/ui/button';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

export default function SettingsIndex() {
    return (
        <>
            <Head title="Settings" />
            <h1 className="sr-only">Settings</h1>

            <MobileSettingsMenu />

            <div className="hidden px-4 py-6 md:block">
                <Heading
                    title="Settings"
                    description="Manage your profile, security, and appearance"
                />
                <div className="mt-6 flex max-w-md flex-col gap-2">
                    <Button variant="outline" asChild className="justify-start">
                        <Link href={editProfile()}>Profile</Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start">
                        <Link href={editSecurity()}>Security</Link>
                    </Button>
                    <Button variant="outline" asChild className="justify-start">
                        <Link href={editAppearance()}>Appearance</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Settings',
            href: '/settings',
        },
    ],
};
