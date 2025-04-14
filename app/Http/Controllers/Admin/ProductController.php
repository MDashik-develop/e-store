<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
                'description' => 'nullable',
                'stock' => 'required|integer|min:0',
                'size' => 'nullable|array',
                'size.*' => 'string|max:10',
                'color' => 'nullable|array',
                'color.*' => 'string|max:50',
                'category_id' => 'required|array', // Updated to handle an array of categories
                'category_id.*' => 'exists:categories,id', // Validating each category ID exists in the categories table
                'status' => 'required|boolean',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'primary_image' => 'nullable|integer|min:0',
            ]);

        // Convert array fields to JSON if needed
            if (isset($validated['size'])) {
                $validated['size'] = json_encode($validated['size']);
            }
            if (isset($validated['color'])) {
                $validated['color'] = json_encode($validated['color']);
            }
            if (isset($validated['category_id'])) {
                $validated['category_id'] = json_encode($validated['category_id']); // Convert category_ids array to JSON
            }
            
        // Generate slug
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        // Step 2: Create the product
             $product = Product::create($validated);

        // Step 3: Handle images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $random = rand(10000, 99999);
                    $extension = $image->getClientOriginalExtension();
                    $filename = "{$product->id}-" . Str::slug($product->name) . "-{$random}.{$extension}";

                    $imagePath = $image->storeAs('products', $filename, 'public');

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image' => $imagePath,
                        'is_primary' => $index == $request->primary_image,
                    ]);
                }
            }

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
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'stock' => 'nullable|integer',
            'status' => 'required|boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'primary_image' => 'nullable|string',
            'deleted_images' => 'nullable|array',
        ]);
    
        $product->update($validated);
    
        // Handle deletion of images
        if ($request->has('deleted_images')) {
            foreach ($request->deleted_images as $deletedImage) {
                $imageRecord = $product->images()->where('image', $deletedImage)->first();
                if ($imageRecord) {
                    Storage::disk('public')->delete($imageRecord->image);
                    $imageRecord->delete();
                }
            }
        }
    
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $random = rand(10000, 99999);
                $extension = $image->getClientOriginalExtension();
                $filename = "{$product->id}-" . Str::slug($product->name) . "-{$random}.{$extension}";
    
                $path = $image->storeAs('products', $filename, 'public');
    
                $product->images()->create([
                    'image' => $path,
                    'is_primary' => $index == $request->primary_image,
                ]);
            }
        }
    
        // Update the primary image flag
        if ($request->filled('primary_image')) {
            $product->images()->update(['is_primary' => false]);
            $product->images()->where('image', $request->primary_image)->update(['is_primary' => true]);
        }
    
        // Redirect with success message
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
