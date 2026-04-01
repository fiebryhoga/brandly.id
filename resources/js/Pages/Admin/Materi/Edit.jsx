import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LuArrowLeft, LuSave, LuPlus, LuTrash2, LuFileText, LuPlay, LuLink, LuX } from "react-icons/lu";
import CustomTopicSelect from '@/Components/CustomTopicSelect';

export default function Edit({ material, classroom, topics }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST',
        class_topic_id: material.class_topic_id || '',
        title: material.title,
        description: material.description || '',
        
        existing_attachments: material.attachments,
        deleted_attachment_ids: [],
        
        new_attachments: [], 
    });

    // Helper: Tandai attachment lama untuk dihapus
    const markAsDeleted = (id) => {
        if(confirm('Hapus lampiran ini? (Akan hilang setelah Disimpan)')) {
            setData(prev => ({
                ...prev,
                existing_attachments: prev.existing_attachments.filter(item => item.id !== id),
                deleted_attachment_ids: [...prev.deleted_attachment_ids, id]
            }));
        }
    };

    // --- PERBAIKAN DI SINI ---
    // Helper tambah attachment
    const addAttachment = (type) => {
        // Ganti 'attachments' menjadi 'new_attachments'
        setData('new_attachments', [
            ...data.new_attachments, 
            { type, file: null, url: '', title: '', id: Date.now() } 
        ]);
    };

    const removeNewAttachment = (index) => {
        const newAtt = [...data.new_attachments];
        newAtt.splice(index, 1);
        setData('new_attachments', newAtt);
    };

    const updateNewAttachment = (index, field, value) => {
        const newAtt = [...data.new_attachments];
        newAtt[index][field] = value;
        setData('new_attachments', newAtt);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.material.update', material.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit Materi - ${material.title}`} />
            
            <div className="flex items-center gap-4 mb-8">
                <Link href={route('admin.material.show', material.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition">
                    <LuArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#1a2b4e]">Edit Materi</h1>
                    <p className="text-slate-500 text-sm">Kelas: {classroom.name}</p>
                </div>
            </div>

            <form onSubmit={submit} className="max-w-4xl pb-20">
                {/* BAGIAN 1: INFO UTAMA */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                             <CustomTopicSelect topics={topics} classroomId={classroom.id} selectedId={data.class_topic_id} onChange={(val) => setData('class_topic_id', val)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Judul Materi</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* BAGIAN 2: EDITOR */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <label className="block text-sm font-bold mb-2">Deskripsi</label>
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                        <ReactQuill theme="snow" value={data.description} onChange={(val) => setData('description', val)} className="h-64 mb-12" />
                    </div>
                </div>

                {/* BAGIAN 3: ATTACHMENTS */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <h3 className="font-bold text-lg text-[#1a2b4e] mb-6">Lampiran & Media</h3>

                    {/* LIST LAMPIRAN LAMA */}
                    {data.existing_attachments.length > 0 && (
                        <div className="mb-6 space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase">Lampiran Saat Ini</p>
                            {data.existing_attachments.map(att => (
                                <div key={att.id} className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold uppercase bg-white px-2 py-1 rounded border border-emerald-200">{att.type}</span>
                                        <span className="text-sm font-bold text-emerald-800 line-clamp-1">
                                            {att.title || (att.type === 'link' ? att.url : att.file_path.split('/').pop())}
                                        </span>
                                    </div>
                                    <button type="button" onClick={() => markAsDeleted(att.id)} className="text-red-400 hover:text-red-600 p-2"><LuTrash2 /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TOMBOL TAMBAH BARU */}
                    <div className="flex gap-3 mb-6 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => addAttachment('pdf')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"><LuPlus /><LuFileText /> Tambah Dokumen</button>
                        <button type="button" onClick={() => addAttachment('video')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"><LuPlus /><LuPlay /> Tambah Video</button>
                        <button type="button" onClick={() => addAttachment('link')} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100"><LuPlus /><LuLink /> Tambah Link</button>
                    </div>

                    {/* INPUT LAMPIRAN BARU */}
                    <div className="space-y-4">
                        {data.new_attachments.map((item, index) => (
                            <div key={item.id} className="p-4 border border-blue-200 bg-blue-50/50 rounded-xl flex items-start gap-4">
                                <div className="mt-2 text-slate-500">
                                    {item.type === 'pdf' && <LuFileText />}
                                    {item.type === 'video' && <LuPlay />}
                                    {item.type === 'link' && <LuLink />}
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between">
                                        <p className="text-xs font-bold text-slate-500 uppercase">{item.type}</p>
                                    </div>

                                    {/* INPUT JUDUL LAMPIRAN */}
                                    {/* PERBAIKAN: Ganti 'updateAttachment' jadi 'updateNewAttachment' */}
                                    <input 
                                        type="text" 
                                        placeholder={item.type === 'link' ? "Judul Link (Opsional)" : "Judul File (Opsional)"}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#2f74a9]"
                                        value={item.title}
                                        onChange={(e) => updateNewAttachment(index, 'title', e.target.value)}
                                    />

                                    {/* INPUT FILE / URL */}
                                    {item.type === 'link' ? (
                                        <input 
                                            type="url" 
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                            value={item.url}
                                            onChange={(e) => updateNewAttachment(index, 'url', e.target.value)}
                                            required
                                        />
                                    ) : (
                                        <input 
                                            type="file"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => updateNewAttachment(index, 'file', e.target.files[0])}
                                            required
                                        />
                                    )}
                                </div>
                                <button type="button" onClick={() => removeNewAttachment(index)} className="text-slate-400 hover:text-red-500"><LuX /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="submit" disabled={processing} className="px-8 py-4 bg-[#2f74a9] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a2b4e] transition">
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}