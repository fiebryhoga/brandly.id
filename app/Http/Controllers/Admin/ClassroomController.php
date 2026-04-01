<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        // ... logic index (sama seperti sebelumnya) ...
        $query = Classroom::withCount(['teachers', 'students'])
            ->with(['teachers' => fn($q) => $q->limit(3)]);

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Kelas/Index', [
            'classrooms' => $query->latest()->paginate(9),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kelas/Form', [
            'availableTeachers' => User::where('role', 'guru')->get(['id', 'name', 'nip', 'avatar']),
            'availableStudents' => User::where('role', 'siswa')->get(['id', 'name', 'nis', 'avatar']),
        ]);
    }

    public function store(Request $request)
    {
        // ... logic store kelas baru (sama seperti sebelumnya) ...
        $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:20',
            'teachers' => 'array',
            'students' => 'array',
        ]);

        $classroom = Classroom::create($request->only('name', 'description', 'academic_year'));
        $classroom->users()->sync(array_merge($request->teachers ?? [], $request->students ?? []));

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil dibuat!');
    }

    public function show($id)
    {
        // ... logic show COMMAND CENTER (sama seperti sebelumnya) ...
        $classroom = Classroom::with([
            'teachers', 
            'students', 
            'topics.materials' => fn($q) => $q->latest(),
            'uncategorizedMaterials' => fn($q) => $q->latest()
        ])->findOrFail($id);

        $topicsDropdown = $classroom->topics()->orderBy('created_at')->get(['id', 'title']);

        return Inertia::render('Admin/Kelas/Show', [
            'classroom' => $classroom,
            'availableTeachers' => User::where('role', 'guru')->get(['id', 'name', 'nip', 'avatar']),
            'availableStudents' => User::where('role', 'siswa')->get(['id', 'name', 'nis', 'avatar']),
            'topicsDropdown' => $topicsDropdown,
        ]);
    }

    public function edit($id)
    {
        // ... logic edit (sama seperti sebelumnya) ...
        $classroom = Classroom::with(['teachers', 'students'])->findOrFail($id);
        return Inertia::render('Admin/Kelas/Form', [
            'classroom' => $classroom,
            'availableTeachers' => User::where('role', 'guru')->get(['id', 'name', 'nip', 'avatar']),
            'availableStudents' => User::where('role', 'siswa')->get(['id', 'name', 'nis', 'avatar']),
            'selectedTeacherIds' => $classroom->teachers->pluck('id'),
            'selectedStudentIds' => $classroom->students->pluck('id'),
        ]);
    }

    public function update(Request $request, $id)
    {
        // ... logic update (gabungan) ...
        $classroom = Classroom::findOrFail($id);

        // Update Info Dasar
        if ($request->type === 'update_info') {
            $request->validate(['name' => 'required', 'academic_year' => 'required']);
            $classroom->update($request->only('name', 'description', 'academic_year'));
            return back()->with('success', 'Info kelas diperbarui.');
        }

        // Update Anggota
        if ($request->type === 'update_members') {
            $classroom->users()->sync(array_merge($request->teachers ?? [], $request->students ?? []));
            return back()->with('success', 'Anggota kelas diperbarui.');
        }

        // Update Standard (dari Form Edit)
        $request->validate(['name' => 'required', 'academic_year' => 'required']);
        $classroom->update($request->only('name', 'description', 'academic_year'));
        $classroom->users()->sync(array_merge($request->teachers ?? [], $request->students ?? []));
        return redirect()->route('admin.kelas.index')->with('success', 'Data kelas diperbarui!');
    }

    public function destroy($id)
    {
        Classroom::findOrFail($id)->delete();
        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }
}