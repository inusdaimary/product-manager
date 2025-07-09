<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Category;
class CategoryController extends Controller
{
 
    public  function  index(Request  $request)
    {
         $categories = DB::table('categories')->select('id', 'name')->get();


           return response()->json($categories);
    }

 public function categorieslist(Request $request)
{
    $categories = DB::table('categories')->select('id', 'name')->get();

    return response()->json($categories);
}

  public function addCategory(Request $request)
{
    $name = trim($request->name);
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $exists = DB::table('categories')->where('name', $name)->exists();

    if ($exists) {
        return response()->json(['message' => 'Category already exists'], 409);
    }

    DB::table('categories')->insert([
        'name' => $name,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json(['message' => 'Category added successfully']);
}


public function summary()
{
    $categories = \App\Models\Category::withCount('products')->get();

    $summary = $categories->map(function ($category) {
        return [
            'name' => $category->name,
            'value' => $category->products_count
        ];
    });

    $totalProducts = \DB::table('products')->count();
    $totalCategories = \DB::table('categories')->count();

    return response()->json([
        'summary' => $summary,
        'totalProducts' => $totalProducts,
        'totalCategories' => $totalCategories,
    ]);
}




 public function update(Request $request, string $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $category = Category::findOrFail($id);
    $category->name = $request->name;
    $category->save();

    return response()->json([
        'status' => 1,
        'message' => 'Category updated successfully',
        'category' => $category
    ]);
}


    public function destroy(string $id)
    {
        
    }
}
