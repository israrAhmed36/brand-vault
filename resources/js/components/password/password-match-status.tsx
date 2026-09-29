import type { PasswordMatchStatusProps } from '@/types/password';

export function PasswordMatchStatus({
    showConfirmationError,
    isConfirmationValid,
}: PasswordMatchStatusProps) {
    if (showConfirmationError) {
        return (
            <p className="text-sm text-destructive">Passwords do not match</p>
        );
    }

    if (isConfirmationValid) {
        return (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Passwords match
            </p>
        );
    }

    return null;
}
