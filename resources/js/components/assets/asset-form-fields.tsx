import { AssetDropzone } from '@/components/assets/asset-dropzone';
import { AssetNameField } from '@/components/assets/asset-name-field';
import { FolderCombobox } from '@/components/assets/folder-combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AssetFormFieldsProps } from '@/types/asset-form';
import type { AssetType } from '@/types/asset';

const ASSET_TYPES: AssetType[] = [
    'image',
    'video',
    'document',
    'link',
    'other',
];

export function AssetFormFields({
    data,
    folderOptions,
    files,
    allowMultiple,
    fileError,
    errors,
    onChange,
    onFilesAdded,
    onRemoveFile,
}: AssetFormFieldsProps) {
    const usesFileNames = allowMultiple && files.length > 1;

    return (
        <>
            <FolderCombobox
                value={data.folder_id}
                options={folderOptions}
                onChange={(folderId) => onChange('folder_id', folderId)}
            />

            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
                <AssetNameField
                    name={data.name}
                    usesFileNames={usesFileNames}
                    error={errors?.name}
                    onChange={(name) => onChange('name', name)}
                />

                <div className="grid gap-2">
                    <Label>Type</Label>
                    <Select
                        value={data.type}
                        disabled={usesFileNames}
                        onValueChange={(value) =>
                            onChange('type', value as AssetType)
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ASSET_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {usesFileNames ? (
                        <p className="text-xs text-muted-foreground">
                            Detected from each file.
                        </p>
                    ) : null}
                </div>
            </div>

            <AssetDropzone
                files={files}
                existingUrl={data.url}
                error={fileError}
                allowMultiple={allowMultiple}
                onFilesAdded={onFilesAdded}
                onRemoveFile={onRemoveFile}
                onClearExisting={() => onChange('url', '')}
            />

            <div className="grid gap-2">
                <Label htmlFor="asset-url">URL</Label>
                <Input
                    id="asset-url"
                    type="url"
                    value={data.url}
                    disabled={files.length > 0}
                    onChange={(event) => onChange('url', event.target.value)}
                    placeholder={
                        files.length > 0
                            ? 'Selected files are used instead'
                            : 'Or paste an external URL'
                    }
                />
                {errors?.url ? (
                    <p className="text-sm text-destructive">{errors.url}</p>
                ) : null}
            </div>
        </>
    );
}
