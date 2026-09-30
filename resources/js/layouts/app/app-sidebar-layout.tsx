import type { CSSProperties } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { MOBILE_BOTTOM_NAV_OFFSET } from '@/lib/mobile-bottom-nav';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="flex h-dvh max-h-dvh min-h-0 min-w-0 flex-col overflow-x-clip overflow-y-hidden pb-[var(--mobile-bottom-nav-offset)] md:h-auto md:max-h-none md:min-h-svh md:overflow-y-visible md:pb-0"
                style={
                    {
                        '--mobile-bottom-nav-offset': MOBILE_BOTTOM_NAV_OFFSET,
                    } as CSSProperties
                }
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:overflow-visible">
                    {children}
                </div>
            </AppContent>
            <MobileBottomNav />
        </AppShell>
    );
}
