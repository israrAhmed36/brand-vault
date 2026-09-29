export type ActivityModule = 'brand' | 'folder' | 'asset';

export type ActivityAction =
    | 'created'
    | 'updated'
    | 'deleted'
    | 'moved'
    | 'trashed'
    | 'restored'
    | 'force_deleted';

export type ActivityLogValues = Record<string, unknown> | null;

export type ActivityLog = {
    id: number;
    user_id: number;
    module: ActivityModule;
    action: ActivityAction;
    subject_type: string | null;
    subject_id: number | null;
    subject_label: string | null;
    old_values: ActivityLogValues;
    new_values: ActivityLogValues;
    created_at: string;
    updated_at: string;
};

export type ActivityLogPaginator = {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: 10 | 20 | 50 | 100;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export type ActivityFilterOption = {
    value: string;
    label: string;
};

export type ActivityLogFilters = {
    search: string | null;
    module: string | null;
    action: string | null;
    per_page: 10 | 20 | 50 | 100;
};

export type ActivityLogsPageProps = {
    logs: ActivityLogPaginator;
    filters: ActivityLogFilters;
    moduleOptions: ActivityFilterOption[];
    actionOptions: ActivityFilterOption[];
};
