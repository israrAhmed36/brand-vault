<?php

namespace App\Modules\Folder\Controllers;

use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Requests\CreateFolderRequest;
use App\Modules\Folder\Requests\MoveFolderRequest;
use App\Modules\Folder\Requests\UpdateFolderRequest;
use App\Modules\Folder\Services\FolderMoveService;
use App\Modules\Folder\Services\FolderService;
use App\Shared\Exceptions\FolderDepthExceededException;
use App\Shared\Exceptions\FolderNotEmptyException;
use App\Shared\Exceptions\LastRootFolderException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class FolderController
{
    public function __construct(
        private readonly FolderService $folderService,
        private readonly FolderMoveService $folderMoveService,
    ) {}

    public function store(CreateFolderRequest $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->can('create', Folder::class), 403);

        try {
            $this->folderService->create($user, $request->folderPayload());
        } catch (FolderDepthExceededException $exception) {
            return back()->withErrors(['parent_id' => $exception->getMessage()]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Folder created.',
        ]);

        return back();
    }

    public function update(UpdateFolderRequest $request, Folder $folder): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->can('update', $folder), 403);

        $this->folderService->update($user, $folder, $request->folderPayload());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Folder renamed.',
        ]);

        return back();
    }

    public function move(MoveFolderRequest $request, Folder $folder): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->can('update', $folder), 403);

        try {
            $this->folderMoveService->move($user, $folder, $request->parentId());
        } catch (FolderDepthExceededException|LastRootFolderException $exception) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $exception->getMessage(),
            ]);

            return back();
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Folder moved.',
        ]);

        return back();
    }

    public function destroy(Folder $folder): RedirectResponse
    {
        $user = request()->user();
        abort_unless($user->can('delete', $folder), 403);

        try {
            $this->folderService->delete($user, $folder);
        } catch (FolderNotEmptyException $exception) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $exception->getMessage(),
            ]);

            return back();
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Folder deleted.',
        ]);

        return redirect()->route('assets.index');
    }
}
