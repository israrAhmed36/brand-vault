import type { Folder, FolderBreadcrumb, FolderOption } from '@/types/folder';
import type { TrashAssetSelection } from '@/types/trash-selection';

export type { TrashAssetSelection } from '@/types/trash-selection';

export type { FolderOption };

export type AssetType = 'image' | 'video' | 'document' | 'link' | 'other';

export type Asset = {
    id: number;
    user_id: number;
    folder_id: number | null;
    name: string;
    type: AssetType;
    url: string;
    tags: string[] | null;
    ai_description: string | null;
    ai_usage_suggestion: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};

export type AssetPaginator = {
    data: Asset[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export type AssetFilters = {
    search: string | null;
    sort: 'updated_desc' | 'name_asc';
    added_on: string | null;
};

export type AssetsIndexPageProps = {
    assets: AssetPaginator;
    folders: Folder[];
    folderOptions: FolderOption[];
    breadcrumbs: FolderBreadcrumb[];
    currentFolder: Folder | null;
    filters: AssetFilters;
    counts: { assets: number; trash: number };
};

export type AssetsTrashPageProps = {
    assets: AssetPaginator;
    filters: AssetFilters;
    counts: { assets: number; trash: number };
};

export type AssetTableProps = {
    assets: Asset[];
    isLoading?: boolean;
    showRestore?: boolean;
    searchQuery?: string | null;
    onEdit?: (asset: Asset) => void;
    onDelete?: (asset: Asset) => void;
    onMove?: (asset: Asset) => void;
    onGenerateTags?: (asset: Asset) => void;
    onRestore?: (asset: Asset) => void;
    onForceDelete?: (asset: Asset) => void;
    trashSelection?: TrashAssetSelection;
    onBulkRestoreSelected?: () => void;
    onBulkForceDeleteSelected?: () => void;
};

export type AssetCardProps = Pick<
    AssetTableProps,
    | 'showRestore'
    | 'onEdit'
    | 'onDelete'
    | 'onMove'
    | 'onGenerateTags'
    | 'onRestore'
    | 'onForceDelete'
    | 'trashSelection'
> & {
    asset: Asset;
};

export type AssetMoveDialogProps = {
    open: boolean;
    asset: Asset | null;
    folderOptions: FolderOption[];
    onOpenChange: (open: boolean) => void;
};

export type AssetMoveFolderListProps = {
    options: FolderOption[];
    selectedFolderId: number | null;
    currentFolderId: number | null;
    onSelect: (folderId: number | null) => void;
};

export type AssetTypeBadgeProps = {
    type: AssetType;
    overlay?: boolean;
};

export type AssetTypeSectionProps = Pick<
    AssetTableProps,
    | 'showRestore'
    | 'onEdit'
    | 'onDelete'
    | 'onMove'
    | 'onGenerateTags'
    | 'onRestore'
    | 'onForceDelete'
    | 'trashSelection'
> & {
    type: AssetType;
    assets: Asset[];
};

export type SearchSortBarProps = {
    search: string;
    sort: AssetFilters['sort'];
    addedOn: string;
    onSearchChange: (value: string) => void;
    onSortChange: (value: AssetFilters['sort']) => void;
    onAddedOnChange: (value: string) => void;
};

export type AssetsLibraryTab = 'assets' | 'trash';

export type AssetsLibraryTabsProps = { active: AssetsLibraryTab };

export type AssetsPageHeaderProps = {
    activeTab: AssetsLibraryTab;
    breadcrumbs?: FolderBreadcrumb[];
    onAddAsset?: () => void;
};
