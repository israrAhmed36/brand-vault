<?php

namespace App\Modules\ActivityLog\Requests;

use App\Modules\ActivityLog\Enums\ActivityAction;
use App\Modules\ActivityLog\Enums\ActivityModule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListActivityLogsRequest extends FormRequest
{
    public const PER_PAGE_OPTIONS = [10, 20, 50, 100];

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
            'module' => ['nullable', 'string', Rule::enum(ActivityModule::class)],
            'action' => ['nullable', 'string', Rule::enum(ActivityAction::class)],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', Rule::in(self::PER_PAGE_OPTIONS)],
        ];
    }

    /**
     * @return array{search: string|null, module: string|null, action: string|null, page: int, per_page: int}
     */
    public function listFilters(): array
    {
        $search = $this->filled('search')
            ? trim($this->string('search')->toString())
            : null;

        $module = $this->filled('module')
            ? $this->string('module')->toString()
            : null;

        $action = $this->filled('action')
            ? $this->string('action')->toString()
            : null;

        return [
            'search' => $search !== null && $search !== '' ? $search : null,
            'module' => $module !== null && $module !== '' ? $module : null,
            'action' => $action !== null && $action !== '' ? $action : null,
            'page' => $this->integer('page', 1),
            'per_page' => $this->integer('per_page', 20),
        ];
    }
}
