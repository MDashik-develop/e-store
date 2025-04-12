<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendController extends Controller
{
    //
    public function Index()
    {
        // $categories = Category::where('status', 1)->get(); // Fetch only active categories
        // return Inertia::render('Frontend/Home', [
        //     "categories" => $categories
        // ]);
        return Inertia::render('Frontend/Home', [
            'categories' => Category::where('status', 1)->get()
        ]);
        
        
    }
}
