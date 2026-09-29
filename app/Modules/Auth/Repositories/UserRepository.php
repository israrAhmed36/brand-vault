<?php

namespace App\Modules\Auth\Repositories;

use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function create(array $attributes): User
    {
        $user = User::query()->create([
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'password' => $attributes['password'],
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return $user->refresh();
    }

    public function firstOrCreateDemo(string $name, string $email, string $password): User
    {
        $user = $this->findByEmail($email);

        if ($user !== null) {
            return $user;
        }

        return $this->create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ]);
    }
}
