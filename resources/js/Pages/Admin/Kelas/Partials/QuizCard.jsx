import { router } from '@inertiajs/react';
// Gunakan Heroicons (Hi2)
import { HiClipboardDocumentList, HiClock, HiTrash } from "react-icons/hi2";

export default function QuizCard({ item }) {
    
    // --- PERBAIKAN LOGIKA PENGAMBILAN ID ---
    // URL Siswa: http://domain.com/student/quiz/15/start
    // Kita cari angka setelah kata "/quiz/"
    // Jika gagal match, default ke null
    const quizId = item.external_url ? item.external_url.match(/\/quiz\/(\d+)/)?.[1] : null;

    const handleCardClick = () => {
        if (quizId) {
            // Arahkan ke ROUTE KUIS, bukan Materi
            router.get(route('admin.quiz.show', quizId));
        } else {
            alert("Error: ID Kuis tidak ditemukan pada link.");
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm('Hapus Kuis ini? Data nilai siswa mungkin akan hilang.')) {
            router.delete(route('admin.material.destroy', item.id)); 
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className="flex items-center gap-5 p-5 bg-white border-l-4 border-l-purple-500 border-y border-r border-slate-100 rounded-r-xl shadow-sm hover:shadow-md transition mb-4 cursor-pointer group relative"
        >
            {/* ICON BESAR (UNGU) */}
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <HiClipboardDocumentList className="text-3xl" />
            </div>

            {/* KONTEN */}
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
                        Kuis Online
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <HiClock /> {item.description ? (item.description.match(/\d+ Menit/) || ['- Menit'])[0] : '- Menit'}
                    </span>
                </div>
                
                <h4 className="text-lg font-bold text-[#1a2b4e] group-hover:text-purple-600 transition">
                    {item.title.replace('[KUIS] ', '')}
                </h4>
                
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                    Klik untuk melihat detail soal dan jawaban.
                </p>
            </div>

            {/* TOMBOL ACTION (Hapus) */}
            <button 
                onClick={handleDelete}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                title="Hapus Kuis"
            >
                <HiTrash className="text-xl" />
            </button>
        </div>
    );
}