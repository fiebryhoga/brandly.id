import UserAvatar from '@/Components/UserAvatar';

export default function ClassroomHeader({ classroom }) {
    return (
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
                <div className="flex -space-x-3">
                    {classroom.teachers.map(t => (
                        <UserAvatar key={t.id} user={t} className="w-12 h-12 border-2 border-[#1a2b4e]" />
                    ))}
                </div>
            </div>
            <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-[#2f74a9] rounded-full blur-[80px] opacity-50"></div>
        </div>
    );
}