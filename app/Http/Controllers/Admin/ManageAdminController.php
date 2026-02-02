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

class ManageAdminController extends Controller
{
    public function index(Request $request)
    {
        // Ambil data user yang role-nya admin, bisa search juga
        $query = User::where('role', 'admin');

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Admins/Index', [
            'admins' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Admins/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
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
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin', // Pastikan role-nya admin
            'avatar' => $avatarPath,
        ]);

        return redirect()->route('admin.admins.index')->with('success', 'Admin baru berhasil ditambahkan!');
    }

    public function edit(User $admin)
    {
        return Inertia::render('Admin/Admins/Edit', [
            'admin' => $admin
        ]);
    }

    public function update(Request $request, User $admin)
    {
        // 1. Validasi yang lebih ketat & aman
        $request->validate([
            'name' => 'required|string|max:255',
            // Gunakan Rule::unique agar mengabaikan ID user ini sendiri saat cek duplikat
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($admin->id)],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // 2. Update Data Dasar
        $admin->name = $request->name;
        $admin->email = $request->email;

        // 3. Update Password (Hanya jika diisi user)
        if ($request->filled('password')) {
            $admin->password = Hash::make($request->password);
        }

        // 4. Update Avatar (Hanya jika ada file baru diupload)
        if ($request->hasFile('avatar')) {
            // Hapus foto lama jika ada & bukan null
            if ($admin->avatar) {
                Storage::disk('public')->delete($admin->avatar);
            }
            // Simpan foto baru
            $admin->avatar = $request->file('avatar')->store('avatars', 'public');
        }

        $admin->save();

        return redirect()->route('admin.admins.index')->with('success', 'Data admin berhasil diperbarui!');
    }

    public function destroy(User $admin)
    {
        // Proteksi: Admin tidak boleh menghapus dirinya sendiri
        if ($admin->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri saat sedang login.');
        }

        if ($admin->avatar) {
            Storage::disk('public')->delete($admin->avatar);
        }

        $admin->delete();

        return redirect()->route('admin.admins.index')->with('success', 'Admin berhasil dihapus.');
    }
}