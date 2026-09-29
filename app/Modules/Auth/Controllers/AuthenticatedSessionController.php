<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Requests\LoginRequest;
use App\Modules\Auth\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
            'canResetPassword' => false,
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->ensureIsNotRateLimited();

        try {
            $this->authService->attemptLogin(
                $request->safe()->only(['email', 'password', 'remember']),
            );
        } catch (ValidationException $exception) {
            $request->hitRateLimiter();

            throw $exception;
        }

        $request->clearRateLimiter();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function destroy(): RedirectResponse
    {
        $this->authService->logout();

        return redirect()->route('home');
    }
}
