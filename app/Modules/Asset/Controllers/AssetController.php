<?php

namespace App\Modules\Asset\Controllers;

use App\Models\User;
use App\Modules\Asset\Models\Asset;
use App\Modules\Asset\Requests\CreateAssetRequest;
use App\Modules\Asset\Requests\UpdateAssetRequest;
use App\Modules\Asset\Services\AssetService;
use App\Modules\Asset\Services\AssetTrashService;
use App\Modules\Asset\Services\CreateAssetsFromFiles;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use RuntimeException;

class AssetController
{
    public function __construct(
        private readonly AssetService $assetService,
        private readonly AssetTrashService $assetTrashService,
        private readonly CreateAssetsFromFiles $createAssetsFromFiles,
    ) {}

    public function store(CreateAssetRequest $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->can('create', Asset::class), 403);

        try {
            $count = $request->hasFile('files')
                ? $this->createAssetsFromFiles->handle($user, $request->uploadedFilesPayload())
                : $this->storeFromUrl($user, $request);
        } catch (RuntimeException $exception) {
            return back()->withErrors(['files' => $exception->getMessage()]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $count === 1 ? 'Asset created.' : $count.' assets created.',
        ]);

        return back();
    }

    public function update(UpdateAssetRequest $request, Asset $asset): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->can('update', $asset), 403);

        try {
            $this->assetService->update(
                $user,
                $asset,
                $request->assetPayload(),
                $request->file('file'),
            );
        } catch (RuntimeException $exception) {
            return back()->withErrors(['file' => $exception->getMessage()]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Asset updated.',
        ]);

        return back();
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $user = request()->user();
        abort_unless($user->can('delete', $asset), 403);

        $this->assetTrashService->softDelete($user, $asset);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Asset moved to trash.',
        ]);

        return back();
    }

    public function restore(int $asset): RedirectResponse
    {
        $user = request()->user();
        $model = $this->assetService->findOwned($user, $asset);
        abort_if($model === null || $model->deleted_at === null, 404);
        abort_unless($user->can('restore', $model), 403);

        $result = $this->assetTrashService->restore($user, $model);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $result['restored_to_root']
                ? 'Restored to root — original folder no longer exists.'
                : 'Asset restored.',
        ]);

        return back();
    }

    public function forceDestroy(int $asset): RedirectResponse
    {
        $user = request()->user();
        $model = $this->assetService->findOwned($user, $asset);
        abort_if($model === null || $model->deleted_at === null, 404);
        abort_unless($user->can('forceDelete', $model), 403);

        $this->assetTrashService->forceDelete($user, $model);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Asset permanently deleted.',
        ]);

        return back();
    }

    private function storeFromUrl(User $user, CreateAssetRequest $request): int
    {
        $this->assetService->create($user, $request->assetPayload());

        return 1;
    }
}
