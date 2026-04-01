<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $fillable = ['name', 'description', 'academic_year'];

    // ... relasi users, teachers, students yang lama ...
    public function users() { return $this->belongsToMany(User::class); }
    public function teachers() { return $this->belongsToMany(User::class)->where('role', 'guru'); }
    public function students() { return $this->belongsToMany(User::class)->where('role', 'siswa'); }
    
    // ... relasi materials & quizzes yang lama ...
    public function materials() { return $this->hasMany(ClassMaterial::class); }
    public function quizzes() { return $this->hasMany(Quiz::class); }

    // --- TAMBAHKAN DUA FUNGSI BARU INI ---
    
    // 1. Relasi ke Topik/BAB
    public function topics()
    {
        return $this->hasMany(ClassTopic::class);
    }

    // 2. Relasi ke Materi yang TIDAK punya Topik (Uncategorized)
    public function uncategorizedMaterials()
    {
        return $this->hasMany(ClassMaterial::class)->whereNull('class_topic_id');
    }
}