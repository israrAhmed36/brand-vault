export const ASSET_INDEX_PARTIAL = [
    'assets',
    'folders',
    'folderOptions',
    'breadcrumbs',
    'currentFolder',
    'filters',
] as const;

export const assetIndexVisit = {
    preserveScroll: true,
    preserveState: true,
    only: [...ASSET_INDEX_PARTIAL],
};
