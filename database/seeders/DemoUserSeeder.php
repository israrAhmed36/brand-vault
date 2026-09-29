<?php

namespace Database\Seeders;

use App\Modules\Asset\Enums\AssetType;
use App\Modules\Asset\Repositories\AssetRepositoryInterface;
use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Auth\Support\DemoCredentials;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    public function run(
        UserRepositoryInterface $users,
        BrandRepositoryInterface $brands,
        FolderRepositoryInterface $folders,
        AssetRepositoryInterface $assets,
    ): void {
        $user = $users->firstOrCreateDemo(
            DemoCredentials::NAME,
            DemoCredentials::EMAIL,
            DemoCredentials::PASSWORD,
        );

        $brands->upsertForUser($user->id, [
            'name' => 'Nordic Demo Co',
            'primary_color' => '#111827',
            'secondary_color' => '#0F766E',
            'logo_url' => null,
            'default_font' => 'Montserrat',
        ]);

        if ($folders->childrenForUser($user->id, null)->isNotEmpty()) {
            return;
        }

        $campaigns = $folders->createForUser($user->id, [
            'name' => 'Campaigns',
            'parent_id' => null,
            'depth' => 0,
        ]);

        $social = $folders->createForUser($user->id, [
            'name' => 'Social',
            'parent_id' => $campaigns->id,
            'depth' => 1,
        ]);

        $samples = [
            ['Hero banner', AssetType::Image->value, 'https://example.com/hero.jpg', $campaigns->id],
            ['Brand film', AssetType::Video->value, 'https://example.com/film.mp4', $campaigns->id],
            ['Press kit', AssetType::Document->value, 'https://example.com/press.pdf', null],
            ['Landing page', AssetType::Link->value, 'https://example.com', $social->id],
            ['Icon pack', AssetType::Other->value, 'https://example.com/icons.zip', $social->id],
        ];

        foreach ($samples as [$name, $type, $url, $folderId]) {
            $assets->createForUser($user->id, [
                'name' => $name,
                'type' => $type,
                'url' => $url,
                'folder_id' => $folderId,
            ]);
        }
    }
}
