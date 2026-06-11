<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');
Route::view('/privacy', 'legal.privacy');
Route::view('/consent', 'legal.consent');
Route::view('/offer', 'legal.offer');
