<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    //

    protected $fillable = ['classroom_id', 'title', 'description', 'duration_minutes', 'is_active'];

    public function questions() {
        return $this->hasMany(QuizQuestion::class);
    }
}
