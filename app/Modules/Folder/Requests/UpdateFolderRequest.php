<?php

namespace App\Modules\Folder\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFolderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
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
