<?php

use App\Modules\Brand\Controllers\BrandController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('brand', [BrandController::class, 'edit'])->name('brand.edit');
    Route::put('brand', [BrandController::class, 'update'])->name('brand.update');
    Route::delete('brand', [BrandController::class, 'destroy'])->name('brand.destroy');
});
