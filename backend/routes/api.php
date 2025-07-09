<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::middleware([
    EnsureFrontendRequestsAreStateful::class,
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
])->group(function () {
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
     Route::post('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'addCategory']);
     Route::post('/admin/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
     Route::post('/admin/products', [\App\Http\Controllers\Api\ProductController::class, 'index']);
     Route::post('/admin/add/products', [\App\Http\Controllers\Api\ProductController::class, 'addProduct']);
       Route::post('/admin/update/product/{id}', [\App\Http\Controllers\Api\ProductController::class, 'updateProduct']);
       Route::delete('/admin/deleteproducts/{id}', [\App\Http\Controllers\Api\ProductController::class, 'deleteproduct']);

       Route::post('/admin/sale', [\App\Http\Controllers\Api\InvoiceController::class, 'store']);
         Route::post('/admin/invoice/{id}', [\App\Http\Controllers\Api\InvoiceController::class, 'show']);
       
Route::put('/admin/editcategories/{id}', [\App\Http\Controllers\Api\CategoryController::class, 'update']);
     Route::post('/categories-list', [\App\Http\Controllers\Api\CategoryController::class, 'categorieslist']);
        Route::get('/admin/summary', [\App\Http\Controllers\Api\CategoryController::class, 'summary']);

    
      
   
});
