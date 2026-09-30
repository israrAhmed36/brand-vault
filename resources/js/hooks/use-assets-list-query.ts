import { useEffect, useRef, useState } from 'react';
import {
    visitAssetList,
    type AssetListCancelToken,
} from '@/lib/visit-asset-list';
import type { AssetFilters } from '@/types/asset';

type UseAssetsListQueryArgs = {
    listPath: string;
    filters: AssetFilters;
    syncKey: string | number;
};

type LocalFilters = {
    search: string;
    sort: AssetFilters['sort'];
    addedOn: string;
};

export function useAssetsListQuery({
    listPath,
    filters,
    syncKey,
}: UseAssetsListQueryArgs) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [sort, setSort] = useState(filters.sort);
    const [addedOn, setAddedOn] = useState(filters.added_on ?? '');
    const listPathRef = useRef(listPath);
    const skipFetchRef = useRef(false);
    const debounceRef = useRef<number | null>(null);
    const cancelTokenRef = useRef<AssetListCancelToken | null>(null);
    const isFirstRenderRef = useRef(true);
    const previousFiltersRef = useRef<LocalFilters>({
        search,
        sort,
        addedOn,
    });

    listPathRef.current = listPath;

    useEffect(() => {
        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        const nextSearch = filters.search ?? '';
        const nextAddedOn = filters.added_on ?? '';

        if (
            search !== nextSearch ||
            sort !== filters.sort ||
            addedOn !== nextAddedOn
        ) {
            skipFetchRef.current = true;
            setSearch(nextSearch);
            setSort(filters.sort);
            setAddedOn(nextAddedOn);
        }

        previousFiltersRef.current = {
            search: nextSearch,
            sort: filters.sort,
            addedOn: nextAddedOn,
        };
    }, [syncKey, filters.search, filters.sort, filters.added_on]);

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;

            return;
        }

        if (skipFetchRef.current) {
            skipFetchRef.current = false;
            previousFiltersRef.current = { search, sort, addedOn };

            return;
        }

        const previous = previousFiltersRef.current;
        const searchOnlyChanged =
            previous.search !== search &&
            previous.sort === sort &&
            previous.addedOn === addedOn;
        previousFiltersRef.current = { search, sort, addedOn };

        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(
            () => {
                debounceRef.current = null;
                visitAssetList({
                    listPath: listPathRef.current,
                    search,
                    sort,
                    addedOn,
                    cancelTokenRef,
                });
            },
            searchOnlyChanged ? 250 : 0,
        );

        return () => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [search, sort, addedOn]);

    useEffect(
        () => () => {
            cancelTokenRef.current?.cancel();
        },
        [],
    );

    return { search, sort, addedOn, setSearch, setSort, setAddedOn };
}
