import { useState } from 'react';
import type { Folder } from '@/types/folder';

export function useFolderSheet(folders: Folder[]) {
    const [open, setOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
    const [createParentId, setCreateParentId] = useState<number | null>(null);

    const createParentName =
        createParentId === null
            ? null
            : (folders.find((folder) => folder.id === createParentId)?.name ??
              null);

    function openCreateParent() {
        setEditingFolder(null);
        setCreateParentId(null);
        setOpen(true);
    }

    function openCreateChild(folder: Folder) {
        setEditingFolder(null);
        setCreateParentId(folder.id);
        setOpen(true);
    }

    function openRename(folder: Folder) {
        setEditingFolder(folder);
        setCreateParentId(null);
        setOpen(true);
    }

    return {
        open,
        setOpen,
        editingFolder,
        createParentId,
        createParentName,
        openCreateParent,
        openCreateChild,
        openRename,
    };
}
