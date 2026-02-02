import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans antialiased text-brandDark">
            <Head title="Masuk ke Brandly.id" />

            <div className="w-full max-w-[440px]">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex flex-col items-center">
                        <img src="/assets/images/logo1.png" alt="Logo" className="h-16 w-auto mb-4" />
                        <h2 className="text-3xl font-black tracking-tight">
                            Selamat <span className="text-brandPrimary">Datang</span>
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium">
                            Masuk untuk akses Dashboard Brandly.id
                        </p>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-blue-100/50">
                    {status && (
                        <div className="mb-4 font-medium text-sm text-brandSecondary bg-emerald-50 p-4 rounded-xl text-center border border-brandSecondary/20">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold mb-2 ml-1">Alamat Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary transition-all duration-200 placeholder:text-slate-400"
                                placeholder="nama@email.com"
                                required
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500 ml-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <label className="text-sm font-bold">Kata Sandi</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs font-bold text-brandPrimary hover:text-brandSecondary transition-colors">
                                        Lupa Sandi?
                                    </Link>
                                )}
                            </div>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary transition-all duration-200 placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500 ml-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <label className="flex items-center cursor-pointer group w-fit">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-5 w-5 rounded-lg border-slate-200 text-brandPrimary focus:ring-brandPrimary transition-all cursor-pointer"
                            />
                            <span className="ml-3 text-sm font-medium text-slate-500 group-hover:text-brandDark transition-colors">Ingat saya</span>
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-brandPrimary to-brandPrimary/90 hover:to-brandDark text-white font-black rounded-2xl shadow-xl shadow-blue-200 transform active:scale-[0.98] transition-all duration-200"
                        >
                            {processing ? 'Menghubungkan...' : 'Masuk Dashboard'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="text-brandPrimary font-bold hover:underline">
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    &copy; 2026 Brandly.id
                </p>
            </div>
        </div>
    );
}