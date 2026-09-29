<?php

namespace App\Shared\Exceptions;

use Exception;

class LastRootFolderException extends Exception
{
    public function __construct()
    {
        parent::__construct(
            'Keep at least one parent folder at the top level.',
        );
    }
}
