import { useMemo } from 'react';
import {
    getPasswordValidationState,
    type PasswordValidationState,
} from '@/lib/password-rules';

export function usePasswordValidation(
    password: string,
    passwordConfirmation: string,
): PasswordValidationState {
    return useMemo(
        () => getPasswordValidationState(password, passwordConfirmation),
        [password, passwordConfirmation],
    );
}
