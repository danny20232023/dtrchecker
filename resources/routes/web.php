<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app'); // This will load your app.blade.php
});

// You can add other web routes here if needed