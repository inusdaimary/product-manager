<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    protected $fillable = ['invoice_id', 'product_id', 'qty', 'price', 'subtotal'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
