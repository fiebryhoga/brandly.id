import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LuArrowLeft, LuCamera, LuUpload, LuX, LuShieldCheck } from "react-icons/lu";
import UserAvatar from '@/Components/UserAvatar'; 

export default function Edit({ student }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: student.name,
        nis: student.nis || '',
        email: student.email,
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleResetPreview = () => {
        setPreview(null);
        setData('avatar', null);
        document.getElementById('avatarInput').value = null;
    };

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.siswa.update', student.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Siswa - ${student.name}`} />

            <div className="mb-8">
                <Link 
                    href={route('admin.siswa.index')} 
                    className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-brandPrimary transition mb-4"
                >
                    <LuArrowLeft /> Kembali ke Daftar
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Data Siswa</h1>
            </div>
            
            <form onSubmit={submit} className="max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- Kolom Kiri: Foto --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center sticky top-8">
                            <h3 className="font-bold text-slate-800 mb-6">Foto Profil</h3>
                            
                            <div className="relative w-48 h-48 mx-auto group">
                                <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ${errors.avatar ? 'ring-red-500' : 'ring-slate-100'} bg-slate-50 flex items-center justify-center relative`}>
                                    {preview ? (
                                        <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserAvatar user={student} className="w-full h-full text-6xl" />
                                    )}

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer" onClick={() => document.getElementById('avatarInput').click()}>
                                        <LuCamera className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-bold">Ubah Foto</span>
                                    </div>
                                </div>

                                {preview && (
                                    <button 
                                        type="button"
                                        onClick={handleResetPreview}
                                        className="absolute top-2 right-2 p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-red-100 hover:text-red-600 transition shadow-sm z-10"
                                    >
                                        <LuX size={16} />
                                    </button>
                                )}
                            </div>

                            <input 
                                id="avatarInput"
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            
                            <div className="mt-6 pb-6 border-b border-slate-100">
                                <p className="text-slate-900 font-black text-xl">{student.name}</p>
                                <p className="text-slate-500 text-sm font-mono mt-1">{student.nis || 'NIS Belum diatur'}</p>
                            </div>

                            <button 
                                type="button" 
                                onClick={() => document.getElementById('avatarInput').click()}
                                className="mt-6 w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-brandPrimary hover:text-brandPrimary transition flex items-center justify-center gap-2"
                            >
                                <LuUpload className="text-lg" /> Upload Foto Baru
                            </button>
                            {errors.avatar && <p className="text-red-500 text-sm font-bold mt-2">{errors.avatar}</p>}
                        </div>
                    </div>

                    {/* --- Kolom Kanan: Form --- */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="font-bold text-lg text-slate-800 mb-8 border-b border-slate-100 pb-4">Detail Data Siswa</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium text-slate-800 placeholder:text-slate-400" 
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">NIS</label>
                                        <input 
                                            type="text" 
                                            value={data.nis} 
                                            onChange={e => setData('nis', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium text-slate-800 font-mono" 
                                            placeholder="Kosong"
                                        />
                                        {errors.nis && <p className="text-red-500 text-xs mt-2 font-bold">{errors.nis}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={e => setData('email', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium text-slate-800" 
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Password Area */}
                                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 mt-8">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm shrink-0">
                                            <LuShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-lg">Reset Password</h4>
                                            <p className="text-sm text-amber-700/80 mt-1">
                                                Isi kolom ini <span className="font-bold">hanya jika</span> Anda ingin mengganti password siswa ini.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Password Baru</label>
                                            <input 
                                                type="password" 
                                                value={data.password} 
                                                onChange={e => setData('password', e.target.value)} 
                                                className="w-full px-5 py-3.5 bg-white border-2 border-amber-100 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium" 
                                                autoComplete="new-password"
                                            />
                                            {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Konfirmasi</label>
                                            <input 
                                                type="password" 
                                                value={data.password_confirmation} 
                                                onChange={e => setData('password_confirmation', e.target.value)} 
                                                className="w-full px-5 py-3.5 bg-white border-2 border-amber-100 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium" 
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <Link 
                                    href={route('admin.siswa.index')} 
                                    className="px-8 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition-all"
                                >
                                    Batal
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-8 py-4 bg-brandPrimary text-white font-bold rounded-2xl hover:bg-brandDark transition-all duration-300 shadow-xl shadow-brandPrimary/20 hover:shadow-brandPrimary/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}