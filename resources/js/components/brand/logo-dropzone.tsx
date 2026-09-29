import { ImagePlus, X } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LogoDropzoneProps } from '@/types/brand';

export function LogoDropzone({
    previewUrl,
    hasPendingFile = false,
    error,
    disabled = false,
    onFileSelected,
    onClear,
}: LogoDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    function handleFile(file: File | undefined) {
        if (!file || disabled) {
            return;
        }

        onFileSelected(file);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        handleFile(event.target.files?.[0]);
        event.target.value = '';
    }

    return (
        <div className="grid gap-2">
            <Label>Logo</Label>
            <Card
                className={cn(
                    'relative overflow-hidden border-dashed p-0 shadow-none transition-colors',
                    isDragging && 'border-primary bg-muted/40',
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
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="sr-only"
                    disabled={disabled}
                    onChange={handleInputChange}
                />

                {previewUrl ? (
                    <div className="flex items-center gap-3 p-4">
                        <img
                            src={previewUrl}
                            alt="Brand logo preview"
                            className="size-14 rounded-md border border-border bg-muted object-contain"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {hasPendingFile
                                    ? 'Ready to upload on save'
                                    : 'Logo selected'}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                Drop a new file to replace
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={disabled}
                            onClick={onClear}
                            aria-label="Remove logo"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="flex w-full flex-col items-center gap-2 px-4 py-8 text-center"
                        disabled={disabled}
                        onClick={() => inputRef.current?.click()}
                    >
                        <ImagePlus className="size-6 text-muted-foreground" />
                        <span className="text-sm font-medium">
                            Drag & drop logo here
                        </span>
                        <span className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP, or SVG · max 2MB · uploads on save
                        </span>
                    </button>
                )}
            </Card>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
