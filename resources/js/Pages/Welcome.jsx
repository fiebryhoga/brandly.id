import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-brandDark">
            <Head title="Brandly.id - Belajar Digital Branding" />

            {/* Navbar */}
            <nav className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center">
                    {/* Logo Brandly.id Tanpa Background & Shadow */}
                    <div className="h-10 w-auto">
                        <img 
                            src="/assets/images/logo1.png" 
                            alt="Brandly.id" 
                            className="h-full w-auto object-contain" 
                        />
                    </div>
                    <span className="ml-3 text-2xl font-black tracking-tight text-brandDark">
                        Brandly<span className="text-brandPrimary">.id</span>
                    </span>
                </div>
                <div>
                    <Link
                        href={route('login')}
                        className="ml-2 py-2.5 px-8 rounded-md text-white font-bold bg-brandPrimary hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-blue-100"
                    >
                        Masuk
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative w-full min-h-screen flex items-center bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    
                    <div className="text-left mt-28">
                        <div className="mb-8 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600 shadow-sm">
                                    <span className="mr-2 flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Platform Belajar Digital Branding
                        </div>
                        <h1 className="text-5xl font-extrabold md:text-7xl font-black leading-[1.1] mb-6 text-brandDark">
                            Kuasai Strategi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brandPrimary to-brandSecondary">
                                Digital Branding
                            </span>
                        </h1>
                        <p className="text-lg font-medium md:text-base text-slate-500 mb-10 max-w-xl leading-relaxed">
                            Upgrade skill pemasaranmu bersama <span className="font-semibold text-brandDark">Brandly.id</span>. Belajar untuk membangun merek yang kuat dan relevan di era digital.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={route('login')}
                                    className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-brandPrimary px-8 py-4 text-base font-bold text-white shadow-xl shadow-brandPrimary/20 transition-all hover:bg-slate-900 hover:shadow-2xl hover:-translate-y-1"
                                >
                                    Mulai Belajar
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor" 
                                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                                    >
                                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            <button className="py-4 px-10 rounded-2xl text-brandDark font-bold bg-slate-50 hover:bg-slate-100 transition-all duration-300 flex items-center justify-center gap-2">
                                <span>Lihat Kurikulum</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Social Proof Sederhana */}
                        <div className="mt-12 flex items-center gap-4 border-t border-slate-100 pt-8">
                            <div className="flex -space-x-3">
                                <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-200"></div>
                                <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-300"></div>
                                <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-400"></div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                                Bergabung dengan <span className="text-brandDark font-bold">1,000+</span> calon marketer digital.
                            </p>
                        </div>
                    </div>

                    {/* Image Section (Right Side) */}
                    <div className="relative hidden lg:flex min-h-screen flex-col items-end justify-end">
                        {/* Aksen Background Bulat */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brandPrimary/10 to-brandSecondary/10 rounded-full blur-3xl"></div>
                        
                        <img 
                            src="/assets/images/model-welcome1.png" 
                            alt="Brandly Student" 
                            className="w-[450px] h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -z-10 opacity-[0.03]">
                    <svg width="400" height="400" fill="none" viewBox="0 0 400 400">
                        <defs>
                            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="2" fill="#2f74a9" />
                            </pattern>
                        </defs>
                        <rect width="400" height="400" fill="url(#dots)" />
                    </svg>
                </div>
            </header>
        </div>
    );
}