<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Health check route for API
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Viral Quote Engine API is running',
    ]);
});
