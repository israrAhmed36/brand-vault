import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { AssetFilters } from '@/types/asset';

type UseAssetsListQueryArgs = {
    listPath: string;
    filters: AssetFilters;
    syncKey: string | number;
};

export function useAssetsListQuery({
    listPath,
    filters,
    syncKey,
}: UseAssetsListQueryArgs) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [sort, setSort] = useState(filters.sort);
    const listPathRef = useRef(listPath);
    const skipFetchRef = useRef(false);
    const debounceRef = useRef<number | null>(null);
    const isFirstRenderRef = useRef(true);

    listPathRef.current = listPath;

    useEffect(() => {
        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        setSearch((currentSearch) => {
            const nextSearch = filters.search ?? '';

            if (currentSearch === nextSearch) {
                return currentSearch;
            }

            skipFetchRef.current = true;

            return nextSearch;
        });
        setSort((currentSort) => {
            if (currentSort === filters.sort) {
                return currentSort;
            }

            skipFetchRef.current = true;

            return filters.sort;
        });
    }, [syncKey, filters.search, filters.sort]);

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;

            return;
        }

        if (skipFetchRef.current) {
            skipFetchRef.current = false;

            return;
        }

        const trimmedSearch = search.trim();

        debounceRef.current = window.setTimeout(() => {
            debounceRef.current = null;
            router.get(
                listPathRef.current,
                {
                    search: trimmedSearch !== '' ? trimmedSearch : undefined,
                    sort,
                    page: 1,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['assets', 'filters'],
                },
            );
        }, 300);

        return () => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [search, sort]);

    return { search, sort, setSearch, setSort };
}
