import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { LuLayoutDashboard, LuUsers, LuSettings } from "react-icons/lu";

// Import Components
import ClassroomHeader from './Partials/ClassroomHeader';
import StreamTab from './Partials/StreamTab';
import PeopleTab from './Partials/PeopleTab';
import SettingsTab from './Partials/SettingsTab';

// Import Modals
import TopicModal from './Partials/Modals/TopicModal';
import MaterialModal from './Partials/Modals/MaterialModal';
import QuizModal from './Partials/Modals/QuizModal';

export default function Show({ classroom, availableTeachers, availableStudents, topicsDropdown }) {
    const [activeTab, setActiveTab] = useState('stream');
    
    // State Modal
    const [modals, setModals] = useState({ topic: false, material: false, quiz: false });
    const toggleModal = (key, val) => setModals(prev => ({ ...prev, [key]: val }));

    return (
        <AdminLayout>
            <Head title={classroom.name} />

            {/* 1. Header */}
            <ClassroomHeader classroom={classroom} />

            {/* 2. Navigasi Tab */}
            <div className="flex items-center gap-6 border-b border-slate-200 mb-8 px-2">
                {[
                    { id: 'stream', label: 'Materi & Aktivitas', icon: LuLayoutDashboard },
                    { id: 'people', label: 'Anggota Kelas', icon: LuUsers },
                    { id: 'settings', label: 'Konfigurasi', icon: LuSettings },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all border-b-2 ${
                            activeTab === tab.id ? 'text-[#2f74a9] border-[#2f74a9]' : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                    >
                        <tab.icon /> {tab.label}
                    </button>
                ))}
            </div>

            {/* 3. Content Area */}
            <div className="animate-fade-in-up">
                {activeTab === 'stream' && (
                    <StreamTab 
                        classroom={classroom} 
                        onOpenTopic={() => toggleModal('topic', true)}
                        onOpenMaterial={() => toggleModal('material', true)}
                        onOpenQuiz={() => toggleModal('quiz', true)}
                    />
                )}
                
                {activeTab === 'people' && (
                    <PeopleTab 
                        classroom={classroom} 
                        availableTeachers={availableTeachers} 
                        availableStudents={availableStudents} 
                    />
                )}

                {activeTab === 'settings' && (
                    <SettingsTab classroom={classroom} />
                )}
            </div>

            {/* 4. Modals (Global di Page ini) */}
            <TopicModal 
                isOpen={modals.topic} 
                onClose={() => toggleModal('topic', false)} 
                classroomId={classroom.id} 
            />
            
            <MaterialModal 
                isOpen={modals.material} 
                onClose={() => toggleModal('material', false)} 
                classroomId={classroom.id} 
                topics={topicsDropdown} 
            />

            <QuizModal 
                isOpen={modals.quiz} 
                onClose={() => toggleModal('quiz', false)} 
                classroomId={classroom.id} 
                topics={topicsDropdown} 
            />

        </AdminLayout>
    );
}