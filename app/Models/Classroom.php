<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = ['name', 'description', 'academic_year'];

    // Relasi ke User (Pivot)
    public function users()
    {
        return $this->belongsToMany(User::class);
    }

    // Guru
    public function teachers()
    {
        return $this->belongsToMany(User::class)->where('role', 'guru');
    }

    // Siswa
    public function students()
    {
        return $this->belongsToMany(User::class)->where('role', 'siswa');
    }

    // --- TAMBAHKAN DUA FUNGSI INI ---
    
    // Relasi ke Materi (LMS)
    public function materials()
    {
        return $this->hasMany(ClassMaterial::class);
    }

    // Relasi ke Kuis
    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}