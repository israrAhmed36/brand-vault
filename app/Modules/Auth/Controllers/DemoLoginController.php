<?php

namespace App\Modules\Auth\Controllers;

use App\Modules\Auth\Services\AuthService;
use Illuminate\Http\RedirectResponse;

class DemoLoginController
{
    public function __construct(
        private readonly AuthService $authService,
    ) {}

    public function store(): RedirectResponse
    {
        $this->authService->loginAsDemo();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
