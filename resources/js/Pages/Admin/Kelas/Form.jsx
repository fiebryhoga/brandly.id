import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import UserSelector from '@/Components/UserSelector';

export default function Form({ classroom, availableTeachers, availableStudents, selectedTeacherIds = [], selectedStudentIds = [] }) {
    const isEdit = !!classroom;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: classroom?.name || '',
        description: classroom?.description || '',
        academic_year: classroom?.academic_year || '2025/2026',
        teachers: selectedTeacherIds, // Array ID Guru
        students: selectedStudentIds, // Array ID Siswa
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.kelas.update', classroom.id));
        } else {
            post(route('admin.kelas.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Kelas' : 'Buat Kelas'} />
            
            <form onSubmit={submit} className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-black text-[#1a2b4e]">{isEdit ? 'Edit Kelas' : 'Kelas Baru'}</h1>
                    <div className="flex gap-3">
                        <Link href={route('admin.kelas.index')} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing} className="px-6 py-3 bg-[#2f74a9] text-white font-bold rounded-xl hover:bg-[#1a2b4e] transition shadow-lg shadow-blue-200">
                            Simpan Data
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Info Dasar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-[#1a2b4e]">Informasi Kelas</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Nama Kelas</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" placeholder="Contoh: XII IPA 1" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Tahun Ajaran</label>
                                    <input type="text" value={data.academic_year} onChange={e => setData('academic_year', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" placeholder="2025/2026" />
                                    {errors.academic_year && <p className="text-red-500 text-xs mt-1">{errors.academic_year}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-2">Deskripsi (Opsional)</label>
                                    <textarea rows="4" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" placeholder="Keterangan singkat..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Selector */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Selector Guru */}
                        <UserSelector 
                            title="Pilih Guru Pengajar" 
                            users={availableTeachers} 
                            selectedIds={data.teachers} 
                            onChange={(ids) => setData('teachers', ids)}
                            labelField="nip"
                        />

                        {/* Selector Siswa */}
                        <UserSelector 
                            title="Pilih Siswa" 
                            users={availableStudents} 
                            selectedIds={data.students} 
                            onChange={(ids) => setData('students', ids)}
                            labelField="nis"
                        />
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}