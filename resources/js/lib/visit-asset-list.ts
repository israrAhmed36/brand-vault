import { router } from '@inertiajs/react';
import type { AssetFilters } from '@/types/asset';

export type AssetListCancelToken = { cancel: () => void };

export function visitAssetList(args: {
    listPath: string;
    search: string;
    sort: AssetFilters['sort'];
    addedOn: string;
    cancelTokenRef: { current: AssetListCancelToken | null };
}): void {
    args.cancelTokenRef.current?.cancel();

    router.get(
        args.listPath,
        {
            search: args.search.trim() !== '' ? args.search.trim() : undefined,
            sort: args.sort,
            added_on: args.addedOn !== '' ? args.addedOn : undefined,
            page: 1,
        },
        {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['assets', 'filters'],
            async: true,
            showProgress: false,
            onCancelToken: (token) => {
                args.cancelTokenRef.current = token;
            },
        },
    );
}
