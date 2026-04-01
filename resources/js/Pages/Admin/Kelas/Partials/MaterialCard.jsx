import { router } from '@inertiajs/react';
// Ganti import ke Heroicons 2 agar konsisten dan tidak error
import { 
    HiDocumentText, 
    HiPlayCircle, 
    HiLink, 
    HiClipboardDocumentList, 
    HiTrash 
} from "react-icons/hi2";

export default function MaterialCard({ item }) {
    
    const handleCardClick = () => {
        router.get(route('admin.material.show', item.id));
    };

    const handleDelete = (e) => {
        e.stopPropagation(); 
        if (confirm('Hapus materi ini beserta seluruh lampirannya?')) {
            router.delete(route('admin.material.destroy', item.id));
        }
    };

    const stopProp = (e) => e.stopPropagation();

    // LOGIKA WARNA & ICON DINAMIS
    // Kita buat fungsi kecil biar rapi
    const getIconInfo = (type) => {
        switch (type) {
            case 'pdf':
                return { color: 'bg-red-50 text-red-500 border-red-100', icon: <HiDocumentText /> };
            case 'video':
                return { color: 'bg-blue-50 text-blue-500 border-blue-100', icon: <HiPlayCircle /> };
            case 'link':
                return { color: 'bg-sky-50 text-sky-500 border-sky-100', icon: <HiLink /> };
            case 'quiz':
                return { color: 'bg-purple-50 text-purple-500 border-purple-100', icon: <HiClipboardDocumentList /> };
            default:
                // DEFAULT (Jika tipe kosong/null, pakai warna abu-abu & icon dokumen)
                return { color: 'bg-slate-100 text-slate-500 border-slate-200', icon: <HiDocumentText /> };
        }
    };

    const { color, icon } = getIconInfo(item.type);

    return (
        <div 
            onClick={handleCardClick}
            className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-blue-200 transition mb-3 last:mb-0 cursor-pointer group relative"
        >
            {/* ICON BOX */}
            {/* Sekarang menggunakan variabel 'color' dan 'icon' dari fungsi di atas */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border transition-colors ${color}`}>
                {icon}
            </div>

            {/* CONTENT */}
            <div className="flex-1 min-w-0"> {/* min-w-0 agar text truncate jalan */}
                <h4 className="font-bold text-[#1a2b4e] group-hover:text-[#2f74a9] transition text-base truncate pr-8">
                    {item.title}
                </h4>
                
                {/* Description */}
                {item.description ? (
                    <div className="text-sm text-slate-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: item.description }}></div>
                ) : (
                    <p className="text-sm text-slate-400 mt-1 italic">Tidak ada deskripsi</p>
                )}
                
                {/* Info Lampiran */}
                <div className="flex gap-3 mt-3">
                    {item.attachments && item.attachments.length > 0 ? (
                         <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                            {item.attachments.length} Lampiran
                         </span>
                    ) : (
                        // Fallback Old Data
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        </span>
                    )}
                </div>
            </div>

            {/* DELETE BUTTON */}
            <button 
                onClick={handleDelete} 
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                title="Hapus Materi"
            >
                <HiTrash className="text-lg" />
            </button>
        </div>
    );
}