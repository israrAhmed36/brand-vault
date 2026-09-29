import type { ActivityAction, ActivityModule } from '@/types/activity-log';

const FIELD_LABELS: Record<string, string> = {
    name: 'Name',
    type: 'Type',
    url: 'URL',
    tags: 'Tags',
    folder: 'Folder',
    parent: 'Parent',
    primary_color: 'Primary color',
    secondary_color: 'Secondary color',
    logo_url: 'Logo',
    default_font: 'Font',
};

export function formatActivityDateTime(iso: string): string {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return iso;
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

export function formatActivityModule(module: ActivityModule): string {
    return module.charAt(0).toUpperCase() + module.slice(1);
}

export function formatActivityAction(action: ActivityAction): string {
    return action
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function formatActivityFieldLabel(key: string): string {
    if (FIELD_LABELS[key]) {
        return FIELD_LABELS[key];
    }

    return key
        .replaceAll('_', ' ')
        .replace(/^\w/, (char) => char.toUpperCase());
}

export function formatActivityValue(value: unknown): string {
    if (value === null || value === undefined) {
        return '—';
    }

    if (typeof value === 'string') {
        if (value === '') {
            return '—';
        }

        if (value.startsWith('http://') || value.startsWith('https://')) {
            try {
                const pathname = new URL(value).pathname.split('/').pop();

                return pathname && pathname !== '' ? pathname : value;
            } catch {
                return value;
            }
        }

        return value;
    }

    if (Array.isArray(value)) {
        return value.length === 0 ? '—' : value.map(String).join(', ');
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    return JSON.stringify(value);
}

export type ActivityChangeEntry = {
    key: string;
    label: string;
    previous: string | null;
    next: string | null;
};

export function activityChangeSummary(
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null,
): ActivityChangeEntry[] {
    const keys = [
        ...new Set([
            ...Object.keys(oldValues ?? {}),
            ...Object.keys(newValues ?? {}),
        ]),
    ];

    return keys.flatMap((key) => {
        const previous =
            oldValues === null
                ? null
                : formatActivityValue(oldValues[key] ?? null);
        const next =
            newValues === null
                ? null
                : formatActivityValue(newValues[key] ?? null);

        if (previous !== null && next !== null && previous === next) {
            return [];
        }

        return [
            {
                key,
                label: formatActivityFieldLabel(key),
                previous,
                next,
            },
        ];
    });
}
