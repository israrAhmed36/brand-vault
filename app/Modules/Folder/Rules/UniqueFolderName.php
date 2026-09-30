<?php

namespace App\Modules\Folder\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UniqueFolderName implements ValidationRule
{
    public function __construct(
        private readonly int $userId,
        private readonly ?int $parentId,
        private readonly ?int $ignoreFolderId = null,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        $query = DB::table('folders')
            ->where('user_id', $this->userId)
            ->whereRaw('LOWER(name) = ?', [mb_strtolower(trim($value))]);

        if ($this->parentId === null) {
            $query->whereNull('parent_id');
        } else {
            $query->where('parent_id', $this->parentId);
        }

        if ($this->ignoreFolderId !== null) {
            $query->where('id', '!=', $this->ignoreFolderId);
        }

        if ($query->exists()) {
            $fail('A folder with this name already exists in this location.');
        }
    }
}
