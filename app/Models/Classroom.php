<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = ['name', 'description', 'academic_year'];

    // Relasi ke Semua User
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    // Filter Khusus Guru
    public function teachers()
    {
        return $this->belongsToMany(User::class)->where('role', 'guru');
    }

    // Filter Khusus Siswa
    public function students()
    {
        return $this->belongsToMany(User::class)->where('role', 'siswa');
    }

    // --- TAMBAHKAN INI (YANG BIKIN ERROR) ---
    public function materials()
    {
        return $this->hasMany(ClassMaterial::class);
    }

    // --- TAMBAHKAN INI JUGA (UNTUK FITUR KUIS NANTI) ---
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}