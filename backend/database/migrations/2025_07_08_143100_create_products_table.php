<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
$table->foreignId('category_id')->constrained()->onDelete('cascade');
$table->string('name');
$table->string('brand')->nullable();
$table->string('warranty')->nullable();
$table->date('date_expire')->nullable();
$table->text('description')->nullable();
$table->tinyInteger('QTy')->default(1);
$table->decimal('Grossprice', 10, 2);
$table->decimal('Totalprice', 10, 2);
$table->string('image')->nullable();
$table->tinyInteger('status')->default(1);
$table->timestamps();
$table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};