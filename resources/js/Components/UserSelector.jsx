import { useState } from 'react';
import { LuSearch, LuCheck } from "react-icons/lu";

export default function UserSelector({ title, users, selectedIds, onChange, labelField = 'nip' }) {
    const [search, setSearch] = useState('');

    const toggleUser = (id) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(i => i !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        (user[labelField] && user[labelField].toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-[#1a2b4e]">{title} <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-500">{selectedIds.length} Terpilih</span></h3>
            </div>
            
            {/* Search */}
            <div className="p-4 border-b border-slate-100 bg-white">
                <div className="relative group">
                    {/* Ikon: Posisi otomatis tengah vertikal & berubah warna saat fokus */}
                    <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2f74a9] transition-colors duration-300" />
                    
                    <input 
                        type="text" 
                        placeholder="Cari nama..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#2f74a9] focus:ring-4 focus:ring-[#2f74a9]/10 transition-all duration-300"
                    />
                </div>
            </div>

            {/* List */}
            <div className="h-60 overflow-y-auto p-2 space-y-1">
                {filteredUsers.map(user => {
                    const isSelected = selectedIds.includes(user.id);
                    return (
                        <div 
                            key={user.id} 
                            onClick={() => toggleUser(user.id)}
                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                                isSelected ? 'bg-[#2f74a9]/10 border border-[#2f74a9]' : 'hover:bg-white border border-transparent'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#2f74a9] border-[#2f74a9]' : 'border-slate-300 bg-white'}`}>
                                {isSelected && <LuCheck className="text-white text-xs" />}
                            </div>
                            
                            <img src={user.avatar ? `/storage/${user.avatar}` : `https://ui-avatars.com/api/?name=${user.name}`} className="w-8 h-8 rounded-full" />
                            
                            <div className="flex-1">
                                <p className={`text-sm font-bold ${isSelected ? 'text-[#2f74a9]' : 'text-slate-700'}`}>{user.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase">{user[labelField] || '-'}</p>
                            </div>
                        </div>
                    );
                })}
                {filteredUsers.length === 0 && <p className="text-center text-xs text-slate-400 py-4">Tidak ditemukan.</p>}
            </div>
        </div>
    );
}