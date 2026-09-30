<?php

namespace App\Modules\Asset\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListAssetsRequest extends FormRequest
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
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', Rule::in(['updated_desc', 'name_asc'])],
            'added_on' => ['nullable', 'date', 'date_format:Y-m-d'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'folder_id' => ['nullable', 'integer', 'exists:folders,id'],
        ];
    }

    /**
     * @return array{search: string|null, sort: string, added_on: string|null, page: int, per_page: int}
     */
    public function listFilters(): array
    {
        $search = $this->filled('search')
            ? trim($this->string('search')->toString())
            : null;

        return [
            'search' => $search !== null && $search !== '' ? $search : null,
            'sort' => $this->string('sort', 'updated_desc')->toString(),
            'added_on' => $this->filled('added_on')
                ? $this->string('added_on')->toString()
                : null,
            'page' => $this->integer('page', 1),
            'per_page' => $this->integer('per_page', 20),
        ];
    }
}
