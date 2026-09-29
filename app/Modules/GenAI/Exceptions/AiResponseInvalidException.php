<?php

namespace App\Modules\GenAI\Exceptions;

use Exception;

class AiResponseInvalidException extends Exception
{
    /**
     * @param  array<string, mixed>  $fields
     */
    public function __construct(
        string $message = 'AI response failed validation, please retry.',
        private readonly array $fields = [],
    ) {
        parent::__construct($message);
    }

    /**
     * @return array<string, mixed>
     */
    public function fields(): array
    {
        return $this->fields;
    }
}
