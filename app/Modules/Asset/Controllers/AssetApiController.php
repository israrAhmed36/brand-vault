<?php

namespace App\Modules\Asset\Controllers;

use App\Modules\Asset\Models\Asset;
use App\Modules\Asset\Requests\ListAssetsRequest;
use App\Modules\Asset\Requests\MoveAssetRequest;
use App\Modules\Asset\Services\AssetService;
use Illuminate\Http\JsonResponse;

class AssetApiController
{
    public function __construct(
        private readonly AssetService $assetService,
    ) {}

    public function search(ListAssetsRequest $request): JsonResponse
    {
        $user = $request->user();
        $filters = $request->listFilters();

        if ($request->exists('folder_id')) {
            $filters['folder_id'] = $request->filled('folder_id')
                ? $request->integer('folder_id')
                : null;
        }

        $assets = $this->assetService->list($user, $filters);

        return response()->json([
            'success' => true,
            'data' => $assets->items(),
            'meta' => [
                'pagination' => [
                    'page' => $assets->currentPage(),
                    'per_page' => $assets->perPage(),
                    'total' => $assets->total(),
                ],
            ],
        ]);
    }

    public function move(MoveAssetRequest $request, Asset $asset): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->can('update', $asset), 403);

        $moved = $this->assetService->move($user, $asset, $request->folderId());

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $moved->id,
                'folder_id' => $moved->folder_id,
            ],
        ]);
    }
}
