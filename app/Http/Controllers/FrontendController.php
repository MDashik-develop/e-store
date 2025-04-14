<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{ 
    // Display the homepage with categories and products
    public function Index()
    {
        $categories = Category::where('status', 1)->get();
        $products = Product::with('images')->where('status', 1)->latest()->get();

        return Inertia::render('Frontend/Home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}