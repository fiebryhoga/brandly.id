import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { LuPlus, LuSearch, LuUsers, LuCalendar, LuTrash2, LuPencil, LuArrowRight } from "react-icons/lu";
import UserAvatar from '@/Components/UserAvatar';
import { useState } from 'react';

export default function Index({ classrooms, filters }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.kelas.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Menghapus kelas akan menghapus semua riwayat di dalamnya. Lanjutkan?')) {
            router.delete(route('admin.kelas.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Kelas" />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#1a2b4e]">Daftar Kelas</h1>
                    <p className="text-slate-500 text-sm">Kelola kelas, guru pengajar, dan siswa.</p>
                </div>
                <Link href={route('admin.kelas.create')} className="bg-[#2f74a9] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#1a2b4e] transition shadow-lg shadow-blue-200">
                    <LuPlus /> Buat Kelas
                </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Cari nama kelas..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#2f74a9] shadow-sm"
                    />
                </form>
            </div>

            {/* Grid Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.data.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
                        {/* Hiasan background */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2f74a9]/10 to-transparent rounded-bl-[3rem]"></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                {/* PERUBAHAN DI SINI: Judul dibungkus Link ke 'show' */}
                                <Link href={route('admin.kelas.show', item.id)} className="block">
                                    <h3 className="text-xl font-black text-[#1a2b4e] group-hover:text-[#2f74a9] transition-colors cursor-pointer hover:underline decoration-2 underline-offset-4 decoration-[#2f74a9]/30">
                                        {item.name}
                                    </h3>
                                </Link>
                                
                                <div className="flex items-center gap-1 text-xs font-bold text-[#47be9e] mt-1 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                                    <LuCalendar className="text-[10px]" /> {item.academic_year}
                                </div>
                            </div>
                            
                            {/* Tombol Aksi (Edit & Delete) */}
                            <div className="flex gap-2">
                                <Link href={route('admin.kelas.edit', item.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-[#2f74a9] rounded-xl transition">
                                    <LuPencil />
                                </Link>
                                <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition">
                                    <LuTrash2 />
                                </button>
                            </div>
                        </div>

                        {/* Deskripsi juga bisa diklik */}
                        <Link href={route('admin.kelas.show', item.id)} className="block flex-1">
                            <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10 hover:text-slate-700 transition-colors">
                                {item.description || 'Tidak ada deskripsi.'}
                            </p>
                        </Link>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                            {/* Guru Icons */}
                            <div className="flex -space-x-2">
                                {item.teachers.map((guru) => (
                                    <UserAvatar key={guru.id} user={guru} className="w-8 h-8 border-2 border-white" />
                                ))}
                                {item.teachers_count === 0 && <span className="text-xs text-slate-400 italic">Belum ada guru</span>}
                                {item.teachers_count > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                        +{item.teachers_count - 3}
                                    </div>
                                )}
                            </div>

                            {/* Tombol Masuk Kecil / Siswa Count */}
                            <Link href={route('admin.kelas.show', item.id)} className="flex items-center gap-1.5 text-slate-500 font-bold text-sm hover:text-[#2f74a9] transition-colors group/link">
                                <LuUsers /> {item.students_count} Siswa
                                <LuArrowRight className="text-xs opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
             
             {/* Pagination */}
             <div className="mt-8 flex justify-center gap-2">
                {classrooms.links.map((link, i) => (
                    link.url ? (
                        <Link key={i} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-4 py-2 rounded-xl text-sm font-bold ${link.active ? 'bg-[#2f74a9] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`} />
                    ) : <span key={i} dangerouslySetInnerHTML={{ __html: link.label }} className="px-4 py-2 text-sm text-slate-300" />
                ))}
             </div>
        </AdminLayout>
    );
}