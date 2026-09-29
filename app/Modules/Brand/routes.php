<?php

use App\Modules\Brand\Controllers\BrandController;
use App\Modules\Brand\Controllers\BrandLogoController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('brand', [BrandController::class, 'edit'])->name('brand.edit');
    Route::put('brand', [BrandController::class, 'update'])->name('brand.update');
    Route::delete('brand', [BrandController::class, 'destroy'])->name('brand.destroy');
    Route::post('brand/logo', [BrandLogoController::class, 'store'])
        ->name('brand.logo.store');
});
