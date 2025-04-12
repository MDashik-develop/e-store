<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // সব ক্যাটাগরি ফেচ করে Index পেজে পাঠানো
        $categories = Category::latest()->get();
        return Inertia::render('Admin/Categories/Index', ['categories' => $categories]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Step 1: Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'status' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        // Step 2: Save initial category to get the ID
        $category = Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'status' => $validated['status'],
            // image is left empty for now
        ]);

        // Step 3: Handle Image Upload (with custom filename)
        if ($request->hasFile('image')) {
            $image = $request->file('image');

            $random = rand(10000, 99999);
            $extension = $image->getClientOriginalExtension();
            $filename = "{$category->id}-" . Str::slug($category->name) . "-{$random}." . $extension;

            // storeAs('folder', 'filename', 'disk')
            $imagePath = $image->storeAs('categories', $filename, 'public');

            // Step 4: Update category with image path
            $category->update([
                'image' => $imagePath,
            ]);
        }

        // Step 5: Redirect with success message
        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        // নির্দিষ্ট ক্যাটাগরি Edit পেজে পাঠানো
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        // আপডেট করার সময় ভ্যালিডেশন চেক
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'status' => 'required|boolean',
        ]);

        // ক্যাটাগরি আপডেট করা
        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'status' => $validated['status'],
        ]);

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // ১. যদি ইমেজ থাকে, তাহলে ডিলিট করো
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        // ২. ডেটাবেস থেকে ক্যাটাগরি ডিলিট করো
        $category->delete();

        // ৩. রিডাইরেক্ট ব্যাক উইথ মেসেজ
        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}
