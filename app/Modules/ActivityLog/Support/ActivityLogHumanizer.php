<?php

namespace App\Modules\ActivityLog\Support;

final class ActivityLogHumanizer
{
    private const ROOT_LABEL = 'Library (root)';

    private const HIDDEN_KEYS = ['id', 'depth'];

    /**
     * @param  array<string, mixed>|null  $values
     * @param  array<int, string>  $folderNamesById
     * @return array<string, mixed>|null
     */
    public static function values(?array $values, array $folderNamesById): ?array
    {
        if ($values === null) {
            return null;
        }

        $humanized = [];

        foreach ($values as $key => $value) {
            if (in_array($key, self::HIDDEN_KEYS, true)) {
                continue;
            }

            if ($key === 'folder_id' || $key === 'parent_id') {
                $label = $key === 'folder_id' ? 'folder' : 'parent';
                $humanized[$label] = self::resolveFolderLabel($value, $folderNamesById);

                continue;
            }

            if (($key === 'folder' || $key === 'parent') && self::isNumericId($value)) {
                $humanized[$key] = self::resolveFolderLabel($value, $folderNamesById);

                continue;
            }

            $humanized[$key] = $value;
        }

        return $humanized;
    }

    /**
     * @param  array<int, string>  $folderNamesById
     */
    private static function resolveFolderLabel(mixed $folderId, array $folderNamesById): string
    {
        if ($folderId === null || $folderId === '') {
            return self::ROOT_LABEL;
        }

        if (! self::isNumericId($folderId)) {
            return (string) $folderId;
        }

        $id = (int) $folderId;

        return $folderNamesById[$id] ?? 'Unknown folder';
    }

    private static function isNumericId(mixed $value): bool
    {
        return is_int($value) || (is_string($value) && ctype_digit($value));
    }
}
