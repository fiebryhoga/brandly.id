<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Quiz;
use App\Models\ClassMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClassQuizController extends Controller
{
    // HALAMAN FORM BUAT KUIS (Full Page)
    public function create($id)
    {
        $classroom = Classroom::findOrFail($id);
        
        // Mengambil topik agar user bisa memilih topik saat buat kuis
        $topics = $classroom->topics()->orderBy('created_at')->get(['id', 'title']);

        return Inertia::render('Admin/Kuis/Create', [
            'classroom' => $classroom,
            'topics' => $topics
        ]);
    }

    // PROSES SIMPAN KUIS
    public function store(Request $request, $id)
    {
        // 1. Validasi Input
        $request->validate([
            'title' => 'required|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            // Pastikan 'matching' masuk dalam daftar validasi tipe
            'questions.*.type' => 'required|in:multiple_choice,true_false,short_answer,matching',
            'questions.*.points' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $id) {
            // 2. Buat Header Kuis
            $quiz = Quiz::create([
                'classroom_id' => $id,
                'title' => $request->title,
                'description' => $request->description, // HTML dari Rich Text Editor
                'duration_minutes' => $request->duration_minutes,
            ]);

            // 3. Loop Setiap Soal
            foreach ($request->questions as $qData) {
                // Simpan Data Soal Utama
                $question = $quiz->questions()->create([
                    'question_text' => $qData['text'],
                    'type' => $qData['type'],
                    'points' => $qData['points'],
                ]);

                // 4. Logika Penyimpanan Opsi Berdasarkan Tipe Soal
                
                // A. TIPE MATCHING (MENJODOHKAN / DRAG & DROP)
                if ($qData['type'] === 'matching') {
                    if (isset($qData['pairs']) && is_array($qData['pairs'])) {
                        foreach ($qData['pairs'] as $pair) {
                            $leftImgPath = null;
                            $rightImgPath = null;

                            // Upload Gambar Kiri (Jika ada)
                            if (isset($pair['left_image_file']) && $pair['left_image_file'] instanceof \Illuminate\Http\UploadedFile) {
                                $leftImgPath = $pair['left_image_file']->store('quiz_images', 'public');
                            }

                            // Upload Gambar Kanan (Jika ada)
                            if (isset($pair['right_image_file']) && $pair['right_image_file'] instanceof \Illuminate\Http\UploadedFile) {
                                $rightImgPath = $pair['right_image_file']->store('quiz_images', 'public');
                            }

                            // Simpan Pasangan
                            $question->options()->create([
                                'option_text' => $pair['left_text'] ?? null,    // Sisi Kiri
                                'matching_pair' => $pair['right_text'] ?? null, // Sisi Kanan (Jawaban Benar)
                                'left_image' => $leftImgPath,
                                'right_image' => $rightImgPath,
                                'is_correct' => true // Penanda ini adalah pasangan kunci
                            ]);
                        }
                    }
                }

                // B. TIPE PILIHAN GANDA (MULTIPLE CHOICE)
                elseif ($qData['type'] === 'multiple_choice') {
                    foreach ($qData['options'] as $index => $optText) {
                        $question->options()->create([
                            'option_text' => $optText,
                            'is_correct' => ($index === (int)$qData['correct_index']),
                        ]);
                    }
                } 
                
                // C. TIPE BENAR / SALAH (TRUE/FALSE)
                elseif ($qData['type'] === 'true_false') {
                    $question->options()->create([
                        'option_text' => 'Benar', 
                        'is_correct' => $qData['correct_answer'] === 'Benar'
                    ]);
                    $question->options()->create([
                        'option_text' => 'Salah', 
                        'is_correct' => $qData['correct_answer'] === 'Salah'
                    ]);
                } 
                
                // D. TIPE ISIAN SINGKAT (SHORT ANSWER)
                elseif ($qData['type'] === 'short_answer') {
                    // Simpan Kunci Jawaban
                    $question->options()->create([
                        'option_text' => $qData['answer_key'], 
                        'is_correct' => true
                    ]);
                }
            }

            // 5. Masukkan ke Timeline Materi Kelas (Agar muncul di Stream)
            ClassMaterial::create([
                'classroom_id' => $id,
                'class_topic_id' => $request->class_topic_id,
                'title' => '[KUIS] ' . $request->title,
                'description' => 'Kuis online: ' . $quiz->questions()->count() . ' Soal. Durasi: ' . $request->duration_minutes . ' Menit.',
                'type' => 'quiz', 
                'external_url' => route('siswa.quiz.start', $quiz->id), // Link untuk siswa mengerjakan
            ]);
        });

        return redirect()->route('admin.kelas.show', $id)->with('success', 'Kuis berhasil diterbitkan!');
    }

    public function show($id)
    {
        // Ambil data kuis beserta soal dan opsinya
        $quiz = Quiz::with(['questions.options', 'classroom'])->findOrFail($id);

        return Inertia::render('Admin/Kuis/Show', [
            'quiz' => $quiz,
            'classroom' => $quiz->classroom
        ]);
    }
}