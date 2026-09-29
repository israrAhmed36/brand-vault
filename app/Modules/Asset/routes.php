<?php

use App\Modules\Asset\Controllers\AssetApiController;
use App\Modules\Asset\Controllers\AssetController;
use App\Modules\Asset\Controllers\AssetFileController;
use App\Modules\Asset\Controllers\AssetPageController;
use App\Modules\Asset\Controllers\AssetTrashBulkController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('assets', [AssetPageController::class, 'index'])->name('assets.index');
    Route::get('assets/folder/{folder}', [AssetPageController::class, 'index'])
        ->name('assets.folder');
    Route::get('trash', [AssetPageController::class, 'trash'])->name('assets.trash');
    Route::post('trash/bulk-restore', [AssetTrashBulkController::class, 'restore'])
        ->name('assets.trash.bulk-restore');
    Route::delete('trash/bulk-destroy', [AssetTrashBulkController::class, 'forceDestroy'])
        ->name('assets.trash.bulk-destroy');

    Route::post('assets/upload', [AssetFileController::class, 'store'])
        ->name('assets.upload');
    Route::post('assets', [AssetController::class, 'store'])->name('assets.store');
    Route::put('assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
    Route::delete('assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');
    Route::post('assets/{asset}/restore', [AssetController::class, 'restore'])
        ->name('assets.restore');
    Route::delete('assets/{asset}/force', [AssetController::class, 'forceDestroy'])
        ->name('assets.force-destroy');

    Route::get('api/assets/search', [AssetApiController::class, 'search'])
        ->name('api.assets.search');
    Route::put('api/assets/{asset}/move', [AssetApiController::class, 'move'])
        ->name('api.assets.move');
});
