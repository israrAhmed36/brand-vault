import { useEffect, useMemo, useState } from 'react';
import {
    applyTrashGroupSelection,
    trashGroupCheckboxState,
} from '@/lib/trash-selection-state';
import type { Asset } from '@/types/asset';
import type { TrashAssetSelection } from '@/types/trash-selection';

export function useTrashAssetSelection(assets: Asset[]): TrashAssetSelection {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(
        () => new Set(),
    );
    const visibleIds = useMemo(() => assets.map((asset) => asset.id), [assets]);

    useEffect(() => {
        setSelectedIds((previous) => {
            const visible = new Set(visibleIds);
            const next = new Set([...previous].filter((id) => visible.has(id)));

            return next.size === previous.size ? previous : next;
        });
    }, [visibleIds]);

    const isAllSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
    const isIndeterminate =
        !isAllSelected && visibleIds.some((id) => selectedIds.has(id));

    function toggle(assetId: number) {
        setSelectedIds((previous) => {
            const next = new Set(previous);

            if (next.has(assetId)) {
                next.delete(assetId);
            } else {
                next.add(assetId);
            }

            return next;
        });
    }

    function selectAll() {
        setSelectedIds(new Set(visibleIds));
    }

    function clearSelection() {
        setSelectedIds(new Set());
    }

    function groupCheckboxState(assetIds: number[]) {
        return trashGroupCheckboxState(assetIds, selectedIds);
    }

    function setGroupSelected(assetIds: number[], selected: boolean) {
        setSelectedIds((previous) =>
            applyTrashGroupSelection(previous, assetIds, selected),
        );
    }

    return {
        selectedIds,
        selectedCount: selectedIds.size,
        isAllSelected,
        isIndeterminate,
        toggle,
        selectAll,
        clearSelection,
        isSelected: (assetId: number) => selectedIds.has(assetId),
        groupCheckboxState,
        setGroupSelected,
    };
}
