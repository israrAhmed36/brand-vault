<?php

namespace App\Modules\Folder\Requests;

use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Rules\UniqueFolderName;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFolderRequest extends FormRequest
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
        /** @var Folder $folder */
        $folder = $this->route('folder');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                new UniqueFolderName(
                    (int) $this->user()->id,
                    $folder->parent_id,
                    $folder->id,
                ),
            ],
        ];
    }

    /**
     * @return array{name: string}
     */
    public function folderPayload(): array
    {
        return [
            'name' => $this->string('name')->toString(),
        ];
    }
}
