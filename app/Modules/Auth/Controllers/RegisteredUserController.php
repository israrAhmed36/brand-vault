<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Requests\RegisterRequest;
use App\Modules\Auth\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $this->authService->register($request->registrationPayload());

        return redirect()->route('dashboard');
    }
}
