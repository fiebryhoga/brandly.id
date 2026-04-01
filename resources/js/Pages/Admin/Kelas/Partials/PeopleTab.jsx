import { useForm } from '@inertiajs/react';
import UserSelector from '@/Components/UserSelector';

export default function PeopleTab({ classroom, availableTeachers, availableStudents }) {
    const { data, setData, put, processing } = useForm({
        type: 'update_members',
        teachers: classroom.teachers.map(t => t.id),
        students: classroom.students.map(s => s.id),
    });

    const submit = () => {
        put(route('admin.kelas.update', classroom.id));
    };

    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-[#1a2b4e]">Manajemen Anggota</h2>
                <button onClick={submit} disabled={processing} className="bg-[#47be9e] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition">
                    {processing ? 'Menyimpan...' : 'Simpan Perubahan Anggota'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <UserSelector title="Guru Pengajar" users={availableTeachers} selectedIds={data.teachers} onChange={ids => setData('teachers', ids)} labelField="nip" />
                <UserSelector title="Siswa" users={availableStudents} selectedIds={data.students} onChange={ids => setData('students', ids)} labelField="nis" />
            </div>
        </div>
    );
}