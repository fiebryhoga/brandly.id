import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomTopicSelect from '@/Components/CustomTopicSelect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// HEROICONS
import { 
    HiArrowLeft, HiPlus, HiTrash, HiCheckCircle, HiListBullet, HiCheck, 
    HiArrowsRightLeft, HiPhoto // Icon baru
} from "react-icons/hi2";

export default function CreateQuiz({ classroom, topics }) {
    const { data, setData, post, processing, errors } = useForm({
        class_topic_id: '',
        title: '',
        description: '',
        duration_minutes: 60,
        questions: [
            { 
                id: Date.now(), 
                type: 'multiple_choice', 
                text: '', 
                points: 10,
                // Data untuk Matching (Drag & Drop)
                pairs: [
                    { id: 1, left_text: '', right_text: '', left_image_file: null, right_image_file: null }
                ],
                // Data Lama
                options: ['', '', '', ''], 
                correct_index: 0,
                correct_answer: 'Benar',
                answer_key: ''
            }
        ]
    });

    // --- MANAJEMEN SOAL ---
    const addQuestion = () => {
        setData('questions', [
            ...data.questions,
            { 
                id: Date.now(), 
                type: 'multiple_choice', 
                text: '', 
                points: 10,
                pairs: [{ id: Date.now(), left_text: '', right_text: '', left_image_file: null, right_image_file: null }],
                options: ['', '', '', ''], 
                correct_index: 0,
                correct_answer: 'Benar',
                answer_key: ''
            }
        ]);
    };

    const updateQuestionField = (index, field, value) => {
        const newQ = [...data.questions];
        newQ[index][field] = value;
        setData('questions', newQ);
    };

    // --- MANAJEMEN DRAG & DROP PAIRS ---
    const addPair = (qIndex) => {
        const newQ = [...data.questions];
        if (newQ[qIndex].pairs.length >= 5) return alert("Maksimal 5 pasang item.");
        
        newQ[qIndex].pairs.push({ 
            id: Date.now(), 
            left_text: '', right_text: '', 
            left_image_file: null, right_image_file: null 
        });
        setData('questions', newQ);
    };

    const removePair = (qIndex, pIndex) => {
        const newQ = [...data.questions];
        if (newQ[qIndex].pairs.length === 1) return alert("Minimal 1 pasang.");
        newQ[qIndex].pairs.splice(pIndex, 1);
        setData('questions', newQ);
    };

    const updatePairData = (qIndex, pIndex, field, value) => {
        const newQ = [...data.questions];
        newQ[qIndex].pairs[pIndex][field] = value;
        setData('questions', newQ);
    };

    // --- LOGIKA LAINNYA (Sama) ---
    const removeQuestion = (index) => { /* ...Sama... */ 
         if(data.questions.length === 1) return alert("Minimal harus ada 1 soal.");
        const newQ = [...data.questions];
        newQ.splice(index, 1);
        setData('questions', newQ);
    };
    
    const updateOptionText = (qIndex, oIndex, value) => { /* ...Sama... */ 
        const newQ = [...data.questions];
        newQ[qIndex].options[oIndex] = value;
        setData('questions', newQ);
    };

    const totalPoints = data.questions.reduce((sum, q) => sum + parseInt(q.points || 0), 0);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.kelas.quiz.store', classroom.id));
    };

    return (
        <AdminLayout>
            <Head title="Buat Kuis Baru" />
            
            <div className="flex items-center gap-4 mb-8">
                <Link href={route('admin.kelas.show', classroom.id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition">
                    <HiArrowLeft className="text-xl" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#1a2b4e]">Buat Kuis Baru</h1>
                    <p className="text-slate-500 text-sm">Kelas: {classroom.name}</p>
                </div>
            </div>

            <form onSubmit={submit} className="pb-20">
                {/* 1. PENGATURAN UMUM (SAMA) */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                    <h3 className="font-bold text-lg text-[#1a2b4e] mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <HiListBullet /> Pengaturan Kuis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">Judul Kuis</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#2f74a9]" placeholder="Contoh: Ujian Harian BAB 1" required />
                        </div>
                        <div>
                             <CustomTopicSelect topics={topics} classroomId={classroom.id} selectedId={data.class_topic_id} onChange={(val) => setData('class_topic_id', val)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Durasi (Menit)</label>
                            <input type="number" value={data.duration_minutes} onChange={e => setData('duration_minutes', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold mb-2">Deskripsi / Instruksi</label>
                            <div className="bg-white rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-[#2f74a9] transition">
                                <ReactQuill theme="snow" value={data.description} onChange={(val) => setData('description', val)} className="h-40 mb-12" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. EDITOR SOAL */}
                <div className="space-y-6">
                    {data.questions.map((q, qIndex) => (
                        <div key={q.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group">
                            
                            {/* HEADER SOAL (SAMA) */}
                            <div className="flex justify-between items-start mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#1a2b4e] text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold shadow-sm">{qIndex + 1}</span>
                                    <select 
                                        value={q.type} 
                                        onChange={(e) => updateQuestionField(qIndex, 'type', e.target.value)}
                                        className="text-sm font-bold border-none bg-white rounded-lg py-1 pl-2 pr-8 shadow-sm focus:ring-0 cursor-pointer uppercase text-[#2f74a9]"
                                    >
                                        <option value="multiple_choice">Pilihan Ganda</option>
                                        <option value="true_false">Benar / Salah</option>
                                        <option value="short_answer">Isian Singkat</option>
                                        <option value="matching">Drag & Match (Menjodohkan)</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg border border-slate-200">
                                        <span className="text-xs font-bold text-slate-400 uppercase">Poin</span>
                                        <input type="number" value={q.points} onChange={(e) => updateQuestionField(qIndex, 'points', e.target.value)} className="w-12 text-center p-0 border-none focus:ring-0 text-sm font-bold text-[#2f74a9]"/>
                                    </div>
                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="text-slate-300 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"><HiTrash className="text-lg" /></button>
                                </div>
                            </div>

                            {/* TEXT SOAL */}
                            <div className="mb-6">
                                <textarea value={q.text} onChange={(e) => updateQuestionField(qIndex, 'text', e.target.value)} className="w-full p-4 text-lg font-medium border-none bg-transparent placeholder-slate-300 focus:ring-0 resize-none" placeholder="Tulis pertanyaan atau instruksi soal..." rows="2" required />
                            </div>

                            {/* === AREA TIPE SOAL === */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                                
                                {/* TIPE: DRAG & MATCH (BARU) */}
                                {q.type === 'matching' && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase">Pasangan (Item Kiri - Item Kanan)</p>
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold">Input Pasangan yang BENAR (Sejajar)</span>
                                        </div>

                                        {q.pairs.map((pair, pIndex) => (
                                            <div key={pair.id} className="grid grid-cols-12 gap-4 items-start bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                                                
                                                {/* ITEM KIRI */}
                                                <div className="col-span-5 space-y-2">
                                                    <input 
                                                        type="text" 
                                                        value={pair.left_text} 
                                                        onChange={(e) => updatePairData(qIndex, pIndex, 'left_text', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        placeholder={`Item Kiri #${pIndex + 1}`}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <label className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-500 bg-slate-50 px-2 py-1 rounded border">
                                                            <HiPhoto /> {pair.left_image_file ? 'Ganti Gbr' : 'Upload Gbr'}
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => updatePairData(qIndex, pIndex, 'left_image_file', e.target.files[0])} />
                                                        </label>
                                                        {pair.left_image_file && <span className="text-[10px] text-green-500 truncate max-w-[100px]">{pair.left_image_file.name}</span>}
                                                    </div>
                                                </div>

                                                {/* ICON PANAH */}
                                                <div className="col-span-1 flex justify-center pt-3 text-slate-300">
                                                    <HiArrowsRightLeft />
                                                </div>

                                                {/* ITEM KANAN */}
                                                <div className="col-span-5 space-y-2">
                                                    <input 
                                                        type="text" 
                                                        value={pair.right_text} 
                                                        onChange={(e) => updatePairData(qIndex, pIndex, 'right_text', e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                        placeholder={`Target Kanan #${pIndex + 1}`}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <label className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-500 bg-slate-50 px-2 py-1 rounded border">
                                                            <HiPhoto /> {pair.right_image_file ? 'Ganti Gbr' : 'Upload Gbr'}
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => updatePairData(qIndex, pIndex, 'right_image_file', e.target.files[0])} />
                                                        </label>
                                                        {pair.right_image_file && <span className="text-[10px] text-green-500 truncate max-w-[100px]">{pair.right_image_file.name}</span>}
                                                    </div>
                                                </div>

                                                {/* HAPUS PAIR */}
                                                <div className="col-span-1 flex justify-end pt-2">
                                                    <button type="button" onClick={() => removePair(qIndex, pIndex)} className="text-slate-300 hover:text-red-500">
                                                        <HiTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {q.pairs.length < 5 && (
                                            <button type="button" onClick={() => addPair(qIndex)} className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-100 flex items-center justify-center gap-2">
                                                <HiPlus /> Tambah Pasangan
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* TIPE LAIN (Multiple Choice, TrueFalse, Short Answer) - TETAP ADA DI SINI */}
                                {q.type === 'multiple_choice' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition cursor-pointer ${q.correct_index === oIndex ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                <button type="button" onClick={() => updateQuestionField(qIndex, 'correct_index', oIndex)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${q.correct_index === oIndex ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-400'}`}>
                                                    <HiCheck className="text-sm font-bold" />
                                                </button>
                                                <input type="text" value={opt} onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)} className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 w-full" placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {q.type === 'true_false' && (
                                    <div className="flex gap-4">
                                        {['Benar', 'Salah'].map((val) => (
                                            <button key={val} type="button" onClick={() => updateQuestionField(qIndex, 'correct_answer', val)} className={`flex-1 py-4 rounded-xl font-bold border-2 transition flex items-center justify-center gap-2 ${q.correct_answer === val ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                                                {q.correct_answer === val && <HiCheckCircle className="text-xl" />} {val}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {q.type === 'short_answer' && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Kunci Jawaban</label>
                                        <input type="text" value={q.answer_key} onChange={(e) => updateQuestionField(qIndex, 'answer_key', e.target.value)} className="w-full px-4 py-3 border-2 border-emerald-200 bg-emerald-50 rounded-xl text-emerald-800 font-bold focus:ring-emerald-500" placeholder="Jawaban singkat..." />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FOOTER (SAMA) */}
                <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky bottom-4 z-10">
                    <button type="button" onClick={addQuestion} className="px-6 py-4 bg-white/90 backdrop-blur border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl font-bold hover:border-[#2f74a9] hover:text-[#2f74a9] transition flex items-center gap-2 shadow-sm">
                        <HiPlus className="text-xl" /> Tambah Pertanyaan
                    </button>
                    <div className="flex items-center gap-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-slate-100">
                        <div className="text-right hidden sm:block"><p className="text-xs font-bold text-slate-400 uppercase">Total Soal</p><p className="text-xl font-black text-[#1a2b4e]">{data.questions.length}</p></div>
                        <div className="text-right hidden sm:block border-l pl-6 border-slate-200"><p className="text-xs font-bold text-slate-400 uppercase">Total Poin</p><p className="text-xl font-black text-[#2f74a9]">{totalPoints}</p></div>
                        <button type="submit" disabled={processing} className="px-8 py-3 bg-[#2f74a9] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1a2b4e] transition">
                            {processing ? 'Menyimpan...' : 'Terbitkan Kuis'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}