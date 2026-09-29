<?php

namespace App\Modules\Auth\Repositories;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    /**
     * @param  array{name: string, email: string, password: string}  $attributes
     */
    public function create(array $attributes): User;

    public function firstOrCreateDemo(string $name, string $email, string $password): User;
}
