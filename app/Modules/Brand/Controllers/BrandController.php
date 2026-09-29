<?php

namespace App\Modules\Brand\Controllers;

use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Requests\UpsertBrandRequest;
use App\Modules\Brand\Services\BrandLogoService;
use App\Modules\Brand\Services\BrandService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController
{
    public function __construct(
        private readonly BrandService $brandService,
        private readonly BrandLogoService $brandLogoService,
    ) {}

    public function edit(Request $request): Response
    {
        $user = $request->user();
        $brand = $this->brandService->forUser($user);

        if ($brand !== null) {
            abort_unless($user->can('view', $brand), 403);
        }

        return Inertia::render('brand/edit', [
            'brand' => $this->brandLogoService->present($brand),
        ]);
    }

    public function update(UpsertBrandRequest $request): RedirectResponse
    {
        $user = $request->user();
        $existing = $this->brandService->forUser($user);

        if ($existing !== null) {
            abort_unless($user->can('update', $existing), 403);
        } else {
            abort_unless($user->can('create', Brand::class), 403);
        }

        $payload = $request->brandPayload();
        $payload['logo_url'] = $this->brandLogoService->toCanonicalUrl(
            $payload['logo_url'],
        );

        $this->brandService->upsert($user, $payload);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Brand kit saved.',
        ]);

        return to_route('brand.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        $brand = $this->brandService->forUser($user);

        abort_if($brand === null, 404);
        abort_unless($user->can('delete', $brand), 403);

        $this->brandService->delete($user);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Brand kit removed.',
        ]);

        return to_route('brand.edit');
    }
}
