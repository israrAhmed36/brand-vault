import { Head, usePage } from '@inertiajs/react';
import { DashboardBrandWidget } from '@/components/dashboard/dashboard-brand-widget';
import { DashboardQuickActions } from '@/components/dashboard/dashboard-quick-actions';
import { DashboardRecentActivity } from '@/components/dashboard/dashboard-recent-activity';
import { DashboardRecentAssets } from '@/components/dashboard/dashboard-recent-assets';
import { DashboardStatCards } from '@/components/dashboard/dashboard-stat-cards';
import { DashboardTypeBreakdown } from '@/components/dashboard/dashboard-type-breakdown';
import { dashboard } from '@/routes';
import type { DashboardPageProps } from '@/types/dashboard';

export default function Dashboard() {
    const { auth, stats, assetTypes, brand, recentAssets, recentActivity } =
        usePage<DashboardPageProps>().props;
    const firstName = auth.user?.name.trim().split(/\s+/)[0] || 'there';

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome back, {firstName}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Your brand kit, asset library, and recent workspace
                        activity at a glance.
                    </p>
                </header>

                <DashboardStatCards stats={stats} />
                <DashboardQuickActions
                    hasBrand={brand !== null}
                    assetCount={stats.assets}
                />

                <div className="grid gap-4 lg:grid-cols-2">
                    <DashboardBrandWidget brand={brand} />
                    <DashboardTypeBreakdown
                        assetTypes={assetTypes}
                        totalAssets={stats.assets}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <DashboardRecentAssets assets={recentAssets} />
                    <DashboardRecentActivity logs={recentActivity} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
