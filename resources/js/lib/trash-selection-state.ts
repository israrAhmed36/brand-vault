export type TrashGroupCheckboxState = boolean | 'indeterminate';

export function trashGroupCheckboxState(
    assetIds: number[],
    selectedIds: Set<number>,
): TrashGroupCheckboxState {
    if (assetIds.length === 0) {
        return false;
    }

    const selectedCount = assetIds.filter((id) => selectedIds.has(id)).length;

    if (selectedCount === 0) {
        return false;
    }

    if (selectedCount === assetIds.length) {
        return true;
    }

    return 'indeterminate';
}

export function applyTrashGroupSelection(
    previous: Set<number>,
    assetIds: number[],
    selectAllInGroup: boolean,
): Set<number> {
    const next = new Set(previous);

    for (const assetId of assetIds) {
        if (selectAllInGroup) {
            next.add(assetId);
        } else {
            next.delete(assetId);
        }
    }

    return next;
}
