<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Auth\Support\DemoCredentials;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    /**
     * @param  array{email: string, password: string, remember?: bool}  $credentials
     *
     * @throws ValidationException
     */
    public function attemptLogin(array $credentials): User
    {
        $remember = (bool) ($credentials['remember'] ?? false);

        $authenticated = Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ], $remember);

        if (! $authenticated) {
            throw ValidationException::withMessages([
                'email' => __('These credentials do not match our records.'),
            ]);
        }

        session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }

    /**
     * @param  array{name: string, email: string, password: string}  $payload
     */
    public function register(array $payload): User
    {
        $user = $this->users->create($payload);

        Auth::login($user);
        session()->regenerate();

        return $user;
    }

    public function loginAsDemo(): User
    {
        $user = $this->users->firstOrCreateDemo(
            DemoCredentials::NAME,
            DemoCredentials::EMAIL,
            DemoCredentials::PASSWORD,
        );

        Auth::login($user, remember: true);
        session()->regenerate();

        return $user;
    }

    public function logout(): void
    {
        Auth::guard('web')->logout();

        session()->invalidate();
        session()->regenerateToken();
    }
}
