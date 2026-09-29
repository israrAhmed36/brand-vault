export type TrashAssetSelection = {
    selectedIds: Set<number>;
    selectedCount: number;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    toggle: (assetId: number) => void;
    selectAll: () => void;
    clearSelection: () => void;
    isSelected: (assetId: number) => boolean;
    groupCheckboxState: (assetIds: number[]) => boolean | 'indeterminate';
    setGroupSelected: (assetIds: number[], selected: boolean) => void;
};

export type TrashBulkToolbarProps = {
    selectedCount: number;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    onSelectAllChange: (selectAll: boolean) => void;
    onRestore: () => void;
    onForceDelete: () => void;
};
