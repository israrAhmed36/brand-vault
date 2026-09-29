<?php

namespace App\Modules\Brand\Controllers;

use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Requests\UpsertBrandRequest;
use App\Modules\Brand\Services\BrandService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController
{
    public function __construct(
        private readonly BrandService $brandService,
    ) {}

    public function edit(Request $request): Response
    {
        $user = $request->user();
        $brand = $this->brandService->forUser($user);

        if ($brand !== null) {
            abort_unless($user->can('view', $brand), 403);
        }

        return Inertia::render('brand/edit', [
            'brand' => $brand,
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

        $this->brandService->upsert($user, $request->brandPayload());

        return redirect()
            ->route('brand.edit')
            ->with('success', 'Brand kit saved.');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        $brand = $this->brandService->forUser($user);

        abort_if($brand === null, 404);
        abort_unless($user->can('delete', $brand), 403);

        $this->brandService->delete($user);

        return redirect()
            ->route('brand.edit')
            ->with('success', 'Brand kit removed.');
    }
}
