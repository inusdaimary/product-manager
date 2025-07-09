<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = ['total', 'paid', 'due'];

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
