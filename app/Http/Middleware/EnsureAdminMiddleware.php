<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'يجب تسجيل الدخول أولاً.');
        }

        $user = auth()->user();
        
        if (!$user->is_admin) {
            abort(403, 'ليس لديك صلاحية الوصول إلى هذه الصفحة.');
        }

        return $next($request);
    }
}