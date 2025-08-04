<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DtrApiController; // Import your new controller

// Route for fetching all users
Route::get('/dtr/users', [DtrApiController::class, 'getUsers']);

// Route for fetching check-in/out logs for a specific user
Route::get('/dtr/checkinout/{userId}', [DtrApiController::class, 'getCheckinout']);

// You can keep Laravel's default user route if needed
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});