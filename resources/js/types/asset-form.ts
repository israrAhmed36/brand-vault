import type { Asset, AssetType, FolderOption } from '@/types/asset';

export type PendingAssetFile = {
    key: string;
    file: File;
    previewUrl: string | null;
};

export type AssetFormValues = {
    name: string;
    type: AssetType;
    url: string;
    folder_id: number | null;
};

export type AssetFormSheetProps = {
    open: boolean;
    asset: Asset | null;
    folderId: number | null;
    folderOptions: FolderOption[];
    onOpenChange: (open: boolean) => void;
};

export type AssetFormFieldsProps = {
    data: AssetFormValues;
    folderOptions: FolderOption[];
    files: PendingAssetFile[];
    allowMultiple: boolean;
    fileError?: string;
    errors?: Partial<Record<keyof AssetFormValues, string>>;
    onChange: <K extends keyof AssetFormValues>(
        key: K,
        value: AssetFormValues[K],
    ) => void;
    onFilesAdded: (files: File[]) => void;
    onRemoveFile: (key: string) => void;
};

export type AssetUploadPreviewProps = {
    url: string;
    disabled?: boolean;
    onClear: () => void;
};

export type AssetDropzoneProps = {
    files: PendingAssetFile[];
    existingUrl: string;
    error?: string;
    disabled?: boolean;
    allowMultiple?: boolean;
    onFilesAdded: (files: File[]) => void;
    onRemoveFile: (key: string) => void;
    onClearExisting: () => void;
};

export type AssetNameFieldProps = {
    name: string;
    usesFileNames: boolean;
    error?: string;
    onChange: (name: string) => void;
};

export type AssetFileListProps = {
    files: PendingAssetFile[];
    disabled?: boolean;
    allowMultiple?: boolean;
    onRemove: (key: string) => void;
    onAddMore: () => void;
};
