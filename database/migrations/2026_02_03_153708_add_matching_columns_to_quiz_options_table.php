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
        Schema::table('quiz_options', function (Blueprint $table) {
            // Kolom untuk sisi Kanan (Target Jodoh)
            $table->string('matching_pair')->nullable()->after('option_text');
            
            // Kolom untuk Gambar (Jika soal berupa gambar)
            $table->string('left_image')->nullable()->after('matching_pair');
            $table->string('right_image')->nullable()->after('left_image');
        });
    }

    public function down(): void
    {
        Schema::table('quiz_options', function (Blueprint $table) {
            $table->dropColumn(['matching_pair', 'left_image', 'right_image']);
        });
    }
};
