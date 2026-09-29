<?php

namespace App\Modules\Dashboard\Controllers;

use App\Modules\Dashboard\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render(
            'dashboard',
            $this->dashboardService->summary($request->user()),
        );
    }
}
