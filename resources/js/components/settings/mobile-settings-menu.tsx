import { Link, router, usePage } from '@inertiajs/react';
import { ChevronRight, LogOut, Moon, ScrollText, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';

const rowClassName =
    'flex w-full items-center gap-3 px-3.5 py-3.5 text-left text-sm font-medium transition-colors active:bg-muted/70';

export function MobileSettingsMenu() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    if (!auth.user) {
        return null;
    }

    return (
        <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-muted/30 md:hidden">
            <div className="space-y-5 px-4 pt-5 pb-8">
                <header className="space-y-1">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        Account
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        Settings
                    </h2>
                </header>

                <Link
                    href={editProfile()}
                    className="flex items-center gap-3.5 rounded-lg border border-border/80 bg-card p-3.5 shadow-xs transition-colors active:bg-muted/50"
                >
                    <Avatar className="size-14 overflow-hidden rounded-full shadow-sm ring-2 ring-background">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="bg-muted text-base font-semibold text-foreground">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold tracking-tight text-foreground">
                            {auth.user.name}
                        </p>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {auth.user.email}
                        </p>
                        <p className="mt-1.5 text-xs font-medium text-primary">
                            View profile
                        </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>

                <section className="overflow-hidden rounded-lg border border-border/80 bg-card shadow-xs">
                    <Link href="/activity-logs" className={rowClassName}>
                        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <ScrollText className="size-4" />
                        </span>
                        <span className="flex-1 text-foreground">
                            Activity log
                        </span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>

                    <div className="mx-3.5 h-px bg-border/80" />

                    <button
                        type="button"
                        onClick={() =>
                            updateAppearance(isDark ? 'light' : 'dark')
                        }
                        className={rowClassName}
                        aria-label={
                            isDark
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                    >
                        <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            {isDark ? (
                                <Sun className="size-4" />
                            ) : (
                                <Moon className="size-4" />
                            )}
                        </span>
                        <span className="flex-1 text-foreground">Theme</span>
                        <span
                            className={cn(
                                'rounded-md bg-muted px-2 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase',
                            )}
                        >
                            {isDark ? 'Dark' : 'Light'}
                        </span>
                    </button>
                </section>

                <Button
                    variant="destructive"
                    className="h-11 w-full rounded-lg text-sm font-semibold"
                    asChild
                >
                    <Link
                        href={logout()}
                        as="button"
                        onClick={() => router.flushAll()}
                        data-test="mobile-settings-logout"
                    >
                        <LogOut className="size-4" />
                        Sign out
                    </Link>
                </Button>
            </div>
        </div>
    );
}
