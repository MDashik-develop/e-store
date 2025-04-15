<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class OrderController extends Controller
{

    // show order form
    public function index(Request $request)
    {
        $id = $request->query('id');
        $products = Product::with('images')->find($id);

        return Inertia::render('Frontend/Order', [
            'products' => $products,
        ]);
    }


    // store order
    public function store(Request $request)
    {
        // sleep(2);
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'customer_name'    => 'required|string|max:255',
            'phone'            => 'required|string|max:20',
            'email'            => 'required|email|max:255',
            'address'          => 'required|string',
            'shipping_address' => 'required|string',
            'price'            => 'required|numeric|min:0',
            'quantity'         => 'required|min:1',
            'total_amount'     => 'required|numeric|min:0',
            'size'             => 'required|array', // Allow null or array
            'size.*'           => 'string|max:50',
            'color'            => 'required|array', // Allow null or array
            'color.*'          => 'string|max:50',
            'product_name'     => 'required|string|max:100',
            'product_description' => 'nullable|string',
            // 'payment_method'   => 'nullable|string',
            // 'delivery_date'    => 'nullable|date',
        ]);

        // Prepare validated data
        $validated = $validator->validated();

        // Convert array fields to JSON if needed
        if (isset($validated['size'])) {
            $validated['size'] = json_encode($validated['size']);
        }
        if (isset($validated['color'])) {
            $validated['color'] = json_encode($validated['color']);
        }

        // Create order record
        $order = Order::create([
            'user_id'          => auth()->id(),
            'customer_name'    => $validated['customer_name'],
            'phone'            => $validated['phone'],
            'email'            => $validated['email'],
            'address'          => $validated['address'],
            'quantity'         => $validated['quantity'],
            'total_amount'     => $validated['total_amount'],
            'shipping_address' => $request->shipping_address,
            'payment_method'   => "Cash on Delivery", // Assuming default payment method
            'product_price'    => $validated['price'],
            'product_size'     => $validated['size'] ?? null, // Save JSON or null
            'product_color'    => $validated['color'] ?? null, // Save JSON or null
            'product_name'     => $validated['product_name'],
            'product_id'       => $request->product_id,
            'product_description' => $validated['product_description'],
            // 'delivery_date'    => $validated['delivery_date'],
            // 'status'           => 'pending',
        ]);

        return redirect()->route('home')->with('success', __('Order placed successfully!'));
    }
}