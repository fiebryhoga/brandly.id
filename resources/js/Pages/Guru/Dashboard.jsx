export default function GuruDashboard({ auth }) {
    return (
        <div className="min-h-screen bg-white p-10 font-sans text-brandDark">
            <Head title="Guru Dashboard" />
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-black">Halo, <span className="text-brandSecondary">Bapak/Ibu Guru</span></h1>
                <p className="text-slate-500 mt-1">Siap untuk membagikan ilmu branding hari ini?</p>
                
                <div className="mt-10 p-8 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-emerald-50 text-brandSecondary rounded-2xl flex items-center justify-center mb-4 text-2xl">+</div>
                    <h3 className="font-bold">Buat Materi Baru</h3>
                    <p className="text-slate-400 text-sm max-w-xs mt-2">Tambahkan modul video atau artikel digital branding untuk siswa Anda.</p>
                </div>
            </div>
        </div>
    );
}