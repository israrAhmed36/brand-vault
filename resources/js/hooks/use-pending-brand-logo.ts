import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    createPendingBrandLogo,
    revokePendingBrandLogo,
    validateBrandLogoFile,
} from '@/lib/pending-brand-logo';
import type { PendingBrandLogo } from '@/types/brand';

export function usePendingBrandLogo(isOpen: boolean) {
    const [pending, setPending] = useState<PendingBrandLogo | null>(null);
    const pendingRef = useRef(pending);
    pendingRef.current = pending;

    useEffect(() => {
        setPending((current) => {
            revokePendingBrandLogo(current);

            return null;
        });
    }, [isOpen]);

    useEffect(
        () => () => {
            revokePendingBrandLogo(pendingRef.current);
        },
        [],
    );

    function selectFile(file: File): void {
        const validationError = validateBrandLogoFile(file);

        if (validationError !== null) {
            toast.error(validationError);

            return;
        }

        setPending((current) => {
            revokePendingBrandLogo(current);

            return createPendingBrandLogo(file);
        });
    }

    function clear(): void {
        setPending((current) => {
            revokePendingBrandLogo(current);

            return null;
        });
    }

    return { pending, selectFile, clear };
}
