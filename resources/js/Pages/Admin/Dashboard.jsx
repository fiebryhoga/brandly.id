import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            
            <div className="mb-8">
                <h1 className="text-3xl font-black text-brandDark">Ringkasan <span className="text-brandPrimary">Data</span></h1>
                <p className="text-slate-500 font-medium">Pantau aktivitas platform brandly.id hari ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Guru Aktif', value: '12', color: 'text-brandPrimary', icon: '👨‍🏫' },
                    { label: 'Total Siswa', value: '248', color: 'text-brandSecondary', icon: '🎓' },
                    { label: 'Kelas Berjalan', value: '15', color: 'text-orange-500', icon: '🏫' },
                    { label: 'Materi Terupload', value: '89', color: 'text-purple-500', icon: '📚' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300">
                        <div className="text-2xl mb-4">{stat.icon}</div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        <h3 className={`text-4xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Section tambahan bisa ditaruh di sini */}
            <div className="mt-10 bg-brandDark rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-black">Butuh bantuan manajemen?</h2>
                    <p className="mt-2 opacity-70 max-w-md">Gunakan menu di samping untuk mulai mengelola konten e-learning Brandly.id.</p>
                </div>
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-brandPrimary/20 rounded-full blur-[80px]"></div>
            </div>
        </AdminLayout>
    );
}