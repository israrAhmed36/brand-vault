<?php

namespace App\Modules\Folder\Requests;

use App\Shared\Rules\BelongsToCurrentUser;
use Illuminate\Foundation\Http\FormRequest;

class MoveFolderRequest extends FormRequest
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
            'parent_id' => [
                'nullable',
                'integer',
                'exists:folders,id',
                new BelongsToCurrentUser('folders'),
            ],
        ];
    }

    public function parentId(): ?int
    {
        return $this->filled('parent_id')
            ? $this->integer('parent_id')
            : null;
    }
}
