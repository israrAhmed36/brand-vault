import type { Folder, FolderTreeNode } from '@/types/folder';
import { FOLDER_MAX_DEPTH } from '@/lib/folder-depth';

export function buildFolderTree(folders: Folder[]): FolderTreeNode[] {
    const nodes = new Map<number, FolderTreeNode>();

    for (const folder of folders) {
        nodes.set(folder.id, { ...folder, children: [] });
    }

    const roots: FolderTreeNode[] = [];

    for (const node of nodes.values()) {
        if (node.parent_id !== null && nodes.has(node.parent_id)) {
            nodes.get(node.parent_id)?.children.push(node);
        } else {
            roots.push(node);
        }
    }

    const sortNodes = (list: FolderTreeNode[]) => {
        list.sort((a, b) => a.name.localeCompare(b.name));
        list.forEach((node) => sortNodes(node.children));
    };

    sortNodes(roots);

    return roots;
}

export function collectDescendantIds(
    folders: Folder[],
    folderId: number,
): Set<number> {
    const ids = new Set<number>([folderId]);
    let grew = true;

    while (grew) {
        grew = false;

        for (const folder of folders) {
            if (
                folder.parent_id !== null &&
                ids.has(folder.parent_id) &&
                !ids.has(folder.id)
            ) {
                ids.add(folder.id);
                grew = true;
            }
        }
    }

    return ids;
}

export function canMoveFolder(
    folders: Folder[],
    folderId: number,
    newParentId: number | null,
): boolean {
    const folder = folders.find((item) => item.id === folderId);

    if (!folder) {
        return false;
    }

    if (folder.parent_id === newParentId) {
        return false;
    }

    if (newParentId === folderId) {
        return false;
    }

    if (folder.parent_id === null && newParentId !== null) {
        const rootCount = folders.filter(
            (item) => item.parent_id === null,
        ).length;

        if (rootCount <= 1) {
            return false;
        }
    }

    let newDepth = 0;

    if (newParentId !== null) {
        const blocked = collectDescendantIds(folders, folderId);

        if (blocked.has(newParentId)) {
            return false;
        }

        const parent = folders.find((item) => item.id === newParentId);

        if (!parent) {
            return false;
        }

        newDepth = parent.depth + 1;
    }

    const subtreeSpan = Math.max(
        ...[...collectDescendantIds(folders, folderId)].map((id) => {
            const node = folders.find((item) => item.id === id);

            return node ? node.depth - folder.depth : 0;
        }),
        0,
    );

    return newDepth + subtreeSpan <= FOLDER_MAX_DEPTH;
}
