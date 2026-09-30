<?php

namespace App\Modules\Folder\Requests;

use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Rules\UniqueFolderName;
use App\Shared\Rules\BelongsToCurrentUser;
use Illuminate\Contracts\Validation\Validator;
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

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            /** @var Folder $folder */
            $folder = $this->route('folder');
            $rule = new UniqueFolderName(
                (int) $this->user()->id,
                $this->parentId(),
                $folder->id,
            );

            $rule->validate('name', $folder->name, function (string $message) use ($validator): void {
                $validator->errors()->add('parent_id', $message);
            });
        });
    }

    public function parentId(): ?int
    {
        return $this->filled('parent_id')
            ? $this->integer('parent_id')
            : null;
    }
}
