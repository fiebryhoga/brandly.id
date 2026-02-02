<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function start($id)
    {
        // Nanti kita isi logika ujian di sini
        return "Halaman Ujian Siswa untuk Kuis ID: " . $id; 
    }
}