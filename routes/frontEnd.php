<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\FrontendController;

// Route::get('/', function () {
//     return Inertia::render('Frontend/Home');
// })->name('home');

// ===========Home===========
Route::get('/',[FrontendController::class,'Index'])->name('home');

// ===========order===========
Route::get('/orders',[OrderController::class,'index'])->name('order.index');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');