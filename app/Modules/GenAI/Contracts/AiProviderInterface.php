<?php

namespace App\Modules\GenAI\Contracts;

interface AiProviderInterface
{
    public function complete(string $prompt): string;
}
