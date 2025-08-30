<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Testing endpoints (no authentication required)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'OK', 'timestamp' => now()->toISOString()]);
});

// Profile endpoints requiring authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [UserController::class, 'profile']);
    Route::put('/me', [UserController::class, 'updateProfile']);
});