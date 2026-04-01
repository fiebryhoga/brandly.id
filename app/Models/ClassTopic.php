<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassTopic extends Model
{
    protected $fillable = ['classroom_id', 'title'];

    // Topik punya banyak materi/kegiatan
    public function materials()
    {
        return $this->hasMany(ClassMaterial::class)->latest();
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}