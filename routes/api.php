<?php

use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->middleware('auth:sanctum')->group(function () {
    Route::get('/templates', [TemplateController::class, 'index']);
    Route::post('/templates', [TemplateController::class, 'store']);
    Route::put('/templates/{template}', [TemplateController::class, 'update']);
    Route::delete('/templates/{template}', [TemplateController::class, 'destroy']);
});