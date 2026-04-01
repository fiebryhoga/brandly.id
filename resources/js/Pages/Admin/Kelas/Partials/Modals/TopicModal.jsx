import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { LuX } from "react-icons/lu";

// Tambahkan prop 'topic' (jika ada isinya berarti mode edit)
export default function TopicModal({ isOpen, onClose, classroomId, topic = null }) {
    const { data, setData, post, put, processing, reset, errors } = useForm({ 
        title: '' 
    });

    // Reset atau isi form saat modal dibuka/topic berubah
    useEffect(() => {
        if (topic) {
            setData('title', topic.title);
        } else {
            setData('title', '');
        }
    }, [topic, isOpen]);

    const submit = (e) => {
        e.preventDefault();
        
        if (topic) {
            // MODE EDIT
            put(route('admin.topic.update', topic.id), {
                onSuccess: () => { onClose(); reset(); }
            });
        } else {
            // MODE CREATE
            post(route('admin.kelas.topic.store', classroomId), {
                onSuccess: () => { onClose(); reset(); }
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-[#1a2b4e]">
                        {topic ? 'Edit Nama Topik' : 'Buat Topik Baru'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><LuX /></button>
                </div>
                <form onSubmit={submit}>
                    <label className="block text-sm font-bold mb-2">Nama Topik</label>
                    <input 
                        type="text" 
                        value={data.title} 
                        onChange={e => setData('title', e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl mb-6 focus:ring-2 focus:ring-[#2f74a9]" 
                        placeholder="Contoh: BAB 1 - Pendahuluan" 
                        autoFocus 
                    />
                    <div className="flex gap-3">
                        <button type="submit" disabled={processing} className="flex-1 bg-[#2f74a9] text-white py-3 rounded-xl font-bold hover:bg-[#245b85] transition">
                            {topic ? 'Simpan Perubahan' : 'Buat Topik'}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}