<?php

namespace App\Shared\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class BelongsToCurrentUser implements ValidationRule
{
    public function __construct(
        private readonly string $table,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $userId = auth()->id();

        if ($userId === null) {
            $fail('You must be signed in.');

            return;
        }

        $exists = DB::table($this->table)
            ->where('id', $value)
            ->where('user_id', $userId)
            ->exists();

        if (! $exists) {
            $fail('The selected :attribute is invalid.');
        }
    }
}
