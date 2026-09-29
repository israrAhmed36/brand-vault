import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { SearchSortBarProps } from '@/types/asset';

export function SearchSortBar({
    search,
    sort,
    onSearchChange,
    onSortChange,
}: SearchSortBarProps) {
    const hasSearch = search.trim() !== '';

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    placeholder="Search by name"
                    className="pr-9 pl-9"
                    aria-label="Search assets by name"
                    onChange={(event) => onSearchChange(event.target.value)}
                />
                {hasSearch ? (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
                        aria-label="Clear search"
                        onClick={() => onSearchChange('')}
                    >
                        <X className="size-3.5" />
                    </Button>
                ) : null}
            </div>
            <Select
                value={sort}
                onValueChange={(value) =>
                    onSortChange(value as SearchSortBarProps['sort'])
                }
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="updated_desc">Newest updated</SelectItem>
                    <SelectItem value="name_asc">Name A–Z</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
