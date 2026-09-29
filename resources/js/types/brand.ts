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

export type BrandFormFieldsProps = {
    values: BrandFormValues;
    errors: Partial<Record<keyof BrandFormValues, string>>;
    onChange: (field: keyof BrandFormValues, value: string) => void;
};

export type BrandFormSheetProps = {
    brand: Brand | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export type BrandKitPreviewProps = {
    brand: Brand;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
};

export type BrandEmptyStateProps = {
    onCreate: () => void;
};
