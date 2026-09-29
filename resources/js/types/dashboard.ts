import type { ActivityLog } from '@/types/activity-log';
import type { Asset, AssetType } from '@/types/asset';
import type { Brand } from '@/types/brand';

export type DashboardStats = {
    assets: number;
    folders: number;
    trash: number;
    untagged: number;
};

export type DashboardAssetTypeCount = {
    type: AssetType;
    count: number;
};

export type DashboardPageProps = {
    stats: DashboardStats;
    assetTypes: DashboardAssetTypeCount[];
    brand: Brand | null;
    recentAssets: Asset[];
    recentActivity: ActivityLog[];
};

export type DashboardStatCardItem = {
    key: keyof DashboardStats;
    label: string;
    value: number;
    hint: string;
    href: string;
    icon: 'assets' | 'folders' | 'trash' | 'untagged';
};

export type DashboardStatCardsProps = {
    stats: DashboardStats;
};

export type DashboardBrandWidgetProps = {
    brand: Brand | null;
};

export type DashboardTypeBreakdownProps = {
    assetTypes: DashboardAssetTypeCount[];
    totalAssets: number;
};

export type DashboardRecentAssetsProps = {
    assets: Asset[];
};

export type DashboardRecentActivityProps = {
    logs: ActivityLog[];
};

export type DashboardQuickActionsProps = {
    hasBrand: boolean;
    assetCount: number;
};
