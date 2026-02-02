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

class ManageGuruController extends Controller
{
    public function index(Request $request)
    {
        // Cari Guru (Role = guru)
        $query = User::where('role', 'guru');

        // Fitur Search (Nama, Email, atau NIP)
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Guru/Index', [
            'teachers' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Guru/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'required|string|max:20|unique:users', // NIP Wajib & Unik
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
            'nip' => $request->nip,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'guru', // Role diset otomatis
            'avatar' => $avatarPath,
        ]);

        return redirect()->route('admin.guru.index')->with('success', 'Data Guru berhasil ditambahkan!');
    }

    public function edit($id)
    {
        $teacher = User::where('role', 'guru')->findOrFail($id);
        return Inertia::render('Admin/Guru/Edit', [
            'teacher' => $teacher
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = User::where('role', 'guru')->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            // Validasi NIP & Email (abaikan punya user ini sendiri)
            'nip' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($teacher->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($teacher->id)],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $teacher->name = $request->name;
        $teacher->nip = $request->nip;
        $teacher->email = $request->email;

        if ($request->filled('password')) {
            $teacher->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            if ($teacher->avatar) {
                Storage::disk('public')->delete($teacher->avatar);
            }
            $teacher->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $teacher->save();

        return redirect()->route('admin.guru.index')->with('success', 'Data Guru berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $teacher = User::where('role', 'guru')->findOrFail($id);

        if ($teacher->avatar) {
            Storage::disk('public')->delete($teacher->avatar);
        }

        $teacher->delete();

        return redirect()->route('admin.guru.index')->with('success', 'Data Guru berhasil dihapus.');
    }
}