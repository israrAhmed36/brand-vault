<?php

use App\Modules\ActivityLog\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function (): void {
    Route::get('/activity-logs', [ActivityLogController::class, 'index'])
        ->name('activity-logs.index');
});
