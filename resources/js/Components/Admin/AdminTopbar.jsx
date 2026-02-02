import UserAvatar from '@/Components/UserAvatar';
import { LuSearch, LuBell, LuMenu } from "react-icons/lu";

export default function AdminTopbar({ user }) {
    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100/50">
            {/* Left: Page Title / Search */}
            <div className="flex items-center gap-6 flex-1">
                {/* Search Bar Modern */}
                <div className="relative w-full max-w-md hidden md:block">
                    <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                    <input 
                        type="text" 
                        placeholder="Cari data siswa, guru, atau materi..." 
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 focus:ring-2 focus:ring-[#2f74a9]/20 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-5">
                <button className="relative p-3 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-[#2f74a9] transition-all">
                    <LuBell className="text-xl" />
                    <span className="absolute top-2.5 right-3 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-slate-200"></div>

                {/* Profile User */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-[#1a2b4e]">{user.name}</p>
                        <p className="text-[11px] font-bold text-[#47be9e] uppercase tracking-wider">{user.role}</p>
                    </div>
                    
                    {/* IMPLEMENTASI USER AVATAR */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2f74a9] to-[#1a2b4e] p-[2px] cursor-pointer hover:shadow-lg transition-shadow group">
                        <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                            <UserAvatar user={user} className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}