<?php

namespace App\Modules\Asset\Support;

final class AssetFileRules
{
    /**
     * @return list<string>
     */
    public static function constraints(): array
    {
        return [
            'file',
            'max:10240',
            'mimes:jpg,jpeg,png,webp,gif,svg,mp4,webm,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,txt',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function messages(string $attribute): array
    {
        return [
            $attribute.'.max' => 'Each file may not be larger than 10MB.',
            $attribute.'.mimes' => 'Unsupported file type.',
        ];
    }
}
