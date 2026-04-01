import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LuArrowLeft, LuSave, LuPlus, LuTrash2, LuFileText, LuPlay, LuLink } from "react-icons/lu";
import CustomTopicSelect from '@/Components/CustomTopicSelect';

export default function Create({ classroom, topics }) {
    // State form disesuaikan untuk Multi Attachment
    const { data, setData, post, processing, errors } = useForm({
        class_topic_id: '',
        title: '',
        description: '',
        // Array untuk menampung banyak file/link
        attachments: [], 
    });

    // Helper tambah attachment
    const addAttachment = (type) => {
        setData('attachments', [
            ...data.attachments, 
            // Tambahkan field 'title' kosong
            { type, file: null, url: '', title: '', id: Date.now() } 
        ]);
    };

    // Helper: Hapus item dari list
    const removeAttachment = (index) => {
        const newAtt = [...data.attachments];
        newAtt.splice(index, 1);
        setData('attachments', newAtt);
    };

    // Helper: Update data item (misal isi URL atau pilih File)
    const updateAttachment = (index, field, value) => {
        const newAtt = [...data.attachments];
        newAtt[index][field] = value;
        setData('attachments', newAtt);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.kelas.material.store', classroom.id));
    };

    return (
        <AdminLayout>
            <Head title={`Buat Materi - ${classroom.name}`} />

            {/* Header Halaman */}
            <div className="flex items-center gap-4 mb-8">
                <Link 
                    href={route('admin.kelas.show', classroom.id)} 
                    className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition"
                >
                    <LuArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#1a2b4e]">Buat Materi Baru</h1>
                    <p className="text-slate-500 text-sm">Kelas: {classroom.name}</p>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-4xl pb-20">
                
                {/* CARD 1: INFORMASI DASAR */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <h3 className="font-bold text-lg text-[#1a2b4e] mb-6 border-b border-slate-50 pb-4">Informasi Materi</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Custom Topic Select */}
                        <div>
                            <CustomTopicSelect 
                                topics={topics}
                                classroomId={classroom.id}
                                selectedId={data.class_topic_id}
                                onChange={(val) => setData('class_topic_id', val)}
                            />
                        </div>

                        {/* Judul */}
                        <div>
                            <label className="block text-sm font-bold mb-2">Judul Materi</label>
                            <input 
                                type="text" 
                                value={data.title} 
                                onChange={e => setData('title', e.target.value)} 
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                                placeholder="Contoh: Pengantar Algoritma"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                    </div>
                </div>

                {/* CARD 2: DESKRIPSI (YANG HILANG TADI) */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <label className="block text-sm font-bold mb-2 text-[#1a2b4e]">Deskripsi / Instruksi Pembelajaran</label>
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                        <ReactQuill 
                            theme="snow" 
                            value={data.description} 
                            onChange={(val) => setData('description', val)}
                            className="h-64 mb-12" // Margin bottom agar toolbar tidak tertutup
                        />
                    </div>
                </div>

                {/* CARD 3: LAMPIRAN */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <h3 className="font-bold text-lg text-[#1a2b4e] mb-6 border-b border-slate-50 pb-4">Lampiran & Media</h3>
                    
                    <div className="flex gap-3 mb-6">
                        <button type="button" onClick={() => addAttachment('pdf')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"><LuFileText /> Dokumen</button>
                        <button type="button" onClick={() => addAttachment('video')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"><LuPlay /> Video</button>
                        <button type="button" onClick={() => addAttachment('link')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"><LuLink /> Link</button>
                    </div>

                    <div className="space-y-4">
                        {data.attachments.length === 0 && <p className="text-slate-400 italic text-sm">Belum ada lampiran.</p>}

                        {data.attachments.map((item, index) => (
                            <div key={item.id} className="p-4 border border-slate-200 rounded-xl flex items-start gap-4 bg-slate-50 animate-fade-in-up">
                                {/* Icon Tipe */}
                                <div className="mt-2 text-slate-500">
                                    {item.type === 'pdf' && <LuFileText className="text-xl" />}
                                    {item.type === 'video' && <LuPlay className="text-xl" />}
                                    {item.type === 'link' && <LuLink className="text-xl" />}
                                </div>

                                {/* Input Area */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between">
                                        <p className="text-xs font-bold text-slate-500 uppercase">{item.type}</p>
                                    </div>

                                    {/* INPUT JUDUL LAMPIRAN */}
                                    <input 
                                        type="text" 
                                        placeholder={item.type === 'link' ? "Judul Link (Opsional)" : "Judul File (Opsional, default nama file asli)"}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#2f74a9]"
                                        value={item.title}
                                        onChange={(e) => updateAttachment(index, 'title', e.target.value)}
                                    />

                                    {/* INPUT FILE / URL */}
                                    {item.type === 'link' ? (
                                        <input 
                                            type="url" 
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                            value={item.url}
                                            onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <input 
                                            type="file"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => updateAttachment(index, 'file', e.target.files[0])}
                                            required
                                        />
                                    )}
                                </div>

                                {/* Tombol Hapus */}
                                <button type="button" onClick={() => removeAttachment(index)} className="text-red-400 hover:text-red-600 p-2"><LuTrash2 /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-end gap-4">
                    <button type="submit" disabled={processing} className="px-8 py-4 bg-[#2f74a9] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a2b4e] transition">
                        {processing ? 'Menyimpan...' : 'Terbitkan Materi'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}