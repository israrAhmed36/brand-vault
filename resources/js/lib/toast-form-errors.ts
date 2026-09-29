import { toast } from 'sonner';

export function toastFormErrors(errors: Partial<Record<string, string>>): void {
    const message = Object.values(errors).find(
        (value): value is string => typeof value === 'string' && value !== '',
    );

    if (message) {
        toast.error(message);
    }
}
