<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Viral Quote Engine API',
        'version' => '1.0.0'
    ]);
});