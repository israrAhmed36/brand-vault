import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActivityLogsPageButtonsProps = {
    currentPage: number;
    lastPage: number;
    total: number;
    pageItems: Array<number | 'ellipsis'>;
    onNavigate: (page: number) => void;
};

export function ActivityLogsPageButtons({
    currentPage,
    lastPage,
    total,
    pageItems,
    onNavigate,
}: ActivityLogsPageButtonsProps) {
    return (
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5"
                disabled={currentPage <= 1 || total === 0}
                onClick={() => onNavigate(currentPage - 1)}
            >
                Prev
            </Button>

            {pageItems.map((item, index) =>
                item === 'ellipsis' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-1 text-xs text-muted-foreground"
                    >
                        …
                    </span>
                ) : (
                    <Button
                        key={item}
                        type="button"
                        variant={item === currentPage ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                            'h-8 min-w-8 px-2 tabular-nums',
                            item === currentPage && 'pointer-events-none',
                        )}
                        onClick={() => onNavigate(item)}
                    >
                        {item}
                    </Button>
                ),
            )}

            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2.5"
                disabled={currentPage >= lastPage || total === 0}
                onClick={() => onNavigate(currentPage + 1)}
            >
                Next
            </Button>
        </div>
    );
}
