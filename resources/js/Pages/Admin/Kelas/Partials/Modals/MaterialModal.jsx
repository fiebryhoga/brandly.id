import { useForm } from '@inertiajs/react';
import { LuX } from "react-icons/lu";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import CSS Quill
import CustomTopicSelect from '@/Components/CustomTopicSelect'; // Import Komponen Baru

export default function MaterialModal({ isOpen, onClose, classroomId, topics }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        class_topic_id: '',
        title: '',
        cp: '', // Capaian Pembelajaran
        tp: '', // Tujuan Pembelajaran
        description: '', // Rich Text
        type: 'pdf',
        file: null,
        url: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kelas.material.store', classroomId), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl animate-fade-in-up my-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#1a2b4e]">Upload Materi Baru</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><LuX /></button>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    
                    {/* 1. Custom Dropdown Topic */}
                    <CustomTopicSelect 
                        topics={topics}
                        classroomId={classroomId}
                        selectedId={data.class_topic_id}
                        onChange={(val) => setData('class_topic_id', val)}
                    />

                    {/* 2. Judul */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Judul Materi</label>
                        <input 
                            type="text" 
                            value={data.title} 
                            onChange={e => setData('title', e.target.value)} 
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                            placeholder="Contoh: Modul Dasar Pemrograman"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    {/* 3. Identitas Pembelajaran (CP & TP) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-2">Capaian Pembelajaran (CP)</label>
                            <textarea 
                                value={data.cp} 
                                onChange={e => setData('cp', e.target.value)} 
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                                rows="3"
                                placeholder="Siswa mampu..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Tujuan Pembelajaran (TP)</label>
                            <textarea 
                                value={data.tp} 
                                onChange={e => setData('tp', e.target.value)} 
                                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                                rows="3"
                                placeholder="1. Memahami konsep..."
                            ></textarea>
                        </div>
                    </div>

                    {/* 4. Deskripsi (Rich Text) */}
                    <div>
                        <label className="block text-sm font-bold mb-2">Deskripsi / Instruksi (Rich Text)</label>
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                            <ReactQuill 
                                theme="snow" 
                                value={data.description} 
                                onChange={(val) => setData('description', val)}
                                className="h-40 mb-10" // Margin bottom biar toolbar gak kepotong
                            />
                        </div>
                    </div>

                    {/* 5. Tipe Konten & File */}
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="block text-sm font-bold mb-3">File / Konten Materi</label>
                        <div className="flex gap-4 mb-4">
                            {['pdf', 'video', 'link'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setData('type', type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition ${data.type === type ? 'bg-[#2f74a9] text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 border border-slate-200'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {data.type === 'link' ? (
                            <input 
                                type="url" 
                                value={data.url} 
                                onChange={e => setData('url', e.target.value)} 
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#2f74a9]" 
                                placeholder="https://youtube.com/..." 
                            />
                        ) : (
                            <input 
                                type="file" 
                                onChange={e => setData('file', e.target.files[0])} 
                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2f74a9]/10 file:text-[#2f74a9]" 
                            />
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing} 
                        className="w-full bg-[#2f74a9] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#1a2b4e] transition shadow-lg shadow-blue-200"
                    >
                        {processing ? 'Mengupload...' : 'Simpan Materi'}
                    </button>
                </form>
            </div>
        </div>
    );
}