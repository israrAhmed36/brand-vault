<?php

namespace Database\Seeders;

use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Auth\Support\DemoCredentials;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    public function run(
        UserRepositoryInterface $users,
        BrandRepositoryInterface $brands,
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
    }
}
