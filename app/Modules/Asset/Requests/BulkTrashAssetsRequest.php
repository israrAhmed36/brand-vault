<?php

namespace App\Modules\Asset\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkTrashAssetsRequest extends FormRequest
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
        $userId = $this->user()?->id;

        return [
            'asset_ids' => ['required', 'array', 'min:1', 'max:100'],
            'asset_ids.*' => [
                'integer',
                'distinct',
                Rule::exists('assets', 'id')
                    ->where('user_id', $userId)
                    ->whereNotNull('deleted_at'),
            ],
        ];
    }

    /**
     * @return list<int>
     */
    public function assetIds(): array
    {
        return array_map(
            fn (mixed $id): int => (int) $id,
            $this->input('asset_ids', []),
        );
    }
}
