import { FileUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AssetFileListProps } from '@/types/asset-form';

export function AssetFileList({
    files,
    disabled = false,
    allowMultiple = false,
    onRemove,
    onAddMore,
}: AssetFileListProps) {
    return (
        <div className="flex flex-col">
            <ul>
                {files.map((item) => (
                    <li
                        key={item.key}
                        className="flex items-center gap-3 border-b border-border p-3 last:border-b-0"
                    >
                        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                            {item.previewUrl ? (
                                <img
                                    src={item.previewUrl}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <FileUp className="size-5 text-muted-foreground" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {item.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Uploads when you save
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={disabled}
                            onClick={() => onRemove(item.key)}
                            aria-label={`Remove ${item.file.name}`}
                        >
                            <X className="size-4" />
                        </Button>
                    </li>
                ))}
            </ul>
            {allowMultiple ? (
                <button
                    type="button"
                    className="px-3 py-2 text-left text-xs font-medium text-primary disabled:opacity-70"
                    disabled={disabled}
                    onClick={onAddMore}
                >
                    Add more files
                </button>
            ) : null}
        </div>
    );
}
