<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'brand',
        'warranty',
        'date_expire',
        'description',
        'QTy',
        'Grossprice',
        'Totalprice',
        'image',
        'status',
    ];

    public function category()
    {
        return $this->belongsTo(\App\Models\Category::class);
    }
}

