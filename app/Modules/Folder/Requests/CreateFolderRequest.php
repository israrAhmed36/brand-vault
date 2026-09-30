<?php

namespace App\Modules\Folder\Requests;

use App\Modules\Folder\Rules\UniqueFolderName;
use App\Shared\Rules\BelongsToCurrentUser;
use Illuminate\Foundation\Http\FormRequest;

class CreateFolderRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                new UniqueFolderName(
                    (int) $this->user()->id,
                    $this->resolvedParentId(),
                ),
            ],
            'parent_id' => [
                'nullable',
                'integer',
                'exists:folders,id',
                new BelongsToCurrentUser('folders'),
            ],
        ];
    }

    /**
     * @return array{name: string, parent_id: int|null}
     */
    public function folderPayload(): array
    {
        return [
            'name' => $this->string('name')->toString(),
            'parent_id' => $this->resolvedParentId(),
        ];
    }

    private function resolvedParentId(): ?int
    {
        return $this->filled('parent_id')
            ? $this->integer('parent_id')
            : null;
    }
}
