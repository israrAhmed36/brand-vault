import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export function useAssetsFiltering() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const offStart = router.on('start', (event) => {
            const only = event.detail.visit.only ?? [];

            if (!only.includes('assets')) {
                return;
            }

            setError(null);
            setIsLoading(true);
        });
        const offFinish = router.on('finish', () => {
            setIsLoading(false);
        });
        const offNetwork = router.on('networkError', () => {
            setError('Network error. Check your connection and try again.');
            setIsLoading(false);
        });
        const offHttp = router.on('httpException', () => {
            setError('Something went wrong. Try again.');
            setIsLoading(false);
        });

        return () => {
            offStart();
            offFinish();
            offNetwork();
            offHttp();
        };
    }, []);

    return { isLoading, error };
}
