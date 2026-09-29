<?php

namespace App\Shared\Exceptions;

use Exception;

class FolderDepthExceededException extends Exception
{
    public function __construct()
    {
        parent::__construct('Folders cannot be nested deeper than 2 levels.');
    }
}
