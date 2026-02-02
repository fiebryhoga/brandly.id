<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = [
        'quiz_id',
        'question_text',
        'points',
    ];

    public function options()
    {
        return $this->hasMany(QuizOption::class);
    }
}