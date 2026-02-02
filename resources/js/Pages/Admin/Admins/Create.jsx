import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LuArrowLeft, LuCamera, LuUpload, LuUser, LuX } from "react-icons/lu";

export default function Create() {
    // Perhatikan: Di sini kita tidak menerima props { admin }
    // dan inisialisasi datanya kosong (''), bukan admin.name
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    const [preview, setPreview] = useState(null);

    // Handle File Change & Preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Cleanup memory saat component unmount
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.admins.store'));
    };

    return (
        <AdminLayout>
            <Head title="Tambah Admin" />

            {/* Header & Back Button */}
            <div className="mb-8">
                <Link 
                    href={route('admin.admins.index')} 
                    className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-brandPrimary transition mb-4"
                >
                    <LuArrowLeft /> Kembali
                </Link>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tambah Admin Baru</h1>
                <p className="text-slate-500 mt-1">Tambahkan administrator baru untuk mengelola platform.</p>
            </div>
            
            <form onSubmit={submit} className="max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- Kolom Kiri: Upload Foto --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center sticky top-8">
                            <h3 className="font-bold text-slate-800 mb-6">Foto Profil</h3>
                            
                            <div className="relative w-48 h-48 mx-auto group">
                                {/* Lingkaran Preview */}
                                <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ${errors.avatar ? 'ring-red-500' : 'ring-slate-100'} bg-slate-50 flex items-center justify-center relative`}>
                                    {preview ? (
                                        <img 
                                            src={preview} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <LuUser className="w-20 h-20 text-slate-300" />
                                    )}

                                    {/* Overlay Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer" onClick={() => document.getElementById('avatarInput').click()}>
                                        <LuCamera className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-bold">Ganti Foto</span>
                                    </div>
                                </div>

                                {/* Tombol Reset jika ada preview */}
                                {preview && (
                                    <button 
                                        type="button"
                                        onClick={() => { setPreview(null); setData('avatar', null); }}
                                        className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition shadow-sm"
                                        title="Hapus Foto"
                                    >
                                        <LuX size={14} />
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
                            
                            <p className="text-xs text-slate-400 mt-4 px-4">
                                Format: JPG, PNG, atau WEBP. Maksimal 2MB. Foto akan otomatis di-crop menjadi lingkaran.
                            </p>
                            {errors.avatar && <p className="text-red-500 text-sm font-bold mt-2">{errors.avatar}</p>}

                            <button 
                                type="button" 
                                onClick={() => document.getElementById('avatarInput').click()}
                                className="mt-6 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-brandPrimary hover:text-brandPrimary transition flex items-center justify-center gap-2"
                            >
                                <LuUpload /> Pilih File
                            </button>
                        </div>
                    </div>

                    {/* --- Kolom Kanan: Form Input --- */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Informasi Akun</h3>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium placeholder:text-slate-400" 
                                            placeholder="Masukkan nama lengkap..." 
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name}</p>}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={e => setData('email', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium placeholder:text-slate-400" 
                                            placeholder="contoh@brandly.id" 
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={e => setData('password', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium placeholder:text-slate-400" 
                                            placeholder="••••••••"
                                        />
                                        {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password</label>
                                        <input 
                                            type="password" 
                                            value={data.password_confirmation} 
                                            onChange={e => setData('password_confirmation', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium placeholder:text-slate-400" 
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <Link 
                                    href={route('admin.admins.index')} 
                                    className="px-6 py-3 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition"
                                >
                                    Batal
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-8 py-3 bg-brandPrimary text-white font-bold rounded-xl hover:bg-brandDark transition shadow-lg shadow-brandPrimary/30 hover:shadow-brandPrimary/50 hover:-translate-y-0.5"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Admin'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}