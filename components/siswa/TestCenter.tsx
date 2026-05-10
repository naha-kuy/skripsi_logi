import React, { useState } from 'react';
import { useAppContext } from '../../lib/AppContext';
import { PretestRunner } from './PretestRunner';
import { PosttestFlow } from './PosttestFlow';
import { BookOpen, Trophy, ArrowLeft } from 'lucide-react';

interface TestCenterProps {
    onNavigate?: (tab: string) => void;
}

export const TestCenter: React.FC<TestCenterProps> = ({ onNavigate }) => {
    const { userData, activeTeacherId } = useAppContext();
    const [activeTest, setActiveTest] = useState<'none' | 'pretest' | 'posttest'>('none');

    const handleBackToRoadmap = () => {
        if (onNavigate) onNavigate('learn');
        else setActiveTest('none');
    };

    if (activeTest === 'pretest' && activeTeacherId) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col p-4">
               <div className="flex-1 max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                 <PretestRunner teacherId={activeTeacherId} studentId={userData?.id || ''} onComplete={handleBackToRoadmap} onCancel={() => setActiveTest('none')} />
               </div>
            </div>
        );
    }

    if (activeTest === 'posttest') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col p-4">
               <div className="flex-1 max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
                 <PosttestFlow onComplete={handleBackToRoadmap} onClose={() => setActiveTest('none')} />
               </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Pusat Evaluasi Ujian</h1>
                <p className="text-slate-500 font-medium">Ikuti Pre-Test sebelum memulai pembelajaran, dan Post-Test untuk mengukur pemahaman akhirmu.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-macaw-light transition-colors">
                    <div className="w-20 h-20 bg-macaw-light/20 text-macaw rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Pre-Test Awal</h2>
                    <p className="text-slate-500 mb-8 flex-1 font-medium">
                        Kerjakan kuis ini untuk mengetahui sejauh mana kamu memahami materi sebelum belajar di kelas.
                    </p>
                    <button 
                       onClick={() => setActiveTest('pretest')}
                       className="w-full bg-macaw hover:bg-macaw-dark text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md active:-translate-y-0.5"
                    >
                        Mulai Pre-Test
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-feather-light transition-colors">
                    <div className="w-20 h-20 bg-feather-light/20 text-feather-dark rounded-full flex items-center justify-center mb-6">
                        <Trophy size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Post-Test Akhir</h2>
                    <p className="text-slate-500 mb-8 flex-1 font-medium">
                        Uji kemampuanmu setelah menyelesaikan seluruh materi. Dapatkan nilai terbaikmu!
                    </p>
                    <button 
                       onClick={() => setActiveTest('posttest')}
                       className="w-full bg-feather hover:bg-feather-dark text-white font-bold py-4 rounded-2xl transition-all shadow-sm hover:shadow-md active:-translate-y-0.5"
                    >
                        Mulai Post-Test
                    </button>
                </div>
            </div>
        </div>
    );
};