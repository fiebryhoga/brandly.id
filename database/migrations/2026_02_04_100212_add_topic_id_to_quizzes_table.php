<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            // Menambahkan kolom class_topic_id agar Kuis menempel langsung ke Topik
            $table->foreignId('class_topic_id')
                  ->nullable()
                  ->after('classroom_id')
                  ->constrained()
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropForeign(['class_topic_id']);
            $table->dropColumn('class_topic_id');
        });
    }
};