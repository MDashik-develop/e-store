<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\ProductImage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Show the product fetch page.
     */
    public function index()
    {
        // ✅ Only primary images loaded
        $products = Product::with(['images' => function ($query) {
            $query->where('is_primary', true);
        }])->latest()->get();

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the product create page.
     */
    public function create()
    {
        $caregories = Category::all();
        return Inertia::render('Admin/Product/Create', [
            'categories' => $caregories
        ]);
        return Inertia::render('Admin/Product/Create');
    }

    /**
     * Store a new product in the database.
     */
    public function store(Request $request)
    {
        // Step 1: Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'status' => 'required|boolean',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048', // Validate each image
        ]);

        // Step 2: Create the product record
        $product = Product::create($validated);

        // Step 3: Handle Image Upload (with custom filename format)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                // Step 3.1: Generate a custom filename like the category format
                $random = rand(10000, 99999);
                $extension = $image->getClientOriginalExtension();
                $filename = "{$product->id}-" . Str::slug($product->name) . "-{$random}." . $extension;

                // Step 3.2: Store the image with the custom filename
                $imagePath = $image->storeAs('products', $filename, 'public');

                // Step 3.3: Save the image details to the ProductImage table
                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $imagePath,
                    'is_primary' => $index === 0, // Set first image as primary
                ]);
            }
        }

        // Step 4: Redirect with success message
        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        // Load images with URLs for display
        $images = $product->images->map(function ($image) {
            $image->url = asset('storage/' . $image->image);
            return $image;
        });

        return Inertia::render('Admin/Product/Edit', [
            'product' => $product,
            'images' => $images,  // Pass images to the frontend
            'categories' => Category::all(),  // Ensure categories are passed too
        ]);
    }



    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Product $product)
    {
        // Validate the input fields
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'status' => 'required|boolean',
        ]);

        // Update product information
        $product->update([
            'name' => $validated['name'],
            'status' => $validated['status'],
        ]);

        // Handle the uploaded images
        if ($request->hasFile('images')) {
            // Handle the new images (store them in the storage and add to the product)
            foreach ($request->file('images') as $image) {
                // Store the new image in the public storage
                $imagePath = $image->store('products', 'public');
                $product->images()->create([
                    'image' => $imagePath,
                    'is_primary' => $request->primary_image == $image->getClientOriginalName(),
                ]);
            }
        }

        // Handle the deletion of images (delete from both storage and the database)
        if ($request->has('deleted_images')) {
            $deletedImages = $request->deleted_images;

            foreach ($deletedImages as $deletedImage) {
                // Remove from the database
                $imageRecord = $product->images()->where('image', $deletedImage)->first();
                if ($imageRecord) {
                    // Delete the image from storage
                    Storage::disk('public')->delete($deletedImage);
                    $imageRecord->delete();
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $productImages = $product->images;
        foreach ($productImages as $productImage) {
            if ($productImage->image && Storage::disk('public')->exists($productImage->image)) {
                Storage::disk('public')->delete($productImage->image);
            }
        }

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
