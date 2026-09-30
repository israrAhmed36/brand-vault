import { Link } from '@inertiajs/react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { MOBILE_BOTTOM_NAV_ITEMS } from '@/lib/mobile-bottom-nav';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

function isNavItemActive(
    item: NavItem,
    isCurrentUrl: (href: NavItem['href']) => boolean,
    isCurrentOrParentUrl: (href: string) => boolean,
): boolean {
    if (item.match && item.match.length > 0) {
        return item.match.some((prefix) => isCurrentOrParentUrl(prefix));
    }

    return isCurrentUrl(item.href);
}

export function MobileBottomNav() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 backdrop-blur-xl md:hidden"
            style={{
                paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
            }}
        >
            <ul className="mx-auto grid h-16 max-w-lg grid-cols-4 px-2">
                {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
                    const active = isNavItemActive(
                        item,
                        isCurrentUrl,
                        isCurrentOrParentUrl,
                    );
                    const Icon = item.icon;

                    return (
                        <li key={item.title} className="min-w-0">
                            <Link
                                href={toUrl(item.href)}
                                prefetch
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'flex h-full flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition-colors',
                                    active
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex size-9 items-center justify-center rounded-2xl transition-colors',
                                        active
                                            ? 'bg-foreground text-background'
                                            : 'bg-transparent',
                                    )}
                                >
                                    {Icon ? <Icon className="size-5" /> : null}
                                </span>
                                <span className="truncate">{item.title}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
