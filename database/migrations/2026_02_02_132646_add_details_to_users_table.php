<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Foto Profil (bisa null jika belum upload)
            $table->string('avatar')->nullable()->after('email');
            
            // NIP (Khusus Guru, nullable karena Admin/Siswa tidak punya)
            $table->string('nip')->nullable()->unique()->after('role');
            
            // NIS (Khusus Siswa, nullable karena Admin/Guru tidak punya)
            $table->string('nis')->nullable()->unique()->after('nip');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar', 'nip', 'nis']);
        });
    }
};