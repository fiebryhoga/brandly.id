<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Cek apakah user login DAN rolenya sesuai
        if ($request->user() && $request->user()->role === $role) {
            return $next($request);
        }

        // Jika salah role, arahkan ke dashboard default atau error page
        // Opsi A: Tampilkan Error 403
        abort(403, 'Anda tidak memiliki akses sebagai ' . $role);
        
        // Opsi B (Alternatif): Redirect paksa ke halaman welcome
        // return redirect('/'); 
    }
}