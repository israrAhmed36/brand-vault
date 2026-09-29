import { Link } from '@inertiajs/react';
import { GalleryVerticalEnd } from 'lucide-react';
import { home } from '@/routes';
import type { AuthSplitShellProps } from '@/types/auth-forms';

export function AuthSplitShell({
    children,
    panelTitle,
    panelSubtitle,
}: AuthSplitShellProps) {
    return (
        <div className="grid min-h-svh w-full lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 font-medium"
                    >
                        <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </span>
                        BrandVault
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">{children}</div>
                </div>
            </div>

            <div className="relative hidden overflow-hidden bg-muted lg:block">
                <img
                    src="/images/auth-cover.svg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.35] dark:grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-3 p-10 text-white">
                    <p className="text-xs font-medium tracking-[0.18em] text-white/70 uppercase">
                        Brand kit workspace
                    </p>
                    <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance">
                        {panelTitle}
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed text-white/75">
                        {panelSubtitle}
                    </p>
                </div>
            </div>
        </div>
    );
}
