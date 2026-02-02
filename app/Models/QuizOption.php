<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizOption extends Model
{
    // INI WAJIB ADA AGAR BISA DISIMPAN
    protected $fillable = [
        'quiz_question_id',
        'option_text',
        'is_correct',
    ];

    public function question()
    {
        return $this->belongsTo(QuizQuestion::class);
    }
}