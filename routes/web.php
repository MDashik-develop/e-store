<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

Route::get('/', function () {
    return Inertia::render('Frontend/Home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('/', function () {
            return Inertia::render('dashboard');
        });

        Route::resource('categories', CategoryController::class);
        Route::resource('products', ProductController::class);
    });
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
