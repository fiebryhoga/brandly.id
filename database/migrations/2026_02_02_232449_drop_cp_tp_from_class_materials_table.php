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
        Schema::table('class_materials', function (Blueprint $table) {
            $table->dropColumn(['cp', 'tp']);
        });
    }

    public function down(): void
    {
        Schema::table('class_materials', function (Blueprint $table) {
            $table->text('cp')->nullable();
            $table->text('tp')->nullable();
        });
    }
};
