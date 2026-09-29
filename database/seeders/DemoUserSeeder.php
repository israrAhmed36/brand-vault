<?php

namespace Database\Seeders;

use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Auth\Support\DemoCredentials;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    public function run(UserRepositoryInterface $users): void
    {
        $users->firstOrCreateDemo(
            DemoCredentials::NAME,
            DemoCredentials::EMAIL,
            DemoCredentials::PASSWORD,
        );
    }
}
