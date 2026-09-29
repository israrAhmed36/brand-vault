import { FolderIcon, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AssetMoveFolderListProps } from '@/types/asset';

export function AssetMoveFolderList({
    options,
    selectedFolderId,
    currentFolderId,
    onSelect,
}: AssetMoveFolderListProps) {
    return (
        <ul className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-border p-1.5">
            {options.map((option) => {
                const isSelected = selectedFolderId === option.id;
                const isCurrent = currentFolderId === option.id;

                return (
                    <li key={String(option.id)}>
                        <button
                            type="button"
                            className={cn(
                                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                isSelected
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted',
                            )}
                            onClick={() => onSelect(option.id)}
                        >
                            {option.id === null ? (
                                <Library className="size-3.5 shrink-0" />
                            ) : (
                                <FolderIcon className="size-3.5 shrink-0" />
                            )}
                            <span className="min-w-0 flex-1 truncate font-medium">
                                {option.label}
                            </span>
                            {isCurrent ? (
                                <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                                    Current
                                </span>
                            ) : null}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
