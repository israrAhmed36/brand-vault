/** Maximum folder depth index: 0 parent, 1 child, 2 grandchild (3 levels). */
export const FOLDER_MAX_DEPTH = 2;

export function canNestUnderFolder(parentDepth: number): boolean {
    return parentDepth + 1 <= FOLDER_MAX_DEPTH;
}

export function folderDepthLabel(): string {
    return 'Up to 3 levels (parent → child → subfolder)';
}
