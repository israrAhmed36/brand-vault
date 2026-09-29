<?php

namespace App\Modules\ActivityLog\Enums;

enum ActivityAction: string
{
    case Created = 'created';
    case Updated = 'updated';
    case Deleted = 'deleted';
    case Moved = 'moved';
    case Trashed = 'trashed';
    case Restored = 'restored';
    case ForceDeleted = 'force_deleted';
}
