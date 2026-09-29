<?php

namespace App\Modules\Asset\Repositories;

use App\Modules\Asset\Models\Asset;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AssetRepository implements AssetRepositoryInterface
{
    public function findForUser(int $userId, int $assetId): ?Asset
    {
        return Asset::query()
            ->withTrashed()
            ->where('user_id', $userId)
            ->whereKey($assetId)
            ->first();
    }

    public function listForUser(int $userId, array $filters, bool $trashed = false): LengthAwarePaginator
    {
        $query = Asset::query()->where('user_id', $userId);

        if ($trashed) {
            $query->onlyTrashed();
        }

        if (array_key_exists('folder_id', $filters) && ! $trashed) {
            $query->where('folder_id', $filters['folder_id']);
        }

        $search = $filters['search'] ?? null;
        if (is_string($search) && $search !== '') {
            $needle = '%'.addcslashes(mb_strtolower($search), '%_\\').'%';
            $query->whereRaw('LOWER(name) LIKE ?', [$needle]);
        }

        $sort = $filters['sort'] ?? 'updated_desc';
        if ($sort === 'name_asc') {
            $query->orderBy('name');
        } else {
            $query->orderByDesc('updated_at');
        }

        $perPage = (int) ($filters['per_page'] ?? 20);

        return $query->paginate(max(1, min($perPage, 100)));
    }

    public function countForUser(int $userId, bool $trashed = false): int
    {
        $query = Asset::query()->where('user_id', $userId);

        if ($trashed) {
            $query->onlyTrashed();
        }

        return $query->count();
    }

    public function createForUser(int $userId, array $attributes): Asset
    {
        return Asset::query()->create([
            'user_id' => $userId,
            'folder_id' => $attributes['folder_id'] ?? null,
            'name' => $attributes['name'],
            'type' => $attributes['type'],
            'url' => $attributes['url'],
        ]);
    }

    public function updateForUser(int $userId, Asset $asset, array $attributes): Asset
    {
        abort_unless($asset->user_id === $userId, 403);

        $asset->fill([
            'folder_id' => $attributes['folder_id'] ?? null,
            'name' => $attributes['name'],
            'type' => $attributes['type'],
            'url' => $attributes['url'],
        ])->save();

        return $asset->refresh();
    }

    public function moveForUser(int $userId, Asset $asset, ?int $folderId): Asset
    {
        abort_unless($asset->user_id === $userId, 403);

        $asset->forceFill([
            'folder_id' => $folderId,
        ])->save();

        return $asset->refresh();
    }

    public function softDeleteForUser(int $userId, Asset $asset): void
    {
        abort_unless($asset->user_id === $userId, 403);
        $asset->delete();
    }

    public function restoreForUser(int $userId, Asset $asset): Asset
    {
        abort_unless($asset->user_id === $userId, 403);
        $asset->restore();

        return $asset->refresh();
    }

    public function forceDeleteForUser(int $userId, Asset $asset): void
    {
        abort_unless($asset->user_id === $userId, 403);
        abort_unless($asset->trashed(), 404);
        $asset->forceDelete();
    }

    public function updateAiSuggestionForUser(int $userId, Asset $asset, array $suggestion): Asset
    {
        abort_unless($asset->user_id === $userId, 403);

        $asset->forceFill([
            'tags' => $suggestion['tags'],
            'ai_description' => $suggestion['description'],
            'ai_usage_suggestion' => $suggestion['usage_suggestion'],
        ])->save();

        return $asset->refresh();
    }
}
