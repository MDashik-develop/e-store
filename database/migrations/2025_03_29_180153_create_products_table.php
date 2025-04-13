<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->string('slug')->unique();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->integer('featured')->default(0);
            // $table->foreignId('category_id')->constrained();
            $table->json('category_id');  // Changed this to json
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
