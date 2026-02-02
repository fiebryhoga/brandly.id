<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ManageSiswaController extends Controller
{
    public function index(Request $request)
    {
        // Cari Siswa (Role = siswa)
        $query = User::where('role', 'siswa');

        // Fitur Search (Nama, Email, atau NIS)
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Siswa/Index', [
            'students' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Siswa/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nis' => 'required|string|max:20|unique:users', // NIS Wajib & Unik
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        User::create([
            'name' => $request->name,
            'nis' => $request->nis,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'siswa', // Role otomatis siswa
            'avatar' => $avatarPath,
        ]);

        return redirect()->route('admin.siswa.index')->with('success', 'Data Siswa berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $student = User::where('role', 'siswa')->findOrFail($id);
        return Inertia::render('Admin/Siswa/Edit', [
            'student' => $student
        ]);
    }

    public function update(Request $request, $id)
    {
        $student = User::where('role', 'siswa')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            // Validasi NIS & Email (abaikan punya user ini sendiri)
            'nis' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($student->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($student->id)],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $student->name = $request->name;
        $student->nis = $request->nis;
        $student->email = $request->email;

        if ($request->filled('password')) {
            $student->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($student->avatar) {
                Storage::disk('public')->delete($student->avatar);
            }
            $student->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $student->save();

        return redirect()->route('admin.siswa.index')->with('success', 'Data Siswa berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $student = User::where('role', 'siswa')->findOrFail($id);

        if ($student->avatar) {
            Storage::disk('public')->delete($student->avatar);
        }

        $student->delete();

        return redirect()->route('admin.siswa.index')->with('success', 'Data Siswa berhasil dihapus.');
    }
}