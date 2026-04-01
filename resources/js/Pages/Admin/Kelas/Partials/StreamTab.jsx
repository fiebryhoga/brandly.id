import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { LuFolderPlus, LuFolderOpen, LuPlus, LuFileQuestion, LuTrash } from "react-icons/lu";
import { CgRename } from "react-icons/cg";
import { MdMoreVert } from "react-icons/md";
import MaterialCard from './MaterialCard';
import TopicModal from './Modals/TopicModal';
import QuizCard from './QuizCard';

// Hapus prop 'onOpenQuiz' karena sudah tidak dipakai (diganti Link)
export default function StreamTab({ classroom, onOpenMaterial }) {
    // State untuk Modal Topik
    const [isTopicModalOpen, setTopicModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);

    // State untuk Dropdown menu
    const [activeDropdownId, setActiveDropdownId] = useState(null);

    // Handler Buka Modal Create
    const handleCreateTopic = () => {
        setEditingTopic(null);
        setTopicModalOpen(true);
    };

    // Handler Buka Modal Edit
    const handleEditTopic = (topic) => {
        setEditingTopic(topic);
        setTopicModalOpen(true);
        setActiveDropdownId(null);
    };

    // Handler Delete Topik
    const handleDeleteTopic = (topicId) => {
        setActiveDropdownId(null);
        if (confirm('Apakah Anda yakin ingin menghapus topik ini? \n\nSemua materi di dalamnya TIDAK akan terhapus, tetapi akan dipindahkan ke "Materi Umum".')) {
            router.delete(route('admin.topic.destroy', topicId));
        }
    };

    // HELPER: Fungsi sorting (ID Kecil = Terdahulu/Lama di atas)
    const sortOldestFirst = (a, b) => a.id - b.id;

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Buttons */}
                <div className="lg:col-span-1 space-y-3">
                    <button onClick={handleCreateTopic} className="w-full py-3 bg-[#1a2b4e] text-white rounded-xl font-bold hover:opacity-90 flex items-center justify-center gap-2">
                        <LuFolderPlus /> Buat BAB
                    </button>
                    
                    <Link 
                        href={route('admin.kelas.material.create', classroom.id)} 
                        className="w-full py-3 bg-[#2f74a9] text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        <LuPlus /> Upload Materi
                    </Link>

                    {/* PERUBAHAN DISINI: Menggunakan Link ke Halaman Create Kuis */}
                    <Link 
                        href={route('admin.kelas.quiz.create', classroom.id)} 
                        className="w-full py-3 bg-white border-2 border-[#2f74a9] text-[#2f74a9] rounded-xl font-bold hover:bg-[#2f74a9] hover:text-white flex items-center justify-center gap-2 transition"
                    >
                        <LuFileQuestion /> Buat Kuis
                    </Link>
                </div>

                {/* Content List */}
                <div className="lg:col-span-3 space-y-8 pb-20">
                    {/* Uncategorized (Materi Umum) */}
                    {classroom.uncategorized_materials?.length > 0 && (
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-dashed border-slate-300">
                            <h3 className="font-bold text-slate-500 mb-4 flex items-center gap-2"><LuFolderOpen /> Materi Umum</h3>
                            {/* SORTING DITERAPKAN DISINI */}
                            {classroom.uncategorized_materials
                                .sort(sortOldestFirst) 
                                .map(item => (
                                    <MaterialCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}

                    {/* Topics Loop */}
                    {/* Topics Loop */}
                    {classroom.topics.map(topic => (
                        <div key={topic.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-visible relative">
                            <div className="bg-slate-50/50 p-6 border-b border-slate-50 flex justify-between items-center relative">
                                <h3 className="text-xl font-black text-[#1a2b4e]">{topic.title}</h3>
                                
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                                        {topic.materials.length} Materi
                                    </span>

                                    {/* MENU TITIK TIGA */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setActiveDropdownId(activeDropdownId === topic.id ? null : topic.id)}
                                            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                        >
                                            <MdMoreVert />
                                        </button>

                                        {/* Dropdown Content */}
                                        {activeDropdownId === topic.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-fade-in-up">
                                                    <button 
                                                        onClick={() => handleEditTopic(topic)}
                                                        className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <CgRename className="text-blue-500"/> Rename Topik
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteTopic(topic.id)}
                                                        className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <LuTrash /> Hapus Topik
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* --- BAGIAN INI YANG DIUBAH --- */}
                            <div className="p-6">
                                {topic.materials.length === 0 ? (
                                    <p className="text-slate-400 italic text-center text-sm">Belum ada materi di topik ini</p>
                                ) : (
                                    // SORTING DITERAPKAN DISINI JUGA
                                    topic.materials
                                        .sort(sortOldestFirst)
                                        .map(item => {
                                            // CEK TIPE: JIKA KUIS PAKAI QUIZCARD, LAINNYA MATERIALCARD
                                            if (item.type === 'quiz') {
                                                return <QuizCard key={item.id} item={item} />;
                                            }
                                            return <MaterialCard key={item.id} item={item} />;
                                        })
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TopicModal 
                isOpen={isTopicModalOpen} 
                onClose={() => setTopicModalOpen(false)} 
                classroomId={classroom.id}
                topic={editingTopic} 
            />
        </>
    );
}