<?php

namespace App\Http\Controllers\Admin;

use App\Models\ClassTopic;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\ClassMaterial;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Wajib ada untuk hapus file
use Inertia\Inertia;

class ManageKelasController extends Controller
{
    /**
     * Menampilkan daftar kelas (Grid View).
     */
    public function index(Request $request)
    {
        $query = Classroom::withCount(['teachers', 'students'])
            ->with(['teachers' => function($q) {
                $q->limit(3); // Preview 3 avatar guru
            }]);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Kelas/Index', [
            'classrooms' => $query->latest()->paginate(9),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Form untuk membuat kelas baru.
     */
    public function create()
    {
        return Inertia::render('Admin/Kelas/Form', [
            'availableTeachers' => User::where('role', 'guru')->get(['id', 'name', 'nip', 'avatar']),
            'availableStudents' => User::where('role', 'siswa')->get(['id', 'name', 'nis', 'avatar']),
        ]);
    }

    /**
     * Menyimpan kelas baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'teachers' => 'array', // Array ID Guru
            'students' => 'array', // Array ID Siswa
        ]);

        // 1. Buat Kelas
        $classroom = Classroom::create([
            'name' => $request->name,
            'description' => $request->description,
            'academic_year' => $request->academic_year,
        ]);

        // 2. Gabungkan Guru & Siswa, lalu Sync ke tabel pivot
        $allUserIds = array_merge($request->teachers ?? [], $request->students ?? []);
        $classroom->users()->sync($allUserIds);

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil dibuat!');
    }

    /**
     * Halaman "Command Center" (Detail Kelas & LMS).
     */
    public function show($id)
    {
        // 1. Ambil data Kelas beserta relasi Topik & Materinya
        $classroom = Classroom::with([
            'teachers', 
            'students', 
            // Load Topik beserta materi di dalamnya (diurutkan terbaru)
            'topics.materials' => function($q) {
                $q->latest();
            },
            // Load materi yang tidak masuk topik
            'uncategorizedMaterials' => function($q) {
                $q->latest();
            }
        ])->findOrFail($id);

        // 2. DEFINISIKAN VARIABEL $topicsDropdown (INI YANG TADI HILANG)
        // Kita ambil ID dan Judul topik saja untuk mengisi <select> di frontend
        $topicsDropdown = $classroom->topics()->orderBy('created_at')->get(['id', 'title']);

        // 3. Kirim ke Frontend
        return Inertia::render('Admin/Kelas/Show', [
            'classroom' => $classroom,
            'availableTeachers' => User::where('role', 'guru')->get(['id', 'name', 'nip', 'avatar']),
            'availableStudents' => User::where('role', 'siswa')->get(['id', 'name', 'nis', 'avatar']),
            'topicsDropdown' => $topicsDropdown, // Sekarang variabel ini sudah ada isinya
        ]);
    }

    /**
     * Form untuk edit kelas (Standard Edit).
     */
    public function edit($id)
    {
        $classroom = Classroom::with(['teachers', 'students'])->findOrFail($id);

        return Inertia::render('Admin/Kelas/Form', [
            'classroom' => $classroom,
            'availableTeachers' => User::where('role', 'guru')->get(['id', 'name', 'nip', 'avatar']),
            'availableStudents' => User::where('role', 'siswa')->get(['id', 'name', 'nis', 'avatar']),
            // Kirim ID yang sudah terpilih untuk pre-select di UserSelector
            'selectedTeacherIds' => $classroom->teachers->pluck('id'),
            'selectedStudentIds' => $classroom->students->pluck('id'),
        ]);
    }

    /**
     * Update Data Kelas.
     * Menangani 2 skenario: Update dari Tab Show (Specific) & Update dari Form Edit (General).
     */
    public function update(Request $request, $id)
    {
        $classroom = Classroom::findOrFail($id);

        // SKENARIO 1: Update Info Dasar (dari Tab Settings di Show.jsx)
        if ($request->has('type') && $request->type === 'update_info') {
            $request->validate([
                'name' => 'required|string',
                'academic_year' => 'required|string',
            ]);
            $classroom->update($request->only('name', 'description', 'academic_year'));
            return back()->with('success', 'Info kelas diperbarui.');
        }

        // SKENARIO 2: Update Anggota (dari Tab People di Show.jsx)
        if ($request->has('type') && $request->type === 'update_members') {
            $allUserIds = array_merge($request->teachers ?? [], $request->students ?? []);
            $classroom->users()->sync($allUserIds);
            return back()->with('success', 'Anggota kelas diperbarui.');
        }

        // SKENARIO 3: Update Standard (dari halaman Form.jsx Edit Biasa)
        // Jika tidak ada 'type', berarti ini update biasa
        $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
        ]);

