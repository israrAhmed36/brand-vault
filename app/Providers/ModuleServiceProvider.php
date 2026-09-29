<?php

namespace App\Providers;

use App\Modules\Auth\Repositories\UserRepository;
use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Policies\BrandPolicy;
use App\Modules\Brand\Repositories\BrandRepository;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BrandRepositoryInterface::class, BrandRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(Brand::class, BrandPolicy::class);

        Route::middleware('web')
            ->group(base_path('app/Modules/Auth/routes.php'));

        Route::middleware('web')
            ->group(base_path('app/Modules/Brand/routes.php'));
    }
}
