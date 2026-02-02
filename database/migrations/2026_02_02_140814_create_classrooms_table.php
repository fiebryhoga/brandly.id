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
        // Tabel Kelas Utama
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Contoh: X RPL 1
            $table->string('description')->nullable(); // Contoh: Kelas Rekayasa Perangkat Lunak
            $table->string('academic_year')->nullable(); // Contoh: 2025/2026
            $table->timestamps();
        });

        // Tabel Pivot (Penghubung User <-> Kelas)
        Schema::create('classroom_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classroom_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            // Mencegah duplikasi user yang sama di kelas yang sama
            $table->unique(['classroom_id', 'user_id']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
