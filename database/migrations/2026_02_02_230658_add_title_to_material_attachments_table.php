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
        Schema::table('material_attachments', function (Blueprint $table) {
            // Taruh setelah ID biar rapi
            $table->string('title')->after('id')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('material_attachments', function (Blueprint $table) {
            //
        });
    }
};
