<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassMaterial;
use App\Models\Classroom;
use App\Models\MaterialAttachment; // Import Model Baru
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClassMaterialController extends Controller
{
    // Halaman Form Create
    public function create($id)
    {
        $classroom = Classroom::findOrFail($id);
        $topics = $classroom->topics()->orderBy('created_at')->get(['id', 'title']);

        return Inertia::render('Admin/Materi/Create', [
            'classroom' => $classroom,
            'topics' => $topics
        ]);
    }

    // EDIT: Tampilkan Form Edit
    public function edit($id)
    {
        $material = ClassMaterial::with(['attachments', 'classroom'])->findOrFail($id);
        
        // Ambil topik dari kelas materi tersebut
        $topics = $material->classroom->topics()->orderBy('created_at')->get(['id', 'title']);

        return Inertia::render('Admin/Materi/Edit', [
            'material' => $material,
            'topics' => $topics,
            'classroom' => $material->classroom
        ]);
    }

    public function update(Request $request, $id)
    {
        $material = ClassMaterial::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            // Validasi attachment baru (jika ada)
            'new_attachments' => 'array',
            'new_attachments.*.type' => 'required|in:pdf,video,link',
            'description' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $material) {
            // 1. Update Data Utama
            $material->update([
                'class_topic_id' => $request->class_topic_id,
                'title' => $request->title,
                'description' => $request->description,
            ]);

            // 2. Hapus Attachment yang dipilih user untuk dihapus
            if ($request->deleted_attachment_ids) {
                $idsToDelete = $request->deleted_attachment_ids;
                $attachments = MaterialAttachment::whereIn('id', $idsToDelete)->get();
                
                foreach ($attachments as $att) {
                    // Hapus file fisik jika ada
                    if ($att->file_path) {
                        Storage::disk('public')->delete($att->file_path);
                    }
                    $att->delete();
                }
            }

            // 3. Tambah Attachment Baru (Sama logicnya dengan create)
            if ($request->new_attachments) {
                foreach ($request->new_attachments as $att) { 
                    $path = null;
                    $url = null;
                    $title = $att['title'] ?? null;
            
                    if ($att['type'] === 'link') {
                        $url = $att['url'];
                        if (!$title) $title = $url;
                    } else {
                        if (isset($att['file']) && $att['file']) {
                            $path = $att['file']->store('materials', 'public');
                            if (!$title) {
                                $title = $att['file']->getClientOriginalName();
                            }
                        }
                    }
    
                    MaterialAttachment::create([
                        'class_material_id' => $material->id,
                        'title' => $title, 
                        'type' => $att['type'],
                        'file_path' => $path,
                        'url' => $url,
                    ]);
                }
            }
        });
    
        return redirect()->route('admin.material.show', $id)->with('success', 'Materi diperbarui.');
    }

    // Proses Simpan (Multiple Attachments)
    public function store(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'attachments' => 'array', // Array lampiran
            'attachments.*.type' => 'required|in:pdf,video,link',
            'description' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request, $id) {
            // 1. Simpan Data Utama Materi
            $material = ClassMaterial::create([
                'classroom_id' => $id,
                'class_topic_id' => $request->class_topic_id,
                'title' => $request->title,
                
                'description' => $request->description,
            ]);

            // 2. Loop & Simpan Attachments
            if ($request->attachments) {
                foreach ($request->attachments as $att) { // Atau $request->new_attachments di update
                    $path = null;
                    $url = null;
                    $title = $att['title'] ?? null; // Ambil judul dari input
            
                    if ($att['type'] === 'link') {
                        $url = $att['url'];
                        // Jika judul kosong, pakai URL sebagai judul
                        if (!$title) $title = $url;
                    } else {
                        if (isset($att['file']) && $att['file']) {
                            $path = $att['file']->store('materials', 'public');
                            
                            // Jika judul kosong, ambil nama asli file (misal: "Materi Bab 1.pdf")
                            if (!$title) {
                                $title = $att['file']->getClientOriginalName();
                            }
                        }
                    }
                    MaterialAttachment::create([
                        'class_material_id' => $material->id, // $material->id sudah ada dari create/find
                        'title' => $title, // <--- SIMPAN JUDUL DISINI
                        'type' => $att['type'],
                        'file_path' => $path,
                        'url' => $url,
                    ]);
                }
            }
        });

        // REVISI 1: Redirect kembali ke Halaman Kelas (Tab Stream)
        return redirect()->route('admin.kelas.show', $id)->with('success', 'Materi berhasil dibuat.');
    }

    // REVISI 2: Halaman Detail Materi (Lihat & Edit)
    public function show($id)
    {
        // Ambil materi beserta attachment-nya
        $material = ClassMaterial::with(['attachments', 'classroom'])->findOrFail($id);

        return Inertia::render('Admin/Materi/Show', [
            'material' => $material,
            'classroom' => $material->classroom
        ]);
    }

    public function destroy($id)
    {
        $material = ClassMaterial::findOrFail($id);
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }
        $material->delete();
        return back()->with('success', 'Materi dihapus.');
    }
}