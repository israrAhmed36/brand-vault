export const ASSET_DRAG_MIME = 'application/x-bv-asset';

export function setAssetDragData(
    dataTransfer: DataTransfer,
    assetId: number,
): void {
    dataTransfer.setData(ASSET_DRAG_MIME, String(assetId));
    dataTransfer.effectAllowed = 'move';
}

export function isAssetDrag(dataTransfer: DataTransfer): boolean {
    return Array.from(dataTransfer.types).includes(ASSET_DRAG_MIME);
}

export function readAssetDragId(dataTransfer: DataTransfer): number | null {
    const raw = dataTransfer.getData(ASSET_DRAG_MIME);
    const assetId = Number(raw);

    return Number.isFinite(assetId) && assetId > 0 ? assetId : null;
}
