import { useForm } from '@inertiajs/react';

export default function SettingsTab({ classroom }) {
    const { data, setData, put, processing, errors } = useForm({
        type: 'update_info', // Penanda untuk Controller agar masuk ke logika update info
        name: classroom.name,
        academic_year: classroom.academic_year,
        description: classroom.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Route resource 'kelas' otomatis bernama admin.kelas.update
        put(route('admin.kelas.update', classroom.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="max-w-2xl bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h2 className="font-bold text-xl text-[#1a2b4e] mb-6">Konfigurasi Umum</h2>
            
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold mb-2">Nama Kelas</label>
                    <input 
                        type="text" 
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Tahun Ajaran</label>
                    <input 
                        type="text" 
                        value={data.academic_year} 
                        onChange={e => setData('academic_year', e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                    />
                    {errors.academic_year && <p className="text-red-500 text-xs mt-1">{errors.academic_year}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Deskripsi</label>
                    <textarea 
                        rows="4" 
                        value={data.description} 
                        onChange={e => setData('description', e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                    />
                </div>

                <div className="pt-4 border-t border-slate-50">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="bg-[#2f74a9] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-[#1a2b4e] transition disabled:opacity-70"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                    </button>
                </div>
            </form>
        </div>
    );
}