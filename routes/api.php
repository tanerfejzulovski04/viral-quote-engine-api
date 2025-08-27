<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandKitController;
use App\Http\Controllers\UploadController;
use App\Models\BrandKit;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::post('/test', function () {
    return response()->json(['message' => 'POST API is working']);
});

// Brand Kit routes (without authentication for testing)
Route::get('/brand-kit', [BrandKitController::class, 'show']);
Route::post('/brand-kit', [BrandKitController::class, 'upsert']);

// Upload routes
Route::post('/uploads/logo', [UploadController::class, 'uploadLogo']);