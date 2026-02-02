import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminTopbar from '@/Components/Admin/AdminTopbar';
import { usePage } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-[#f8faff] font-sans text-[#1a2b4e]">
            {/* 1. Sidebar (Fixed Left) */}
            <AdminSidebar />

            {/* 2. Main Wrapper (Pushed right by sidebar width) */}
            <div className="pl-72 flex flex-col min-h-screen transition-all duration-300">
                
                {/* 3. Topbar (Sticky Top) */}
                <AdminTopbar user={auth.user} />

                {/* 4. Page Content */}
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto animate-fade-in-up">
                        {children}
                    </div>
                </main>

                {/* Footer Kecil (Opsional) */}
                <footer className="p-8 text-center text-xs font-medium text-slate-400">
                    &copy; 2026 Brandly.id Admin System. All rights reserved.
                </footer>
            </div>
        </div>
    );
}