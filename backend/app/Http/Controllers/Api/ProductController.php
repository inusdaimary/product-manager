<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
class ProductController extends Controller
{
    
  public function index()
{
    $products = Product::orderBy('created_at', 'desc')->get();

    return response()->json($products);
}

    
   public function addProduct(Request $request)
{
    // Validate form fields
    $request->validate([
        'category_id' => 'required|exists:categories,id',
        'name' => 'required|string|max:255',
        'brand' => 'nullable|string|max:255',
        'warranty' => 'nullable|string|max:255',
        'date_expire' => 'nullable|date',
        'description' => 'nullable|string',
        'QTy' => 'required|integer|min:1',
        'Grossprice' => 'required|numeric|min:0',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,jfif|max:2048',
    ]);

    // Calculate total price
    $totalPrice = $request->Grossprice * $request->QTy;

    // Handle image upload
    $imagePath = null;
    if ($request->hasFile('image')) {
        $file = $request->file('image');
        $uniqueName = 'product_' . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/products'), $uniqueName);
        $imagePath = 'uploads/products/' . $uniqueName;
    }

    // Create product
    $product = Product::create([
        'category_id' => $request->category_id,
        'name' => $request->name,
        'brand' => $request->brand,
        'warranty' => $request->warranty,
        'date_expire' => $request->date_expire,
        'description' => $request->description,
        'QTy' => $request->QTy,
        'Grossprice' => $request->Grossprice,
        'Totalprice' => $totalPrice,
        'image' => $imagePath,
        'status' => 1,
    ]);

    return response()->json([
        'message' => 'Product added successfully',
        'product' => $product
    ], 201);
}

public function updateProduct(Request $request, $id)
{
    // Validate input
    $request->validate([
        'category_id' => 'required|exists:categories,id',
        'name' => 'required|string|max:255',
        'brand' => 'nullable|string|max:255',
        'warranty' => 'nullable|string|max:255',
        'date_expire' => 'nullable|date',
        'description' => 'nullable|string',
        'QTy' => 'required|integer|min:1',
        'Grossprice' => 'required|numeric|min:0',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,jfif|max:2048',
    ]);

    $product = Product::findOrFail($id);

    // Calculate total price
    $totalPrice = $request->Grossprice * $request->QTy;

    // Handle optional new image upload
    if ($request->hasFile('image')) {
        // Delete old image
        if ($product->image && File::exists(public_path($product->image))) {
            File::delete(public_path($product->image));
        }

        $file = $request->file('image');
        $uniqueName = 'product_' . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/products'), $uniqueName);
        $product->image = 'uploads/products/' . $uniqueName;
    }

    // Update other fields
    $product->update([
        'category_id' => $request->category_id,
        'name' => $request->name,
        'brand' => $request->brand,
        'warranty' => $request->warranty,
        'date_expire' => $request->date_expire,
        'description' => $request->description,
        'QTy' => $request->QTy,
        'Grossprice' => $request->Grossprice,
        'Totalprice' => $totalPrice,
        'status' => 1,
    ]);

    return response()->json([
        'message' => 'Product updated successfully',
        'product' => $product
    ]);
}

public function deleteProduct(Request $request, $id)
{
    $product = Product::findOrFail($id);

    if ($product->image && File::exists(public_path($product->image))) {
        File::delete(public_path($product->image));
    }
    $product->delete(); 

    return response()->json([
        'message' => 'Product deleted successfully'
    ], 200);
}
  
}
