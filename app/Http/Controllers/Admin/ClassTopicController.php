<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassTopic;
use App\Models\ClassMaterial;
use Illuminate\Http\Request;

class ClassTopicController extends Controller
{
    public function store(Request $request, $id)
    {
        $request->validate(['title' => 'required|string|max:255']);
        
        ClassTopic::create([
            'classroom_id' => $id,
            'title' => $request->title
        ]);

        return back()->with('success', 'Topik/BAB berhasil dibuat.');
    }

    // UPDATE: Untuk Rename Topik
    public function update(Request $request, $id)
    {
        $request->validate(['title' => 'required|string|max:255']);
        
        $topic = ClassTopic::findOrFail($id);
        $topic->update(['title' => $request->title]);

        return back()->with('success', 'Nama topik berhasil diperbarui.');
    }

    // DESTROY: Hapus Topik & Evakuasi Materi
    public function destroy($id)
    {
        $topic = ClassTopic::findOrFail($id);

        // LOGIKA PENTING: 
        // Pindahkan semua materi di topik ini ke NULL (Tanpa Topik) sebelum topik dihapus
        ClassMaterial::where('class_topic_id', $id)->update([
            'class_topic_id' => null
        ]);

        $topic->delete();
        
        return back()->with('success', 'Topik dihapus. Materi dipindahkan ke folder Umum.');
    }
}