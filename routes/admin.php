<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('/', function () {
            return Inertia::render('dashboard');
        });

        Route::resource('categories',AdminCategoryController::class);
        Route::resource('products', AdminProductController::class);

        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        // Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        // Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });
});

