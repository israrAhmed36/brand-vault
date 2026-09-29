export type Brand = {
    id: number;
    user_id: number;
    name: string;
    primary_color: string;
    secondary_color: string;
    logo_url: string | null;
    default_font: string | null;
    created_at: string;
    updated_at: string;
};

export type BrandEditPageProps = {
    brand: Brand | null;
};

export type BrandFormValues = {
    name: string;
    primary_color: string;
    secondary_color: string;
    logo_url: string;
    default_font: string;
};

export type ColorFieldProps = {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
};

export type ColorSwatchProps = {
    label: string;
    hex: string;
    className?: string;
};

export type BrandLogoMarkProps = {
    name: string;
    logoUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    size?: 'sm' | 'md';
};

export type PendingBrandLogo = {
    key: string;
    file: File;
    previewUrl: string;
};

export type BrandFormFieldsProps = {
    values: BrandFormValues;
    errors: Partial<Record<keyof BrandFormValues, string>>;
    logoPreviewUrl: string;
    hasPendingLogo: boolean;
    onChange: (field: keyof BrandFormValues, value: string) => void;
    onLogoFileSelected: (file: File) => void;
    onLogoClear: () => void;
};

export type BrandFormSheetProps = {
    brand: Brand | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export type BrandKitPreviewProps = {
    brand: Brand;
    onEdit: () => void;
    onDeleteRequest: () => void;
    isDeleting: boolean;
};

export type BrandDeleteDialogProps = {
    brandName: string;
    open: boolean;
    isDeleting: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

export type LogoDropzoneProps = {
    previewUrl: string;
    hasPendingFile?: boolean;
    error?: string;
    disabled?: boolean;
    onFileSelected: (file: File) => void;
    onClear: () => void;
};

export type BrandEmptyStateProps = {
    onCreate: () => void;
};
