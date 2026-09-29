<?php

namespace App\Providers;

use App\Modules\Asset\Models\Asset;
use App\Modules\Asset\Policies\AssetPolicy;
use App\Modules\Asset\Repositories\AssetRepository;
use App\Modules\Asset\Repositories\AssetRepositoryInterface;
use App\Modules\Auth\Repositories\UserRepository;
use App\Modules\Auth\Repositories\UserRepositoryInterface;
use App\Modules\Brand\Models\Brand;
use App\Modules\Brand\Policies\BrandPolicy;
use App\Modules\Brand\Repositories\BrandRepository;
use App\Modules\Brand\Repositories\BrandRepositoryInterface;
use App\Modules\Folder\Models\Folder;
use App\Modules\Folder\Policies\FolderPolicy;
use App\Modules\Folder\Repositories\FolderRepository;
use App\Modules\Folder\Repositories\FolderRepositoryInterface;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(BrandRepositoryInterface::class, BrandRepository::class);
        $this->app->bind(FolderRepositoryInterface::class, FolderRepository::class);
        $this->app->bind(AssetRepositoryInterface::class, AssetRepository::class);
    }

    public function boot(): void
    {
        Gate::policy(Brand::class, BrandPolicy::class);
        Gate::policy(Folder::class, FolderPolicy::class);
        Gate::policy(Asset::class, AssetPolicy::class);

        Route::middleware('web')
            ->group(base_path('app/Modules/Auth/routes.php'));

        Route::middleware('web')
            ->group(base_path('app/Modules/Brand/routes.php'));

        Route::middleware('web')
            ->group(base_path('app/Modules/Folder/routes.php'));

        Route::middleware('web')
            ->group(base_path('app/Modules/Asset/routes.php'));
    }
}
