import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import {
    buildActivityLogQuery,
    type ActivityLogPerPage,
} from '@/lib/activity-log-query';
import type { ActivityLogFilters } from '@/types/activity-log';

type UseActivityLogsQueryArgs = {
    filters: ActivityLogFilters;
};

export function useActivityLogsQuery({ filters }: UseActivityLogsQueryArgs) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [module, setModule] = useState(filters.module ?? '');
    const [action, setAction] = useState(filters.action ?? '');
    const [perPage, setPerPage] = useState<ActivityLogPerPage>(
        filters.per_page,
    );
    const skipFetchRef = useRef(false);
    const debounceRef = useRef<number | null>(null);
    const isFirstRenderRef = useRef(true);

    useEffect(() => {
        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }

        skipFetchRef.current = true;
        setSearch(filters.search ?? '');
        setModule(filters.module ?? '');
        setAction(filters.action ?? '');
        setPerPage(filters.per_page);
    }, [filters.search, filters.module, filters.action, filters.per_page]);

    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;

            return;
        }

        if (skipFetchRef.current) {
            skipFetchRef.current = false;

            return;
        }

        debounceRef.current = window.setTimeout(() => {
            debounceRef.current = null;
            router.get(
                '/activity-logs',
                buildActivityLogQuery({
                    search,
                    module,
                    action,
                    perPage,
                    page: 1,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['logs', 'filters'],
                },
            );
        }, 300);

        return () => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [search, module, action, perPage]);

    return {
        search,
        module,
        action,
        perPage,
        setSearch,
        setModule,
        setAction,
    };
}
