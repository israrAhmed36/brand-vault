<?php

namespace App\Modules\Asset\Requests;

use App\Modules\Asset\Enums\AssetType;
use App\Modules\Asset\Support\AssetFileRules;
use App\Shared\Rules\BelongsToCurrentUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssetRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(AssetType::values())],
            'url' => ['required_without:file', 'nullable', 'url', 'max:2048'],
            'file' => ['nullable', ...AssetFileRules::constraints()],
            'folder_id' => [
                'nullable',
                'integer',
                'exists:folders,id',
                new BelongsToCurrentUser('folders'),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'url.required_without' => 'Add a file or paste a URL.',
            ...AssetFileRules::messages('file'),
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
            'url' => $this->filled('url') ? $this->string('url')->toString() : '',
            'folder_id' => $this->filled('folder_id')
                ? $this->integer('folder_id')
                : null,
        ];
    }
}
