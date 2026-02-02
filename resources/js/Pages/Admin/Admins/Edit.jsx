import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { LuArrowLeft, LuCamera, LuUpload, LuX, LuShieldCheck } from "react-icons/lu";
// Pastikan path UserAvatar sesuai dengan struktur projectmu
import UserAvatar from '@/Components/UserAvatar'; 

export default function Edit({ admin }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // PENTING untuk update data dengan file upload di Laravel
        name: admin.name,
        email: admin.email,
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    // State untuk menyimpan URL preview gambar baru (jika ada)
    const [preview, setPreview] = useState(null);

    // Handle saat file dipilih
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            // Buat URL objek lokal untuk preview instan
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle reset preview (kembali ke foto lama)
    const handleResetPreview = () => {
        setPreview(null);
        setData('avatar', null);
        // Reset value input file agar bisa memilih file yang sama lagi jika perlu
        document.getElementById('avatarInput').value = null;
    };

    // Cleanup memory saat component unmount atau preview berubah
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const submit = (e) => {
        e.preventDefault();
        // Gunakan 'post' dengan forceFormData: true untuk mengirim file via PUT
        post(route('admin.admins.update', admin.id), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Admin - ${admin.name}`} />

            {/* Header & Back Button */}
            <div className="mb-8">
                <Link 
                    href={route('admin.admins.index')} 
                    className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-brandPrimary transition mb-4"
                >
                    <LuArrowLeft /> Kembali ke Daftar
                </Link>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Data Admin</h1>
                        <p className="text-slate-500 mt-1">Perbarui informasi dan hak akses administrator.</p>
                    </div>
                </div>
            </div>
            
            <form onSubmit={submit} className="max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- Kolom Kiri: Foto Profil --- */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 text-center sticky top-8">
                            <h3 className="font-bold text-slate-800 mb-6">Foto Profil</h3>
                            
                            <div className="relative w-48 h-48 mx-auto group">
                                {/* Container Lingkaran */}
                                <div className={`w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ${errors.avatar ? 'ring-red-500' : 'ring-slate-100'} bg-slate-50 flex items-center justify-center relative`}>
                                    
                                    {/* Logika Tampilan Gambar: Jika ada preview baru, tampilkan itu. Jika tidak, tampilkan foto lama dari DB via UserAvatar */}
                                    {preview ? (
                                        <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserAvatar user={admin} className="w-full h-full text-6xl" />
                                    )}

                                    {/* Overlay Hover "Ubah Foto" */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-full" onClick={() => document.getElementById('avatarInput').click()}>
                                        <LuCamera className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-bold">Ubah Foto</span>
                                    </div>
                                </div>

                                {/* Tombol Batal/Reset Preview (Hanya muncul jika sedang preview foto baru) */}
                                {preview && (
                                    <button 
                                        type="button"
                                        onClick={handleResetPreview}
                                        className="absolute top-2 right-2 p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-red-100 hover:text-red-600 transition shadow-sm z-10 tooltip-trigger"
                                        title="Batal ganti foto"
                                    >
                                        <LuX size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Input File Tersembunyi */}
                            <input 
                                id="avatarInput"
                                type="file" 
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            
                            {/* Info User Saat Ini */}
                            <div className="mt-6 pb-6 border-b border-slate-100">
                                <p className="text-slate-900 font-black text-xl">{admin.name}</p>
                                <p className="text-slate-500 text-sm font-medium">{admin.email}</p>
                            </div>

                            {/* Tombol Trigger Upload */}
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

                    {/* --- Kolom Kanan: Form Data --- */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="font-bold text-lg text-slate-800 mb-8 border-b border-slate-100 pb-4">Detail Informasi Akun</h3>
                            
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Input Nama */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium text-slate-800 placeholder:text-slate-400 transition-all" 
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-2 font-bold">{errors.name}</p>}
                                    </div>

                                    {/* Input Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={e => setData('email', e.target.value)} 
                                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandPrimary/50 font-medium text-slate-800 placeholder:text-slate-400 transition-all" 
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email}</p>}
                                    </div>
                                </div>

                                {/* Area Khusus Ganti Password */}
                                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 mt-8">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm shrink-0">
                                            <LuShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-lg">Keamanan Password</h4>
                                            <p className="text-sm text-amber-700/80 mt-1 leading-relaxed">
                                                Isi kolom di bawah <span className="font-bold">hanya jika</span> Anda ingin mengubah password saat ini. Biarkan kosong jika tidak ada perubahan.
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
                                                placeholder="••••••••"
                                            />
                                            {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Konfirmasi Password</label>
                                            <input 
                                                type="password" 
                                                value={data.password_confirmation} 
                                                onChange={e => setData('password_confirmation', e.target.value)} 
                                                className="w-full px-5 py-3.5 bg-white border-2 border-amber-100 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 transition-all font-medium" 
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
                                <Link 
                                    href={route('admin.admins.index')} 
                                    className="px-8 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition-all"
                                >
                                    Batal
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="group px-8 py-4 bg-brandPrimary text-white font-bold rounded-2xl hover:bg-brandDark transition-all duration-300 shadow-xl shadow-brandPrimary/20 hover:shadow-brandPrimary/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}