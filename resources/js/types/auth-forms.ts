import type { ReactNode } from 'react';
import type { PasswordValidationState } from '@/lib/password-rules';

export const DEMO_LOGIN = {
    email: 'demo@brandvault.dev',
    password: 'Demo1234!',
} as const;

export type LoginPageProps = {
    status?: string;
    canResetPassword?: boolean;
};

export type SecurityPageProps = Record<string, never>;

export type RegisterFormProps = {
    className?: string;
};

export type LoginFormProps = {
    className?: string;
    status?: string;
};

export type AuthSplitShellProps = {
    children: ReactNode;
    panelTitle: string;
    panelSubtitle: string;
};

export type RegisterFieldsProps = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    errors: Partial<Record<string, string>>;
    passwordValidation: PasswordValidationState;
    onChange: (field: string, value: string) => void;
};
