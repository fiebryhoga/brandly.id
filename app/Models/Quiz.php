<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'classroom_id',
        'class_topic_id',
        'title',
        'description',
        'duration_minutes',
        'is_active',
    ];

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }
    
    // Relasi balik ke Topik (Opsional tapi bagus ada)
    public function topic()
    {
        return $this->belongsTo(ClassTopic::class, 'class_topic_id');
    }
}