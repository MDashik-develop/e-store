<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Show the product fetch page.
     */
    public function index()
    {
        $products = Product::with(['images' => function ($query) {
            $query->where('is_primary', true);
        }])->latest()->get();

        // fetch all orders
        $orders = Order::all();

        return Inertia::render('Admin/Order/Index', [
            'products' => $products,
            'orders' => $orders,
        ]);
    }
    
    /**
     * Delete the order
     */
    public function destroy($id)
    {
        $order = Order::find($id);
        if ($order) {
            $order->delete();
            return redirect()->back()->with('success', 'Order deleted successfully.');
        } else {
            return redirect()->back()->with('error', 'Order not found.');
        }
    }
}