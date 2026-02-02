import { Link } from '@inertiajs/react';
import { 
    LuLayoutDashboard, 
    LuUsers, 
    LuGraduationCap, 
    LuBookOpen, 
    LuFileQuestion, 
    LuLogOut, 
    LuSettings,
    LuMonitorPlay,
    LuShieldCheck
} from "react-icons/lu";

export default function AdminSidebar() {
    // Definisi Menu
    const menuGroups = [
        {
            title: "UTAMA",
            items: [
                { label: 'Dashboard', route: 'admin.dashboard', icon: LuLayoutDashboard },
            ]
        },
        {
            title: "MANAJEMEN AKUN",
            items: [
                { label: 'Kelola Admin', route: 'admin.admins.index', icon: LuShieldCheck },
                { label: 'Kelola Guru', route: 'admin.guru.index', icon: LuUsers },
                { label: 'Kelola Siswa', route: 'admin.siswa.index', icon: LuGraduationCap },
            ]
        },
        {
            title: "AKADEMIK",
            items: [
                { label: 'Kelas & Mapel', route: 'admin.kelas.index', icon: LuMonitorPlay },
                { label: 'Materi Belajar', route: 'admin.materi.index', icon: LuBookOpen },
                { label: 'Kuis & Ujian', route: 'admin.quiz.index', icon: LuFileQuestion },
            ]
        }
    ];

    return (
        <aside className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-slate-100 flex flex-col z-50 transition-all duration-300">
            {/* Logo Section */}
            <div className="h-24 flex items-center px-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2f74a9] to-[#47be9e] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
                        B
                    </div>
                    <div>
                        <h1 className="font-black text-xl text-[#1a2b4e] tracking-tight">Brandly<span className="text-[#47be9e]">.id</span></h1>
                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
                {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        <h3 className="px-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item, itemIndex) => {
                                const isActive = route().current(item.route);
                                const Icon = item.icon;
                                
                                return (
                                    <Link
                                        key={itemIndex}
                                        href={route().has(item.route) ? route(item.route) : '#'}
                                        className={`group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[14px] ${
                                            isActive 
                                            ? 'bg-gradient-to-r from-[#2f74a9] to-[#2f74a9]/90 text-white shadow-lg shadow-blue-200 translate-x-1' 
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-[#2f74a9]'
                                        }`}
                                    >
                                        <Icon className={`text-lg transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#2f74a9]'}`} />
                                        <span>{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-50">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group"
                >
                    <LuLogOut className="text-lg group-hover:-translate-x-1 transition-transform" />
                    <span>Keluar Sesi</span>
                </Link>
            </div>
        </aside>
    );
}