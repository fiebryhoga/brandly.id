<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassMaterial extends Model
{
    // Tambahkan ini agar bisa di-input
    protected $fillable = [
        'classroom_id',
        'title',
        'description',
        'type',
        'file_path',
        'external_url',
    ];

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}