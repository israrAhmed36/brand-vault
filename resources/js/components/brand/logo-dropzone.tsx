import { ImagePlus, Loader2, X } from 'lucide-react';
import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { uploadBrandLogo } from '@/lib/brand-logo-upload';
import type { LogoDropzoneProps } from '@/types/brand';
import { toast } from 'sonner';

export function LogoDropzone({
    value,
    error,
    disabled = false,
    onChange,
}: LogoDropzoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    async function handleFile(file: File | undefined) {
        if (!file || disabled || isUploading) {
            return;
        }

        setUploadError(null);
        setIsUploading(true);

        try {
            const logoUrl = await uploadBrandLogo(file);
            onChange(logoUrl);
            toast.success('Logo uploaded.');
        } catch (caught) {
            const message =
                caught instanceof Error
                    ? caught.message
                    : 'Logo upload failed.';
            setUploadError(message);
            toast.error(message);
        } finally {
            setIsUploading(false);
        }
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragging(false);
        void handleFile(event.dataTransfer.files?.[0]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        void handleFile(event.target.files?.[0]);
        event.target.value = '';
    }

    return (
        <div className="grid gap-2">
            <Label>Logo</Label>
            <Card
                className={cn(
                    'relative overflow-hidden border-dashed p-0 shadow-none transition-colors',
                    isDragging && 'border-primary bg-muted/40',
                    (disabled || isUploading) && 'opacity-70',
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
                    disabled={disabled || isUploading}
                    onChange={handleInputChange}
                />

                {value ? (
                    <div className="flex items-center gap-3 p-4">
                        <img
                            src={value}
                            alt="Brand logo preview"
                            className="size-14 rounded-md border border-border bg-muted object-contain"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                Logo uploaded
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                Drop a new file to replace
                            </p>
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            disabled={isUploading}
                            onClick={() => onChange('')}
                            aria-label="Remove logo"
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="flex w-full flex-col items-center gap-2 px-4 py-8 text-center"
                        disabled={disabled || isUploading}
                        onClick={() => inputRef.current?.click()}
                    >
                        {isUploading ? (
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        ) : (
                            <ImagePlus className="size-6 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                            {isUploading
                                ? 'Uploading…'
                                : 'Drag & drop logo here'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP, or SVG · max 2MB
                        </span>
                    </button>
                )}
            </Card>
            {(uploadError || error) && (
                <p className="text-sm text-destructive">
                    {uploadError ?? error}
                </p>
            )}
        </div>
    );
}
