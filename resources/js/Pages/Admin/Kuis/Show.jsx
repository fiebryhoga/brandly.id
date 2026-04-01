{/* Topics Loop */}
{classroom.topics.map(topic => (
    <div key={topic.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-visible relative">
        <div className="bg-slate-50/50 p-6 border-b border-slate-50 flex justify-between items-center relative">
            <h3 className="text-xl font-black text-[#1a2b4e]">{topic.title}</h3>
            
            <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                    {topic.materials.length} Materi
                </span>

                {/* MENU TITIK TIGA */}
                <div className="relative">
                    <button 
                        onClick={() => setActiveDropdownId(activeDropdownId === topic.id ? null : topic.id)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <MdMoreVert />
                    </button>

                    {/* Dropdown Content */}
                    {activeDropdownId === topic.id && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                            
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-fade-in-up">
                                <button 
                                    onClick={() => handleEditTopic(topic)}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <CgRename className="text-blue-500"/> Rename Topik
                                </button>
                                <button 
                                    onClick={() => handleDeleteTopic(topic.id)}
                                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LuTrash /> Hapus Topik
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        <div className="p-6">
            {topic.materials.length === 0 ? <p className="text-slate-400 italic text-center text-sm">Belum ada materi di topik ini</p> : 
                // SORTING DITERAPKAN DISINI JUGA
                topic.materials
                    .sort(sortOldestFirst)
                    .map(item => <MaterialCard key={item.id} item={item} />)
            }
        </div>
    </div>
))}