<?php

use App\Modules\Folder\Controllers\FolderController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('folders', [FolderController::class, 'store'])->name('folders.store');
    Route::put('folders/{folder}', [FolderController::class, 'update'])->name('folders.update');
    Route::put('folders/{folder}/move', [FolderController::class, 'move'])->name('folders.move');
    Route::delete('folders/{folder}', [FolderController::class, 'destroy'])->name('folders.destroy');
});
