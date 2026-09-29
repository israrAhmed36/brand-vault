<?php

namespace App\Modules\Asset\Requests;

use App\Modules\Asset\Enums\AssetType;
use App\Modules\Asset\Support\AssetFileRules;
use App\Shared\Rules\BelongsToCurrentUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;

class CreateAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'required_without:files', 'string', 'max:255'],
            'type' => ['nullable', 'required_without:files', Rule::in(AssetType::values())],
            'url' => ['nullable', 'required_without:files', 'url', 'max:2048'],
            'folder_id' => [
                'nullable',
                'integer',
                'exists:folders,id',
                new BelongsToCurrentUser('folders'),
            ],
            'files' => ['nullable', 'array', 'max:20'],
            'files.*' => AssetFileRules::constraints(),
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required_without' => 'Enter a name or choose a file.',
            'url.required_without' => 'Add a file or paste a URL.',
            'files.max' => 'You can upload up to 20 files at once.',
            ...AssetFileRules::messages('files.*'),
        ];
    }

    /**
     * @return array{name: string, type: string, url: string, folder_id: int|null}
     */
    public function assetPayload(): array
    {
        return [
            'name' => $this->string('name')->toString(),
            'type' => $this->string('type')->toString(),
            'url' => $this->string('url')->toString(),
            'folder_id' => $this->filled('folder_id')
                ? $this->integer('folder_id')
                : null,
        ];
    }

    /**
     * @return array{name: string|null, type: string|null, folder_id: int|null, files: list<UploadedFile>}
     */
    public function uploadedFilesPayload(): array
    {
        return [
            'name' => $this->filled('name') ? $this->string('name')->toString() : null,
            'type' => $this->filled('type') ? $this->string('type')->toString() : null,
            'folder_id' => $this->filled('folder_id') ? $this->integer('folder_id') : null,
            'files' => $this->uploadedFiles(),
        ];
    }

    /**
     * @return list<UploadedFile>
     */
    private function uploadedFiles(): array
    {
        $files = $this->file('files', []);

        if ($files instanceof UploadedFile) {
            return [$files];
        }

        if (! is_array($files)) {
            return [];
        }

        return array_values(array_filter(
            $files,
            fn (mixed $file): bool => $file instanceof UploadedFile,
        ));
    }
}
