<?php

namespace App\Modules\Folder\Support;

final class FolderDepth
{
    /**
     * Maximum folder depth index (0 = parent, 1 = child, 2 = grandchild).
     * Allows three nesting levels under Library.
     */
    public const MAX = 2;

    public static function canNestUnder(int $parentDepth): bool
    {
        return ($parentDepth + 1) <= self::MAX;
    }
}
