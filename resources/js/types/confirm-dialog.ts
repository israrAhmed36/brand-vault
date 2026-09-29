import type { ReactNode } from 'react';

export type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: ReactNode;
    confirmLabel: string;
    pendingLabel?: string;
    cancelLabel?: string;
    isPending?: boolean;
    confirmDisabled?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    children?: ReactNode;
};
