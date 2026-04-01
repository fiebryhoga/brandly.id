import { useForm } from '@inertiajs/react';
import { LuX, LuPlus, LuCheck, LuTrash2 } from "react-icons/lu";

export default function QuizModal({ isOpen, onClose, classroomId, topics }) {
    const { data, setData, post, processing, reset } = useForm({
        class_topic_id: '',
        title: '',
        description: '',
        duration_minutes: 60,
        questions: [{ text: '', options: ['', '', '', ''], correct_option_index: 0 }]
    });

    // Helper Functions untuk Manipulasi State Array
    const addQuestion = () => {
        setData('questions', [...data.questions, { text: '', options: ['', '', '', ''], correct_option_index: 0 }]);
    };

    const removeQuestion = (index) => {
        setData('questions', data.questions.filter((_, i) => i !== index));
    };

    const updateQuestionText = (index, val) => {
        const newQ = [...data.questions];
        newQ[index].text = val;
        setData('questions', newQ);
    };

    const updateOptionText = (qIndex, oIndex, val) => {
        const newQ = [...data.questions];
        newQ[qIndex].options[oIndex] = val;
        setData('questions', newQ);
    };

    const setCorrectOption = (qIndex, oIndex) => {
        const newQ = [...data.questions];
        newQ[qIndex].correct_option_index = oIndex;
        setData('questions', newQ);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('kelas.quiz.store', classroomId), {
            onSuccess: () => { reset(); onClose(); }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl rounded-[2rem] p-8 shadow-2xl animate-fade-in-up my-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#1a2b4e]">Buat Kuis Baru</h3>
                    <button onClick={onClose}><LuX className="text-2xl" /></button>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* Info Dasar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-bold mb-2">Pilih BAB (Opsional)</label>
                            <select value={data.class_topic_id} onChange={e => setData('class_topic_id', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white">
                                <option value="">-- Tanpa BAB --</option>
                                {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">Judul Kuis</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Durasi (Menit)</label>
                            <input type="number" value={data.duration_minutes} onChange={e => setData('duration_minutes', e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl" />
                        </div>
                    </div>

                    {/* List Soal */}
                    <div className="space-y-6">
                        {data.questions.map((q, qIndex) => (
                            <div key={qIndex} className="p-6 border-2 border-slate-100 rounded-2xl relative hover:border-[#2f74a9]/30 transition">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="bg-[#2f74a9] text-white px-3 py-1 rounded-lg text-xs font-bold">Soal #{qIndex + 1}</span>
                                    {data.questions.length > 1 && (
                                        <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline"><LuTrash2 /> Hapus</button>
                                    )}
                                </div>

                                <textarea 
                                    value={q.text} 
                                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl mb-4 focus:ring-2 focus:ring-[#2f74a9]" 
                                    placeholder="Tulis pertanyaan..." 
                                    rows="2" required
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className={`flex items-center gap-2 p-2 rounded-xl border ${q.correct_option_index === oIndex ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
                                            <button 
                                                type="button"
                                                onClick={() => setCorrectOption(qIndex, oIndex)}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${q.correct_option_index === oIndex ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-300'}`}
                                            >
                                                <LuCheck className="text-sm" />
                                            </button>
                                            <input 
                                                type="text" 
                                                value={opt} 
                                                onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                                className="flex-1 bg-transparent border-none text-sm focus:ring-0"
                                                placeholder={`Opsi ${String.fromCharCode(65 + oIndex)}`} required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-2xl font-bold hover:border-[#2f74a9] hover:text-[#2f74a9] transition flex items-center justify-center gap-2">
                        <LuPlus /> Tambah Soal
                    </button>

                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <button type="submit" disabled={processing} className="flex-1 bg-[#2f74a9] text-white py-3 rounded-xl font-bold hover:bg-[#1a2b4e] transition">
                            {processing ? 'Menyimpan...' : 'Terbitkan Kuis'}
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}