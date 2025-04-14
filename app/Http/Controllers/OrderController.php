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
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'customer_name'    => 'required|string|max:255',
            'phone'            => 'required|string|max:20',
            'email'            => 'required|email|max:255',
            'address'          => 'required|string',
            'price'            => 'required|numeric|min:0',
            'quantity'         => 'required|min:1',
            'total_amount'     => 'required|numeric|min:0',
            'size'             => 'array',
            'color'            => 'array',
            'product_name'     => 'required|string|max:100',
            'product_description' => 'nullable|string',
            'payment_method'   => 'nullable|string',
            'delivery_date'    => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        // Create order record
        $order = Order::create([
            'user_id'          => auth()->id(), // Optional: Use user authentication if required
            'customer_name'    => $request->customer_name,
            'phone'            => $request->phone,
            'email'            => $request->email,
            'shipping_address' => $request->shipping_address,
            'address'          => $request->address,
            'product_price'            => $request->price,
            'quantity'         => $request->quantity,
            'total_amount'     => $request->total_amount,
'size' => json_encode($request->input('size', [])),
'color' => json_encode($request->input('color', [])),
            'product_name'     => $request->product_name,
            'product_id'       => $request->product_id, // Add product_id here    
            'product_description' => $request->product_description,
            'payment_method'   => $request->payment_method,
            'delivery_date'    => $request->delivery_date,
            'status'           => 'pending', // Default order status
        ]);


        return redirect()->route('home')->with('success', __('Order placed successfully!'));
    }
}
