<?php

namespace App\Modules\Brand\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpsertBrandRequest extends FormRequest
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
            'primary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_color' => [
                'required',
                'regex:/^#[0-9A-Fa-f]{6}$/',
                'different:primary_color',
            ],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'default_font' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * @return array{name: string, primary_color: string, secondary_color: string, logo_url: string|null, default_font: string|null}
     */
    public function brandPayload(): array
    {
        return [
            'name' => $this->string('name')->toString(),
            'primary_color' => $this->string('primary_color')->toString(),
            'secondary_color' => $this->string('secondary_color')->toString(),
            'logo_url' => $this->filled('logo_url')
                ? $this->string('logo_url')->toString()
                : null,
            'default_font' => $this->filled('default_font')
                ? $this->string('default_font')->toString()
                : null,
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'primary_color.regex' => 'Primary color must be a hex code like #1A1A1A.',
            'secondary_color.regex' => 'Secondary color must be a hex code like #C45C26.',
            'secondary_color.different' => 'Secondary color must differ from the primary color.',
        ];
    }
}
