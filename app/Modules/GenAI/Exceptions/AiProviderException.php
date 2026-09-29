<?php

namespace App\Modules\GenAI\Exceptions;

use Exception;
use Throwable;

class AiProviderException extends Exception
{
    public function __construct(
        string $message = 'AI provider request failed.',
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }
}
