<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
// Controller resource
use App\Http\Controllers\Admin\ManageAdminController;
use App\Http\Controllers\Admin\ManageGuruController;
use App\Http\Controllers\Admin\ManageSiswaController;
use App\Http\Controllers\Admin\ManageKelasController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Halaman Depan
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// 2. Dashboard Admin
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard Utama
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Resource CRUD (Otomatis generate: index, create, store, edit, update, destroy)
    Route::resource('admins', ManageAdminController::class);
    Route::resource('guru', ManageGuruController::class);
    Route::resource('siswa', ManageSiswaController::class);
    
    // Kelas & LMS Logic
    Route::resource('kelas', ManageKelasController::class);
    
    // Custom Routes untuk Materi & Kuis (HAPUS 'admin.' di depannya)
    Route::post('/kelas/{id}/material', [ManageKelasController::class, 'storeMaterial'])->name('kelas.material.store'); 
    Route::delete('/material/{id}', [ManageKelasController::class, 'deleteMaterial'])->name('material.destroy');
    Route::post('/kelas/{id}/quiz', [ManageKelasController::class, 'storeQuiz'])->name('kelas.quiz.store');

    // Route Dummy Sidebar (Biar tidak error 404 kalau diklik menu sidebar yang belum jadi)
    Route::get('/materi', fn() => Inertia::render('Admin/Materi/Index'))->name('materi.index');
    Route::get('/quiz', fn() => Inertia::render('Admin/Quiz/Index'))->name('quiz.index');
});

// 3. Dashboard Guru
Route::middleware(['auth', 'role:guru'])->prefix('guru')->name('guru.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Guru/Dashboard');
    })->name('dashboard');
});

// 4. Dashboard Siswa
Route::middleware(['auth', 'role:siswa'])->prefix('student')->name('siswa.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Siswa/Dashboard');
    })->name('dashboard');

    Route::get('/quiz/{id}/start', [\App\Http\Controllers\Student\QuizController::class, 'start'])->name('quiz.start');
});

// 5. Profile User
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';