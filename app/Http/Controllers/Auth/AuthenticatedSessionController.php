<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // AMBIL ROLE USER
        $role = $request->user()->role;

        // LOGIKA REDIRECT TEGAS (Tanpa 'intended' dulu biar aman)
        if ($role === 'admin') {
            return redirect()->route('admin.dashboard');
        } 
        
        if ($role === 'guru') {
            return redirect()->route('guru.dashboard');
        }

        if ($role === 'siswa') {
            return redirect()->route('siswa.dashboard');
        }

        // Default jika role tidak dikenali / user biasa
        return redirect()->route('dashboard'); 
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
