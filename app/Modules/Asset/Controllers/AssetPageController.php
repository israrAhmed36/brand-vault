<?php

namespace App\Modules\Asset\Controllers;

use App\Modules\Asset\Requests\ListAssetsRequest;
use App\Modules\Asset\Services\AssetService;
use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Services\FolderService;
use Inertia\Inertia;
use Inertia\Response;

class AssetPageController
{
    public function __construct(
        private readonly AssetService $assetService,
        private readonly FolderService $folderService,
    ) {}

    public function index(ListAssetsRequest $request, ?Folder $folder = null): Response
    {
        $user = $request->user();

        if ($folder !== null) {
            abort_unless($user->can('view', $folder), 403);
        }

        $filters = $request->listFilters();
        $filters['folder_id'] = $folder?->id;

        return Inertia::render('assets/index', [
            'assets' => $this->assetService->list($user, $filters),
            'folders' => $this->folderService->all($user),
            'folderOptions' => $this->folderService->optionsForUser($user),
            'breadcrumbs' => $this->folderService->breadcrumbs($folder),
            'currentFolder' => $folder,
            'filters' => [
                'search' => $filters['search'],
                'sort' => $filters['sort'],
                'added_on' => $filters['added_on'],
            ],
            'counts' => $this->assetService->libraryCounts($user),
        ]);
    }

    public function trash(ListAssetsRequest $request): Response
    {
        $user = $request->user();
        $filters = $request->listFilters();

        return Inertia::render('assets/trash', [
            'assets' => $this->assetService->list($user, $filters, trashed: true),
            'filters' => [
                'search' => $filters['search'],
                'sort' => $filters['sort'],
                'added_on' => $filters['added_on'],
            ],
            'counts' => $this->assetService->libraryCounts($user),
        ]);
    }
}
