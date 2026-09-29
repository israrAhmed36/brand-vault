<?php

namespace App\Shared\Exceptions;

use Exception;

class FolderNotEmptyException extends Exception
{
    public function __construct()
    {
        parent::__construct('Remove child folders and assets before deleting this folder.');
    }
}
