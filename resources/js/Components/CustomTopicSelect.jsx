import { useState } from 'react';
import { LuCheck, LuChevronsUpDown, LuPlus } from "react-icons/lu";
import { router } from '@inertiajs/react';

export default function CustomTopicSelect({ topics, selectedId, onChange, classroomId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    // Cari nama topik yang sedang dipilih
    const selectedTopic = topics.find(t => t.id == selectedId);

    // Logic Tambah Topik via Axios/Inertia tanpa reload halaman penuh
    const handleCreateTopic = (e) => {
        e.preventDefault();
        if (!newTopicTitle.trim()) return;

        router.post(route('admin.kelas.topic.store', classroomId), {
            title: newTopicTitle
        }, {
            preserveScroll: true, // Supaya tidak scroll ke atas
            preserveState: true,  // Supaya isian form materi tidak hilang
            onSuccess: () => {
                setIsCreating(false);
                setNewTopicTitle('');
                // Topik akan otomatis muncul di list karena Inertia merefresh props
            },
            onError: (errors) => {
                alert('Gagal membuat topik. Cek koneksi atau validasi.');
                console.error(errors);
            }
        });
    };

    return (
        <div className="relative">
            <label className="block text-sm font-bold mb-2">Topik / BAB</label>
            
            {/* Trigger Button */}
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-slate-50 border border-transparent px-4 py-3 rounded-xl flex justify-between items-center text-left focus:ring-2 focus:ring-[#2f74a9] transition"
            >
                <span className={selectedTopic ? 'text-slate-700 font-bold' : 'text-slate-400'}>
                    {selectedTopic ? selectedTopic.title : '-- Pilih atau Buat Topik --'}
                </span>
                <LuChevronsUpDown className="text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 p-2 animate-fade-in-up max-h-60 overflow-y-auto">
                    
                    {/* Mode Buat Topik */}
                    {isCreating ? (
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <input 
                                type="text" 
                                value={newTopicTitle}
                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                className="w-full text-sm px-3 py-2 rounded-md border border-slate-200 mb-2"
                                placeholder="Nama BAB baru..."
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleCreateTopic}
                                    type="button"
                                    className="bg-[#2f74a9] text-white text-xs font-bold px-3 py-2 rounded-md flex-1"
                                >
                                    Simpan
                                </button>
                                <button 
                                    onClick={() => setIsCreating(false)}
                                    type="button"
                                    className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-md"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    ) : (
                        // List Topik
                        <>
                            <button 
                                type="button"
                                onClick={() => setIsCreating(true)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#2f74a9] font-bold hover:bg-blue-50 rounded-lg mb-1"
                            >
                                <LuPlus /> Tambah Topik Baru
                            </button>
                            
                            <div className="border-t border-slate-50 my-1"></div>

                            <button 
                                type="button"
                                onClick={() => { onChange(''); setIsOpen(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-lg"
                            >
                                -- Tanpa Topik --
                            </button>

                            {topics.map(topic => (
                                <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => { onChange(topic.id); setIsOpen(false); }}
                                    className={`w-full flex justify-between items-center text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-50 ${selectedId == topic.id ? 'bg-blue-50 text-[#2f74a9] font-bold' : 'text-slate-700'}`}
                                >
                                    {topic.title}
                                    {selectedId == topic.id && <LuCheck />}
                                </button>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}