<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'paid' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);

                if ($product->QTy < $item['saleQty']) {
                    return response()->json([
                        'error' => "{$product->name} has only {$product->QTy} in stock",
                    ], 422);
                }

                $total += $product->Grossprice * $item['saleQty'];
            }

            $invoice = Invoice::create([
                'total' => $total,
                'paid' => $request->paid,
                'due' => max($total - $request->paid, 0),
            ]);

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);
                $qty = $item['saleQty'];
                $price = $product->Grossprice;
                $subtotal = $qty * $price;

                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price' => $price,
                    'subtotal' => $subtotal,
                ]);

                $product->QTy -= $qty;
                $product->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Invoice created successfully',
                'invoice_id' => $invoice->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create invoice',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request ,$id)
{
    $invoice = Invoice::with('items.product')->findOrFail($id);
    return response()->json($invoice);
}

}
