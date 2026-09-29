<?php

use App\Modules\GenAI\Controllers\AiTaggingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function (): void {
    Route::post('api/assets/{asset}/generate-tags', [AiTaggingController::class, 'generate'])
        ->middleware('throttle:10,1')
        ->name('api.assets.generate-tags');

    Route::put('api/assets/{asset}/tags', [AiTaggingController::class, 'save'])
        ->name('api.assets.tags');
});
