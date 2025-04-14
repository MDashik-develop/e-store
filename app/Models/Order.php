<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'customer_name',
        'phone',
        'address',
        'email',
        'shipping_address',
        'product_id',
        'quantity',
        'product_name',
        'product_description',
        'product_price',
        'product_discount',
        'product_size',
        'product_color',
        'total_amount',
        'status',
        'payment_method',
        'delivery_date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}