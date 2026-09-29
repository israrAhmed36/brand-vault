export const ACTIVITY_LOG_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

export type ActivityLogPerPage = (typeof ACTIVITY_LOG_PER_PAGE_OPTIONS)[number];

export type ActivityLogQueryParams = {
    search?: string;
    module?: string;
    action?: string;
    page?: number;
    per_page?: number;
};

export function buildActivityLogQuery(params: {
    search: string;
    module: string;
    action: string;
    page?: number;
    perPage: number;
}): ActivityLogQueryParams {
    const trimmedSearch = params.search.trim();

    return {
        search: trimmedSearch !== '' ? trimmedSearch : undefined,
        module: params.module !== '' ? params.module : undefined,
        action: params.action !== '' ? params.action : undefined,
        page: params.page,
        per_page: params.perPage,
    };
}

export function activityLogRangeLabel(
    currentPage: number,
    perPage: number,
    total: number,
): string {
    if (total === 0) {
        return 'Showing 0 results';
    }

    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);

    return `Showing ${from}–${to} of ${total}`;
}

export function buildActivityLogPageItems(
    currentPage: number,
    lastPage: number,
): Array<number | 'ellipsis'> {
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    const pages = new Set<number>([1, lastPage, currentPage]);

    for (const offset of [-1, 1]) {
        const page = currentPage + offset;

        if (page > 1 && page < lastPage) {
            pages.add(page);
        }
    }

    const sorted = [...pages].sort((left, right) => left - right);
    const items: Array<number | 'ellipsis'> = [];

    for (const [index, page] of sorted.entries()) {
        if (index > 0 && page - sorted[index - 1]! > 1) {
            items.push('ellipsis');
        }

        items.push(page);
    }

    return items;
}
