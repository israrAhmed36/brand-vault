<?php

namespace App\Modules\Asset\Requests;

use App\Shared\Rules\BelongsToCurrentUser;
use Illuminate\Foundation\Http\FormRequest;

class MoveAssetRequest extends FormRequest
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
            'folder_id' => [
                'nullable',
                'integer',
                'exists:folders,id',
                new BelongsToCurrentUser('folders'),
            ],
        ];
    }

    public function folderId(): ?int
    {
        return $this->filled('folder_id')
            ? $this->integer('folder_id')
            : null;
    }
}
