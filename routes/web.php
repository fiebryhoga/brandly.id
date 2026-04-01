<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
// Controller Resource
use App\Http\Controllers\Admin\ManageAdminController;
use App\Http\Controllers\Admin\ManageGuruController;
use App\Http\Controllers\Admin\ManageSiswaController;
// Controller LMS Terpisah
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\ClassTopicController;
use App\Http\Controllers\Admin\ClassMaterialController;
use App\Http\Controllers\Admin\ClassQuizController;
use App\Http\Controllers\Student\QuizController as StudentQuizController; // Alias biar ga bingung

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
    
    // Resource CRUD Manajemen Akun
    Route::resource('admins', ManageAdminController::class);
    Route::resource('guru', ManageGuruController::class);
    Route::resource('siswa', ManageSiswaController::class);
    
    // === MANAJEMEN AKADEMIK (LMS) ===
        
    // A. Kelas Utama (Index, Show, Edit, dll)
    Route::resource('kelas', ClassroomController::class);

    // B. Topik / BAB
    Route::post('/kelas/{id}/topic', [ClassTopicController::class, 'store'])->name('kelas.topic.store');
    Route::put('/topic/{id}', [ClassTopicController::class, 'update'])->name('topic.update'); 
    Route::delete('/topic/{id}', [ClassTopicController::class, 'destroy'])->name('topic.destroy');
    

    // MATERI
    Route::get('/kelas/{id}/materi/create', [ClassMaterialController::class, 'create'])->name('kelas.material.create');
    Route::post('/kelas/{id}/material', [ClassMaterialController::class, 'store'])->name('kelas.material.store');
    
    // ROUTE BARU: DETAIL MATERI
    Route::get('/materi/{id}', [ClassMaterialController::class, 'show'])->name('material.show');
    
    // ROUTE BARU: EDIT & UPDATE
    Route::get('/materi/{id}/edit', [ClassMaterialController::class, 'edit'])->name('material.edit');
    Route::post('/materi/{id}/update', [ClassMaterialController::class, 'update'])->name('material.update');
    
    Route::delete('/material/{id}', [ClassMaterialController::class, 'destroy'])->name('material.destroy');

    // D. Kuis
    Route::post('/kelas/{id}/quiz', [ClassQuizController::class, 'store'])->name('kelas.quiz.store');
    Route::get('/kelas/{id}/quiz/create', [ClassQuizController::class, 'create'])->name('kelas.quiz.create');
    Route::get('/quiz/{id}', [ClassQuizController::class, 'show'])->name('quiz.show');


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

    // Route untuk Siswa Mengerjakan Kuis
    Route::get('/quiz/{id}/start', [StudentQuizController::class, 'start'])->name('quiz.start');
});

// 5. Profile User
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';