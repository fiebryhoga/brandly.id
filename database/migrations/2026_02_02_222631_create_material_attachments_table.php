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
        Schema::create('material_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('class_material_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['pdf', 'video', 'link']);
            $table->string('file_path')->nullable(); // Untuk file upload
            $table->string('url')->nullable();       // Untuk link external
            $table->timestamps();
        });
        
        // Opsional: Hapus kolom lama di class_materials agar bersih (karena sudah dipindah ke sini)
        Schema::table('class_materials', function (Blueprint $table) {
            $table->dropColumn(['type', 'file_path', 'external_url']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_attachments');
    }
};
