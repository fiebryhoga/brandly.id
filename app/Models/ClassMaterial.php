<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassMaterial extends Model
{
    protected $fillable = ['classroom_id', 'class_topic_id', 'title', 'description'];

    // Relasi One to Many (Satu materi punya banyak lampiran)
    public function attachments()
    {
        return $this->hasMany(MaterialAttachment::class);
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    // Tambahkan juga ini (Opsional, biar lengkap relasinya ke Topik)
    public function topic()
    {
        return $this->belongsTo(ClassTopic::class, 'class_topic_id');
    }
}