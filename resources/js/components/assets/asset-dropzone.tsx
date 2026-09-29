import { FileUp } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { AssetFileList } from '@/components/assets/asset-file-list';
import { AssetUploadPreview } from '@/components/assets/asset-upload-preview';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { AssetDropzoneProps } from '@/types/asset-form';

export function AssetDropzone({
    files,
    existingUrl,
    error,
    disabled = false,
    allowMultiple = false,
    onFilesAdded,
    onRemoveFile,
    onClearExisting,
}: AssetDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const hasFiles = files.length > 0;

    function handleFiles(list: FileList | null | undefined) {
        const incoming = list ? Array.from(list) : [];

        if (incoming.length === 0 || disabled) {
            return;
        }

        onFilesAdded(incoming);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        handleFiles(event.target.files);
        event.target.value = '';
    }

    return (
        <div className="grid gap-2">
            <Label>File</Label>
            <div
                className={cn(
                    'relative overflow-hidden rounded-lg border border-dashed border-border bg-muted/20 transition-colors',
                    isDragging && 'border-primary bg-muted/50',
                    disabled && 'opacity-70',
                )}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={allowMultiple}
                    className="sr-only"
                    disabled={disabled}
                    onChange={handleInputChange}
                />

                {hasFiles ? (
                    <AssetFileList
                        files={files}
                        disabled={disabled}
                        allowMultiple={allowMultiple}
                        onRemove={onRemoveFile}
                        onAddMore={() => inputRef.current?.click()}
                    />
                ) : existingUrl ? (
                    <AssetUploadPreview
                        url={existingUrl}
                        disabled={disabled}
                        onClear={onClearExisting}
                    />
                ) : (
                    <button
                        type="button"
                        className="flex w-full flex-col items-center gap-2 px-4 py-8 text-center"
                        disabled={disabled}
                        onClick={() => inputRef.current?.click()}
                    >
                        <FileUp className="size-6 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            {allowMultiple
                                ? 'Drag & drop files here'
                                : 'Drag & drop a file here'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Images, video, docs · max 10MB · uploads on save
                        </span>
                    </button>
                )}
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