        $classroom->update([
            'name' => $request->name,
            'description' => $request->description,
            'academic_year' => $request->academic_year,
        ]);

        $allUserIds = array_merge($request->teachers ?? [], $request->students ?? []);
        $classroom->users()->sync($allUserIds);

        return redirect()->route('admin.kelas.index')->with('success', 'Data kelas diperbarui!');
    }

    /**
     * Hapus Kelas.
     */
    public function destroy($id)
    {
        $classroom = Classroom::findOrFail($id);
        $classroom->delete();
        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }

    /**
     * Upload Materi ke Timeline Kelas.
     */
    public function storeMaterial(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:pdf,video,link,quiz',
            'file' => 'nullable|file|max:10240',
            'url' => 'nullable|url',
            'class_topic_id' => 'nullable|exists:class_topics,id', // Validasi Topik
        ]);

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('materials', 'public');
        }

        ClassMaterial::create([
            'classroom_id' => $id,
            'class_topic_id' => $request->class_topic_id, // Simpan ID Topik
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'file_path' => $path,
            'external_url' => $request->url,
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan.');
    }

    /**
     * Hapus Materi.
     */
    public function deleteMaterial($id)
    {
        $material = ClassMaterial::findOrFail($id);
        
        // Hapus file fisik jika ada
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }

        $material->delete();
        return back()->with('success', 'Materi dihapus.');
    }

    public function storeQuiz(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string',
            'duration_minutes' => 'required|integer|min:1',
            'questions' => 'required|array|min:1',
            'questions.*.text' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.correct_option_index' => 'required|integer',
            'class_topic_id' => 'nullable|exists:class_topics,id' // Validasi Topik
        ]);

        DB::transaction(function () use ($request, $id) {
            // 1. Buat Kuis
            $quiz = Quiz::create([
                'classroom_id' => $id,
                'title' => $request->title,
                'description' => $request->description,
                'duration_minutes' => $request->duration_minutes,
            ]);

            // 2. Loop Soal & Jawaban
            foreach ($request->questions as $qData) {
                $question = $quiz->questions()->create([
                    'question_text' => $qData['text'],
                    'points' => 10,
                ]);

                foreach ($qData['options'] as $index => $optText) {
                    $question->options()->create([
                        'option_text' => $optText,
                        'is_correct' => ($index === (int)$qData['correct_option_index']),
                    ]);
                }
            }
            
            // 3. Masukkan ke Timeline Materi (Link ke Kuis)
            ClassMaterial::create([
                'classroom_id' => $id,
                'class_topic_id' => $request->class_topic_id, // Masukkan ke Topik
                'title' => '[KUIS] ' . $request->title,
                'type' => 'quiz',
                // Pastikan route 'quiz.start' (milik siswa) sudah ada di web.php
                'external_url' => route('siswa.quiz.start', $quiz->id), 
            ]);
        });

        return back()->with('success', 'Kuis berhasil diterbitkan!');
    }

    public function storeTopic(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);
        
        ClassTopic::create([
            'classroom_id' => $id,
            'title' => $request->title
        ]);

        return back()->with('success', 'Topik/BAB berhasil dibuat.');
    }
}