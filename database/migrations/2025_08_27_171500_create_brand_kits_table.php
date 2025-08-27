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
        Schema::create('brand_kits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('primary_color');
            $table->string('secondary_color');
            $table->string('accent_color');
            $table->string('font_family');
            $table->string('logo_url')->nullable();
            $table->string('watermark_text')->nullable();
            $table->timestamps();
            
            $table->unique('user_id'); // Ensure one brand kit per user
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brand_kits');
    }
};