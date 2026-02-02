import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { LuLayout, LuUsers, LuSettings, LuFileText, LuPlayCircle, LuLink, LuPlus, LuTrash2, LuDownload } from "react-icons/lu";
import { LuCheckCircle, LuX, LuPlusCircle } from "react-icons/lu";
import UserAvatar from '@/Components/UserAvatar';
import UserSelector from '@/Components/UserSelector';

export default function Show({ classroom, availableTeachers, availableStudents }) {
    const [activeTab, setActiveTab] = useState('stream'); // stream, people, settings
    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);

    // Form Khusus Upload Materi
    const materialForm = useForm({
        title: '',
        description: '',
        type: 'pdf', // pdf, video, link
        file: null,
        url: '',
    });

    const handleMaterialSubmit = (e) => {
        e.preventDefault();
        materialForm.post(route('admin.kelas.material.store', classroom.id), {
            onSuccess: () => {
                setMaterialModalOpen(false);
                materialForm.reset();
            }
        });
    };

    // Form Khusus Update Anggota & Info
    const settingsForm = useForm({
        type: 'update_info', // atau 'update_members'
        name: classroom.name,
        description: classroom.description,
        academic_year: classroom.academic_year,
        teachers: classroom.teachers.map(t => t.id),
        students: classroom.students.map(s => s.id),
    });

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        settingsForm.setData('type', 'update_info');
        settingsForm.put(route('admin.kelas.update', classroom.id));
    };

    const handleUpdateMembers = () => {
        settingsForm.setData('type', 'update_members');
        settingsForm.put(route('admin.kelas.update', classroom.id));
    };

    const [isQuizModalOpen, setQuizModalOpen] = useState(false);

    const quizForm = useForm({
        title: '',
        description: '',
        duration_minutes: 60,
        questions: [
            // Struktur data soal default (1 soal kosong)
            { 
                text: '', 
                options: ['', '', '', ''], // 4 Opsi kosong
                correct_option_index: 0 // Default jawaban A (index 0)
            }
        ]
    });

    const addQuestion = () => {
        const newQuestions = [...quizForm.data.questions, { 
            text: '', 
            options: ['', '', '', ''], 
            correct_option_index: 0 
        }];
        quizForm.setData('questions', newQuestions);
    };
    
    // Helper Function: Hapus Soal
    const removeQuestion = (index) => {
        const newQuestions = quizForm.data.questions.filter((_, i) => i !== index);
        quizForm.setData('questions', newQuestions);
    };

    // Helper Function: Update Teks Soal
    const updateQuestionText = (index, val) => {
        const newQuestions = [...quizForm.data.questions];
        newQuestions[index].text = val;
        quizForm.setData('questions', newQuestions);
    };

    // Helper Function: Update Opsi Jawaban
    const updateOptionText = (qIndex, oIndex, val) => {
        const newQuestions = [...quizForm.data.questions];
        newQuestions[qIndex].options[oIndex] = val;
        quizForm.setData('questions', newQuestions);
    };

    // Helper Function: Set Kunci Jawaban
    const setCorrectOption = (qIndex, oIndex) => {
        const newQuestions = [...quizForm.data.questions];
        newQuestions[qIndex].correct_option_index = oIndex;
        quizForm.setData('questions', newQuestions);
    };

    const handleQuizSubmit = (e) => {
        e.preventDefault();
        quizForm.post(route('admin.kelas.quiz.store', classroom.id), {
            onSuccess: () => {
                setQuizModalOpen(false);
                quizForm.reset();
            }
        });
    };

    return (
        <AdminLayout>
            <Head title={classroom.name} />

            {/* HERO HEADER KELAS */}
            <div className="bg-[#1a2b4e] rounded-[2rem] p-8 text-white mb-8 relative overflow-hidden shadow-xl shadow-blue-200/50">
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                {classroom.academic_year}
                            </span>
                            <span className="text-emerald-300 font-bold text-xs flex items-center gap-1">
                                ● {classroom.students.length} Siswa Aktif
                            </span>
                        </div>
                        <h1 className="text-4xl font-black mb-2">{classroom.name}</h1>
                        <p className="text-white/70 max-w-xl">{classroom.description || 'Tidak ada deskripsi kelas.'}</p>
                    </div>
                    {/* Guru Utama Avatar */}
                    <div className="flex -space-x-3">
                        {classroom.teachers.map(t => (
                            <UserAvatar key={t.id} user={t} className="w-12 h-12 border-2 border-[#1a2b4e]" />
                        ))}
                    </div>
                </div>
                {/* Dekorasi */}
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-[#2f74a9] rounded-full blur-[80px] opacity-50"></div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-6 border-b border-slate-200 mb-8 px-2">
                {[
                    { id: 'stream', label: 'Materi & Aktivitas', icon: LuLayout },
                    { id: 'people', label: 'Anggota Kelas', icon: LuUsers },
                    { id: 'settings', label: 'Konfigurasi', icon: LuSettings },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 ${
                            activeTab === tab.id 
                            ? 'text-[#2f74a9] border-[#2f74a9]' 
                            : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                    >
                        <tab.icon /> {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENT AREA */}
            <div className="animate-fade-in-up">
                
                {/* --- TAB 1: STREAM (LMS) --- */}
                {activeTab === 'stream' && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Kiri: Tombol Aksi */}
                        <div className="lg:col-span-1 space-y-4">
                            <button 
                                onClick={() => setMaterialModalOpen(true)}
                                className="w-full py-4 bg-[#2f74a9] text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-[#1a2b4e] transition flex items-center justify-center gap-2"
                            >
                                <LuPlus className="text-xl" /> Buat Materi
                            </button>

                            <button 
                                onClick={() => setQuizModalOpen(true)}
                                className="w-full py-4 bg-white border-2 border-[#2f74a9] text-[#2f74a9] rounded-2xl font-bold hover:bg-[#2f74a9] hover:text-white transition flex items-center justify-center gap-2 mt-3"
                            >
                                <LuFileQuestion className="text-xl" /> Buat Kuis Baru
                            </button>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 text-sm">
                                <p className="font-bold text-[#1a2b4e] mb-2">Mendatang</p>
                                <p className="text-slate-400 text-xs">Tidak ada tugas yang tenggat waktunya segera.</p>
                            </div>
                        </div>

                        {/* Main Feed */}
                        <div className="lg:col-span-3 space-y-4">
                            {classroom.materials.length === 0 && (
                                <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold">Belum ada materi dibagikan.</p>
                                </div>
                            )}

                            {classroom.materials.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition group relative">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                                            item.type === 'pdf' ? 'bg-red-50 text-red-500' :
                                            item.type === 'video' ? 'bg-blue-50 text-blue-500' :
                                            'bg-emerald-50 text-emerald-500'
                                        }`}>
                                            {item.type === 'pdf' && <LuFileText />}
                                            {item.type === 'video' && <LuPlayCircle />}
                                            {item.type === 'link' && <LuLink />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-[#1a2b4e] text-lg">{item.title}</h3>
                                            <p className="text-xs text-slate-400 mb-2">{new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                                            
                                            {/* Attachment Preview */}
                                            {item.file_path && (
                                                <a href={`/storage/${item.file_path}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition">
                                                    <LuDownload /> Download Materi
                                                </a>
                                            )}
                                            {item.external_url && (
                                                <a href={item.external_url} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-[#2f74a9] rounded-xl text-sm font-bold hover:bg-blue-50 transition">
                                                    <LuLink /> Buka Link
                                                </a>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => { if(confirm('Hapus materi ini?')) router.delete(route('admin.material.destroy', item.id)) }}
                                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <LuTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB 2: ANGGOTA (PEOPLE) --- */}
                {activeTab === 'people' && (
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl text-[#1a2b4e]">Manajemen Anggota</h2>
                            <button onClick={handleUpdateMembers} className="bg-[#47be9e] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition">
                                Simpan Perubahan Anggota
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <UserSelector 
                                    title="Guru Pengajar" 
                                    users={availableTeachers}
                                    selectedIds={settingsForm.data.teachers}
                                    onChange={ids => settingsForm.setData('teachers', ids)}
                                    labelField="nip"
                                />
                            </div>
                            <div>
                                <UserSelector 
                                    title="Siswa" 
                                    users={availableStudents}
                                    selectedIds={settingsForm.data.students}
                                    onChange={ids => settingsForm.setData('students', ids)}
                                    labelField="nis"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 3: PENGATURAN (SETTINGS) --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h2 className="font-bold text-xl text-[#1a2b4e] mb-6">Konfigurasi Umum</h2>
                        <form onSubmit={handleUpdateInfo} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Nama Kelas</label>
                                <input type="text" value={settingsForm.data.name} onChange={e => settingsForm.setData('name', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Tahun Ajaran</label>
                                <input type="text" value={settingsForm.data.academic_year} onChange={e => settingsForm.setData('academic_year', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Deskripsi</label>
                                <textarea rows="3" value={settingsForm.data.description} onChange={e => settingsForm.setData('description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" />
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-[#2f74a9] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200">
                                    Simpan Konfigurasi
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* MODAL UPLOAD MATERI */}
            {isMaterialModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-black text-[#1a2b4e] mb-6">Upload Materi Baru</h3>
                        <form onSubmit={handleMaterialSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Judul Materi</label>
                                <input type="text" value={materialForm.data.title} onChange={e => materialForm.setData('title', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" placeholder="Contoh: Modul Digital Branding 1" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Tipe Konten</label>
                                <select value={materialForm.data.type} onChange={e => materialForm.setData('type', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl">
                                    <option value="pdf">Dokumen PDF/Word</option>
                                    <option value="video">Upload Video</option>
                                    <option value="link">Link Eksternal (Youtube/Drive)</option>
                                </select>
                            </div>

                            {materialForm.data.type === 'link' ? (
                                <div>
                                    <label className="block text-sm font-bold mb-2">URL Link</label>
                                    <input type="url" value={materialForm.data.url} onChange={e => materialForm.setData('url', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" placeholder="https://..." />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold mb-2">Upload File</label>
                                    <input type="file" onChange={e => materialForm.setData('file', e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#2f74a9]/10 file:text-[#2f74a9]" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold mb-2">Deskripsi</label>
                                <textarea value={materialForm.data.description} onChange={e => materialForm.setData('description', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" rows="2"></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={materialForm.processing} className="flex-1 bg-[#2f74a9] text-white py-3 rounded-xl font-bold hover:bg-[#1a2b4e] transition">Posting</button>
                                <button type="button" onClick={() => setMaterialModalOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL QUIZ BUILDER */}
            {isQuizModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-[2rem] p-8 shadow-2xl animate-fade-in-up my-10 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-[#1a2b4e]">Buat Kuis / Ujian</h3>
                            <button onClick={() => setQuizModalOpen(false)}><LuX className="text-2xl text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleQuizSubmit} className="space-y-8">
                            {/* Info Dasar Kuis */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Judul Kuis</label>
                                    <input type="text" value={quizForm.data.title} onChange={e => quizForm.setData('title', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl" placeholder="Contoh: Ujian Harian Bab 1" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Durasi (Menit)</label>
                                    <input type="number" value={quizForm.data.duration_minutes} onChange={e => quizForm.setData('duration_minutes', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                                </div>
                            </div>

                            {/* List Soal */}
                            <div className="space-y-6">
                                {quizForm.data.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="p-6 border-2 border-slate-100 rounded-2xl relative hover:border-[#2f74a9]/30 transition">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="bg-[#2f74a9] text-white px-3 py-1 rounded-lg text-xs font-bold">Soal #{qIndex + 1}</span>
                                            {quizForm.data.questions.length > 1 && (
                                                <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 text-sm font-bold hover:underline">Hapus Soal</button>
                                            )}
                                        </div>

                                        {/* Pertanyaan */}
                                        <textarea 
                                            value={q.text} 
                                            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl mb-4 focus:ring-2 focus:ring-[#2f74a9]" 
                                            placeholder="Tulis pertanyaan di sini..." 
                                            rows="2"
                                            required
                                        />

                                        {/* Opsi Jawaban */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((opt, oIndex) => (
                                                <div key={oIndex} className={`flex items-center gap-2 p-2 rounded-xl border ${q.correct_option_index === oIndex ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setCorrectOption(qIndex, oIndex)}
                                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${q.correct_option_index === oIndex ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-300'}`}
                                                        title="Tandai sebagai kunci jawaban"
                                                    >
                                                        <LuCheckCircle className="text-sm" />
                                                    </button>
                                                    <input 
                                                        type="text" 
                                                        value={opt} 
                                                        onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                                        className="flex-1 bg-transparent border-none text-sm focus:ring-0"
                                                        placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tombol Tambah Soal */}
                            <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl font-bold hover:border-[#2f74a9] hover:text-[#2f74a9] transition flex items-center justify-center gap-2">
                                <LuPlusCircle /> Tambah Soal Lain
                            </button>

                            {/* Footer Action */}
                            <div className="sticky bottom-0 bg-white pt-4 border-t border-slate-100 flex gap-3">
                                <button type="submit" disabled={quizForm.processing} className="flex-1 bg-[#2f74a9] text-white py-4 rounded-xl font-bold hover:bg-[#1a2b4e] transition shadow-lg shadow-blue-200">
                                    {quizForm.processing ? 'Menyimpan Kuis...' : 'Terbitkan Kuis'}
                                </button>
                                <button type="button" onClick={() => setQuizModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}