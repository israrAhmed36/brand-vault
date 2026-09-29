import type { Ref } from 'react';
import type {
    PasswordRuleResult,
    PasswordValidationState,
} from '@/lib/password-rules';

export type PasswordRequirementsProps = {
    rules: PasswordRuleResult[];
    hasStartedTyping: boolean;
};

export type PasswordMatchStatusProps = {
    showConfirmationError: boolean;
    isConfirmationValid: boolean;
};

export type NewPasswordFieldsProps = {
    password: string;
    passwordConfirmation: string;
    passwordValidation: PasswordValidationState;
    errors: Partial<Record<string, string>>;
    passwordLabel?: string;
    confirmationLabel?: string;
    passwordPlaceholder?: string;
    confirmationPlaceholder?: string;
    passwordRef?: Ref<HTMLInputElement>;
    onChange: (
        field: 'password' | 'password_confirmation',
        value: string,
    ) => void;
};
