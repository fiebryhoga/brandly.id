<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialAttachment extends Model
{
    protected $fillable = ['class_material_id', 'title', 'type', 'file_path', 'url'];
}
