<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan user sudah login DAN rolenya 'admin'
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Jika bukan admin, arahkan ke dashboard user biasa
        return redirect()->route('dashboard');
    }
}