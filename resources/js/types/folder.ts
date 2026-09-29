export type Folder = {
    id: number;
    user_id: number;
    parent_id: number | null;
    name: string;
    depth: number;
    assets_count?: number;
    created_at: string;
    updated_at: string;
};

export type FolderTreeNode = Folder & {
    children: FolderTreeNode[];
};

export type FolderBreadcrumb = {
    id: number;
    name: string;
};

export type FolderOption = {
    id: number | null;
    label: string;
};

export type FolderComboboxProps = {
    value: number | null;
    options: FolderOption[];
    onChange: (folderId: number | null) => void;
    className?: string;
};

export type FolderFormValues = {
    name: string;
    parent_id: number | null;
};

export type FolderFormSheetProps = {
    open: boolean;
    parentId: number | null;
    parentName?: string | null;
    folder: Folder | null;
    onOpenChange: (open: boolean) => void;
};

export type FolderAssetCountBadgeProps = {
    count?: number;
    className?: string;
};

export type FolderTreeActionsProps = {
    folder: Folder;
    onRename: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
    onCreateChild?: (folder: Folder) => void;
};

export type FolderTreeProps = {
    folders: Folder[];
    currentFolderId: number | null;
    onCreateParent: () => void;
    onCreateChild: (folder: Folder) => void;
    onRename: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
    onMove: (folderId: number, parentId: number | null) => void;
    onAssetDrop?: (assetId: number, folderId: number | null) => void;
};

export type FolderTreeNodeRowProps = {
    node: FolderTreeNode;
    folders: Folder[];
    currentFolderId: number | null;
    draggingId: number | null;
    onRename: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
    onCreateChild: (folder: Folder) => void;
    onDragStart: (folderId: number) => void;
    onDragEnd: () => void;
    onDropOnFolder: (targetId: number) => void;
    onAssetDrop?: (assetId: number, folderId: number | null) => void;
};
