<?php

namespace App\Modules\Brand\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadBrandLogoRequest extends FormRequest
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
            'logo' => [
                'required',
                'file',
                'image',
                'max:2048',
                'mimes:jpg,jpeg,png,webp,svg',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'logo.required' => 'Choose a logo image to upload.',
            'logo.image' => 'Logo must be an image file.',
            'logo.max' => 'Logo may not be larger than 2MB.',
            'logo.mimes' => 'Logo must be a JPG, PNG, WEBP, or SVG file.',
        ];
    }
}
