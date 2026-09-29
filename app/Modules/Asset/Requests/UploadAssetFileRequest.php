<?php

namespace App\Modules\Asset\Requests;

use App\Modules\Asset\Support\AssetFileRules;
use Illuminate\Foundation\Http\FormRequest;

class UploadAssetFileRequest extends FormRequest
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
            'file' => ['required', ...AssetFileRules::constraints()],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Choose a file to upload.',
            ...AssetFileRules::messages('file'),
        ];
    }
}
