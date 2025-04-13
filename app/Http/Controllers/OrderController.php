<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{

    // show order form
    public function index(Request $request)
    {
        $id = $request->query('id');
        $products = Product::with('images')->find($id); // Not $products

        return Inertia::render('Frontend/Order', [
            'products' => $products,
        ]);
    }

    // store order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone'         => 'required|string|max:20',
            'address'       => 'required|string',
            'total_amount'  => 'required|numeric',
        ]);

        $order = Order::create([
            'user_id'       => auth()->id(), // Or pass user_id from request
            'customer_name' => $validated['customer_name'],
            'phone'         => $validated['phone'],
            'address'       => $validated['address'],
            'total_amount'  => $validated['total_amount'],
            'status'        => 'pending',
        ]);

        return response()->json([
            'message' => 'Order placed successfully!',
            'order'   => $order
        ]);
    }
}
