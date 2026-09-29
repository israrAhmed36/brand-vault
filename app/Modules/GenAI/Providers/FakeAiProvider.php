<?php

namespace App\Modules\GenAI\Providers;

use App\Modules\GenAI\Contracts\AiProviderInterface;

class FakeAiProvider implements AiProviderInterface
{
    public function complete(string $prompt): string
    {
        preg_match('/Name:\s*(.+)/', $prompt, $nameMatch);
        $name = isset($nameMatch[1]) ? strtolower(trim($nameMatch[1])) : 'asset';
        $slug = preg_replace('/[^a-z0-9]+/', '-', $name) ?: 'asset';

        return json_encode([
            'tags' => array_values(array_unique([
                'library',
                'brand',
                explode('-', (string) $slug)[0] ?: 'asset',
            ])),
            'description' => 'Short internal description derived from available asset metadata.',
            'usage_suggestion' => 'Best used in campaigns or placements that match this asset type.',
        ], JSON_THROW_ON_ERROR);
    }
}
