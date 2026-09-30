import { FolderOpen, LayoutGrid, Settings2, SwatchBook } from 'lucide-react';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

/** Matches bottom nav bar + safe-area clearance used in layout padding. */
export const MOBILE_BOTTOM_NAV_OFFSET =
    'calc(4.5rem + env(safe-area-inset-bottom, 0px))';

export const MOBILE_BOTTOM_NAV_ITEMS: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Brand Kit',
        href: '/brand',
        icon: SwatchBook,
    },
    {
        title: 'Assets',
        href: '/assets',
        icon: FolderOpen,
        match: ['/assets', '/trash'],
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings2,
        match: ['/settings'],
    },
];
