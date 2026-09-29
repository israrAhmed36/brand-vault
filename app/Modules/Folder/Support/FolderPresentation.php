<?php

namespace App\Modules\Folder\Support;

use App\Modules\Folder\Models\Folder;
use Illuminate\Support\Collection;

final class FolderPresentation
{
    /**
     * @param  Collection<int, Folder>  $folders
     * @return list<array{id: int|null, label: string}>
     */
    public static function options(Collection $folders): array
    {
        $byId = $folders->keyBy('id');
        $options = [
            ['id' => null, 'label' => 'Library (root)'],
        ];

        foreach ($folders as $folder) {
            $parts = [];
            $current = $folder;

            while ($current !== null) {
                array_unshift($parts, $current->name);
                $parentId = $current->parent_id;
                $current = $parentId !== null ? $byId->get($parentId) : null;
            }

            $options[] = [
                'id' => $folder->id,
                'label' => implode(' / ', $parts),
            ];
        }

        return $options;
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public static function breadcrumbs(?Folder $folder): array
    {
        if ($folder === null) {
            return [];
        }

        $crumbs = [];
        $current = $folder;

        while ($current !== null) {
            array_unshift($crumbs, [
                'id' => $current->id,
                'name' => $current->name,
            ]);
            $current = $current->parent;
        }

        return $crumbs;
    }
}
