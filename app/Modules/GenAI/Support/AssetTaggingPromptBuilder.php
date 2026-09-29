<?php

namespace App\Modules\GenAI\Support;

use App\Modules\Asset\Models\Asset;
use App\Modules\Brand\Models\Brand;
use App\Modules\GenAI\Exceptions\AiProviderException;
use RuntimeException;

final class AssetTaggingPromptBuilder
{
    /**
     * @return array{
     *     asset_name: string,
     *     asset_type: string,
     *     asset_url: string,
     *     folder_name: string,
     *     brand_name: string,
     *     primary_color: string,
     *     secondary_color: string
     * }
     */
    public function context(Asset $asset, ?Brand $brand): array
    {
        $folderName = $asset->folder?->name;

        return [
            'asset_name' => $asset->name,
            'asset_type' => $asset->type->value,
            'asset_url' => $asset->url,
            'folder_name' => $folderName !== null && $folderName !== '' ? $folderName : 'n/a',
            'brand_name' => $brand?->name ?: 'n/a',
            'primary_color' => $brand?->primary_color ?: 'n/a',
            'secondary_color' => $brand?->secondary_color ?: 'n/a',
        ];
    }

    /**
     * @param  array<string, string>  $replacements
     */
    public function build(array $replacements): string
    {
        $path = (string) config('ai.prompt_path');

        if (! is_file($path)) {
            throw new AiProviderException('AI prompt template is missing.');
        }

        $template = file_get_contents($path);

        if ($template === false) {
            throw new RuntimeException('Unable to read AI prompt template.');
        }

        $search = [];
        $replace = [];

        foreach ($replacements as $key => $value) {
            $search[] = '{{'.$key.'}}';
            $replace[] = $value;
        }

        return str_replace($search, $replace, $template);
    }
}
