<?php

namespace App\Modules\Asset\Controllers;

use App\Modules\Asset\Requests\BulkTrashAssetsRequest;
use App\Modules\Asset\Services\AssetTrashBulkService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class AssetTrashBulkController
{
    public function __construct(
        private readonly AssetTrashBulkService $trashBulk,
    ) {}

    public function restore(BulkTrashAssetsRequest $request): RedirectResponse
    {
        $count = $this->trashBulk->restore(
            $request->user(),
            $request->assetIds(),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $count === 1
                ? '1 asset restored.'
                : $count.' assets restored.',
        ]);

        return back();
    }

    public function forceDestroy(BulkTrashAssetsRequest $request): RedirectResponse
    {
        $count = $this->trashBulk->forceDelete(
            $request->user(),
            $request->assetIds(),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $count === 1
                ? '1 asset permanently deleted.'
                : $count.' assets permanently deleted.',
        ]);

        return back();
    }
}
