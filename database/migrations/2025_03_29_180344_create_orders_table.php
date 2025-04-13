<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('customer_name', 100);
            $table->string('phone', 20);
            $table->text('address');
            $table->string('email')->nullable();
            $table->string('shipping_address')->nullable();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->string('product_name', 100);
            $table->string('product_description')->nullable();
            $table->decimal('product_price', 10, 2)->default(0.00);
            $table->decimal('product_discount', 10, 2)->default(0.00);
            $table->string('product_size')->nullable();
            $table->string('product_color')->nullable();
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->date('delivery_date')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
