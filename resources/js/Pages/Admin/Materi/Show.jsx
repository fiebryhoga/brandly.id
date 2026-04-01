import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
// Tambahkan LuBookOpen untuk ikon deskripsi
import { LuArrowLeft, LuFileText, LuPlay, LuLink, LuDownload, LuChevronDown, LuChevronUp, LuPencil, LuBookOpen } from "react-icons/lu";

// KOMPONEN KECIL: ITEM LAMPIRAN (ACCORDION)
const AttachmentItem = ({ att }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Deteksi jika link adalah Youtube
    const isYoutube = att.type === 'link' && (att.url.includes('youtube.com') || att.url.includes('youtu.be'));
    const getYoutubeEmbed = (url) => url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 shadow-sm transition-all hover:shadow-md">
            {/* HEADER (Bisa diklik untuk expand) */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 flex items-center justify-between cursor-pointer transition ${isOpen ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border transition-colors ${
                        att.type === 'pdf' ? 'bg-red-50 border-red-100 text-red-500' : 
                        att.type === 'video' ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-purple-50 border-purple-100 text-purple-500'
                    }`}>
                        {att.type === 'pdf' && <LuFileText />}
                        {att.type === 'video' && <LuPlay />}
                        {att.type === 'link' && <LuLink />}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-base">
                            {att.judul || att.title || "Tanpa Judul"}
                        </p>
                    </div>
                </div>
                <button className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <LuChevronDown className="text-xl" />
                </button>
            </div>

            {/* CONTENT BODY (Muncul jika isOpen == true) */}
            {isOpen && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 animate-fade-in-down">
                    
                    {/* 1. TAMPILAN PDF */}
                    {att.type === 'pdf' && (
                        <div className="w-full h-[600px] bg-slate-200 rounded-xl overflow-hidden relative group border border-slate-200 shadow-inner">
                            <iframe src={`/storage/${att.file_path}`} className="w-full h-full" title="PDF Viewer"></iframe>
                            <a href={`/storage/${att.file_path}`} download className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg text-[#2f74a9] text-sm font-bold flex items-center gap-2 hover:bg-[#2f74a9] hover:text-white transition transform hover:scale-105">
                                <LuDownload /> Download PDF
                            </a>
                        </div>
                    )}

                    {/* 2. TAMPILAN VIDEO */}
                    {att.type === 'video' && (
                        <video controls className="w-full rounded-xl bg-black max-h-[500px] shadow-lg">
                            <source src={`/storage/${att.file_path}`} type="video/mp4" />
                            Browser Anda tidak mendukung tag video.
                        </video>
                    )}

                    {/* 3. TAMPILAN LINK */}
                    {att.type === 'link' && (
                        <div className="w-full">
                            {isYoutube ? (
                                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                                    <iframe className="w-full h-full" src={getYoutubeEmbed(att.url)} allowFullScreen></iframe>
                                </div>
                            ) : (
                                <div className="p-8 bg-white rounded-xl text-center border border-slate-200 shadow-sm">
                                    <div className="w-16 h-16 bg-blue-50 text-[#2f74a9] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                        <LuLink />
                                    </div>
                                    <h4 className="font-bold text-slate-700 mb-2">Tautan Eksternal</h4>
                                    <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">Halaman ini mengarah ke website luar. Klik tombol di bawah untuk membukanya.</p>
                                    <a href={att.url} target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2f74a9] text-white rounded-xl font-bold hover:bg-[#1a2b4e] transition shadow-lg shadow-blue-200 transform hover:-translate-y-1">
                                        Buka Tautan <LuLink />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function Show({ material, classroom }) {
    return (
        <AdminLayout>
            <Head title={material.title} />

            {/* Navigasi Atas */}
            <div className="flex justify-between items-center mb-8">
                <Link href={route('admin.kelas.show', classroom.id)} className="flex items-center gap-2 text-slate-500 hover:text-[#2f74a9] font-bold transition group">
                    <div className="p-2 bg-white border border-slate-200 rounded-lg group-hover:border-[#2f74a9] transition">
                        <LuArrowLeft /> 
                    </div>
                    Kembali ke Kelas
                </Link>

                {/* TOMBOL EDIT */}
                <Link 
                    href={route('admin.material.edit', material.id)} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition shadow-sm"
                >
                    <LuPencil /> Edit Materi
                </Link>
            </div>

            <div className="max-w-5xl mx-auto pb-20">
                {/* Judul & Info Utama */}
                <div className="bg-white p-8 md:p-10 rounded-lg border border-slate-100 shadow-xl shadow-slate-200/50 mb-10 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100%] opacity-50 -z-0"></div>
                    
                    <div className="relative z-10">
                        {/* <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2f74a9] text-xs font-black tracking-wider uppercase mb-3 border border-blue-100">
                            Materi Pembelajaran
                        </span> */}
                        <h1 className="text-3xl md:text-4xl font-black text-[#1a2b4e] mb-2 leading-tight">
                            {material.title}
                        </h1>
                        <p className="text-slate-400 font-medium">Topik: {material.topic?.title || 'Umum'}</p>

                        {/* --- BAGIAN DESKRIPSI YANG DIPERBAIKI --- */}
                        {/* --- BAGIAN DESKRIPSI YANG SUDAH DIPADATKAN --- */}
                        <div className="mt-8 bg-[#f8fafc] rounded-2xl p-6 md:p-8 border border-slate-200 relative overflow-hidden">
                            {/* Aksen Garis Kiri */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#2f74a9]"></div>
                            
                            {/* Header Deskripsi */}
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200/60">
                                <div className="p-2 bg-white rounded-lg text-[#2f74a9] shadow-sm border border-slate-100">
                                    <LuBookOpen className="text-lg" />
                                </div>
                                <h3 className="font-bold text-[#1a2b4e] text-base">Deskripsi & Instruksi</h3>
                            </div>

                            {/* Isi Rich Text (Compact Version) */}
                            <div 
                                className="prose prose-sm max-w-none leading-snug
                                    text-slate-600
                                    
                                    /* Mengatur Heading agar tidak raksasa */
                                    prose-headings:text-[#1a2b4e] prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4
                                    
                                    /* Mengatur Paragraf agar rapat */
                                    prose-p:text-slate-600 prose-p:my-2
                                    
                                    /* Mengatur Link */
                                    prose-a:text-[#2f74a9] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                    
                                    /* Mengatur List agar rapat */
                                    prose-ul:my-2 prose-ul:list-disc prose-li:my-0.5 prose-li:marker:text-[#2f74a9]
                                    prose-ol:my-2 prose-ol:list-decimal
                                    
                                    /* Mengatur Gambar */
                                    prose-img:rounded-xl prose-img:shadow-md prose-img:my-4"
                                    
                                dangerouslySetInnerHTML={{ __html: material.description || '<p class="italic text-slate-400">Tidak ada deskripsi tambahan.</p>' }}
                            >
                            </div>
                        </div>
                        {/* --- AKHIR BAGIAN DESKRIPSI --- */}
                    </div>
                </div>

                {/* List Lampiran (Accordion) */}
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="h-8 w-1.5 bg-[#2f74a9] rounded-full"></div>
                    <h3 className="font-bold text-2xl text-[#1a2b4e]">
                        Media & Lampiran 
                        <span className="ml-2 text-lg font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {material.attachments.length}
                        </span>
                    </h3>
                </div>
                
                <div className="space-y-4">
                    {material.attachments.map(att => (
                        <AttachmentItem key={att.id} att={att} />
                    ))}
                    {material.attachments.length === 0 && (
                        <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50">
                            <p className="text-slate-400 font-bold text-lg">Tidak ada file lampiran.</p>
                            <p className="text-slate-400 text-sm">Semua materi ada di deskripsi di atas.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}