import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { LuPlus, LuPencil, LuTrash2, LuSearch, LuIdCard, LuMail } from "react-icons/lu";
import UserAvatar from '@/Components/UserAvatar';
import { useState } from 'react';

export default function Index({ teachers, filters }) {
    // Fallback object kosong jika props flash undefined
    const { flash = {} } = usePage().props; 
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.guru.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data guru ini? Data yang terkait mungkin juga akan terhapus.')) {
            router.delete(route('admin.guru.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Guru" />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kelola Guru</h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">Manajemen data pengajar dan instruktur.</p>
                </div>
                <Link 
                    href={route('admin.guru.create')} 
                    className="group bg-brandPrimary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brandDark transition-all duration-300 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                >
                    <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition">
                        <LuPlus className="text-lg" />
                    </div>
                    <span>Tambah Guru</span>
                </Link>
            </div>

            {/* Flash Message Modern */}
            {flash?.success && (
                <div className="mb-8 flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 shadow-sm animate-fade-in-down">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-bold text-sm">{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="mb-8 flex items-center gap-3 bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 shadow-sm animate-fade-in-down">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="font-bold text-sm">{flash.error}</span>
                </div>
            )}

            {/* Main Content Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                
                {/* Toolbar (Search) */}
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Total: {teachers.total} Pengajar
                        </span>
                    </div>

                    <form onSubmit={handleSearch} className="relative w-full sm:w-72 group">
                        <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brandPrimary transition-colors duration-300 text-lg" />
                        <input 
                            type="text" 
                            placeholder="Cari NIP atau Nama..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-brandPrimary/20 focus:bg-white transition-all duration-300"
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-8 py-5 text-xs uppercase font-extrabold text-slate-400 tracking-wider">Profil Guru</th>
                                <th className="px-8 py-5 text-xs uppercase font-extrabold text-slate-400 tracking-wider">Identitas (NIP)</th>
                                <th className="px-8 py-5 text-xs uppercase font-extrabold text-slate-400 tracking-wider">Kontak</th>
                                <th className="px-8 py-5 text-xs uppercase font-extrabold text-slate-400 tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teachers.data.map((teacher) => (
                                <tr key={teacher.id} className="group hover:bg-slate-50/80 transition-colors duration-200">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <UserAvatar user={teacher} className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white ring-1 ring-slate-100" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-base">{teacher.name}</div>
                                                <div className="text-xs text-slate-400 font-medium mt-0.5">Pengajar</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {teacher.nip ? (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                <LuIdCard className="text-indigo-400" />
                                                <span className="text-sm font-semibold tracking-wide">{teacher.nip}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Belum ada NIP</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg inline-block border border-slate-100">
                                            <LuMail className="text-slate-400" size={14} />
                                            {teacher.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                            <Link 
                                                href={route('admin.guru.edit', teacher.id)} 
                                                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                                                title="Edit Data Guru"
                                            >
                                                <LuPencil className="w-5 h-5" />
                                            </Link>
                                            
                                            <button 
                                                onClick={() => handleDelete(teacher.id)} 
                                                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:scale-110 transition-all duration-200"
                                                title="Hapus Guru"
                                            >
                                                <LuTrash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {teachers.data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <LuSearch className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-slate-900 font-bold text-lg">Tidak ada data ditemukan</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                                Coba ubah kata kunci pencarian atau tambahkan guru baru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}