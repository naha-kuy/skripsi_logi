import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAppContext } from '../../lib/AppContext';
import { Loader2, AlertCircle } from 'lucide-react';

interface StudentAnswer {
    student_id: string;
    context: string;
    question_id: string;
    is_correct: boolean;
    created_at: string;
}

interface StudentData {
    id: string;
    username: string;
}

const CONTEXTS = [
    { id: 'pretest', label: 'Pre-test' },
    { id: 'u1l1', label: 'Materi U1 L1' },
    { id: 'u1l2', label: 'Materi U1 L2' },
    { id: 'u2l1', label: 'Materi U2 L1' },
    { id: 'u2l2', label: 'Materi U2 L2' },
    { id: 'posttest', label: 'Post-test' }
];

export const StudentProgressSummary: React.FC = () => {
    const { userData, showToast } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<StudentData[]>([]);
    const [answers, setAnswers] = useState<StudentAnswer[]>([]);
    const [contextQuestions, setContextQuestions] = useState<Record<string, string[]>>({});
    const [latestAnswers, setLatestAnswers] = useState<Map<string, StudentAnswer>>(new Map());

    useEffect(() => {
        if (userData?.id) {
            fetchData();
        }
    }, [userData?.id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Get students for this teacher
            const { data: progressData, error: progressError } = await supabase
                .from('student_teacher_progress')
                .select('student_id')
                .eq('teacher_id', userData!.id);

            if (progressError) throw progressError;

            const studentIds = progressData?.map(p => p.student_id) || [];

            if (studentIds.length === 0) {
                setStudents([]);
                setLoading(false);
                return;
            }

            // 2. Get student details
            const { data: studentsData, error: studentsError } = await supabase
                .from('users_data')
                .select('id, username')
                .in('id', studentIds);

            if (studentsError) throw studentsError;
            setStudents(studentsData || []);

            // 3. Get questions from the bank
            const { data: questionsData, error: questionsError } = await supabase
                .from('questions')
                .select('id, category, lesson_id')
                .eq('teacher_id', userData!.id)
                .order('created_at', { ascending: true }); // Order to keep question sequence consistent

            if (questionsError) throw questionsError;

            // Map questions to contexts
            const qMap: Record<string, string[]> = {
                'pretest': (questionsData || []).filter(q => q.category === 'pretest').map(q => q.id),
                'posttest': (questionsData || []).filter(q => q.category === 'posttest').map(q => q.id),
                'u1l1': (questionsData || []).filter(q => q.category === 'lesson' && ['u1l1', 'u1-l1'].includes(q.lesson_id)).map(q => q.id),
                'u1l2': (questionsData || []).filter(q => q.category === 'lesson' && ['u1l2', 'u1-l2'].includes(q.lesson_id)).map(q => q.id),
                'u2l1': (questionsData || []).filter(q => q.category === 'lesson' && ['u2l1', 'u2-l1'].includes(q.lesson_id)).map(q => q.id),
                'u2l2': (questionsData || []).filter(q => q.category === 'lesson' && ['u2l2', 'u2-l2', 'u2-l2-prisma'].includes(q.lesson_id)).map(q => q.id)
            };
            setContextQuestions(qMap);

            // 4. Get answers
            const { data: answersData, error: answersError } = await supabase
                .from('student_answers')
                .select('student_id, context, question_id, is_correct, created_at')
                .eq('teacher_id', userData!.id)
                .order('created_at', { ascending: true });

            if (answersError) throw answersError;
            
            // 5. Get the most recent answer for each student + question
            const latest = new Map<string, StudentAnswer>();
            (answersData || []).forEach(ans => {
                const key = `${ans.student_id}_${ans.question_id}`;
                // Because they are sorted by created_at ascending, later rows overwrite earlier ones
                latest.set(key, ans);
            });
            setLatestAnswers(latest);

        } catch (error) {
            console.error("Error fetching progress summary:", error);
            showToast("Gagal memuat ringkasan hasil", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="animate-spin text-macaw mb-4" size={48} />
                <p className="text-slate-500 font-bold">Memuat data ringkasan pengerjaan...</p>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-slate-100 mt-6 shadow-sm">
                <AlertCircle size={48} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">Belum Ada Siswa</h3>
                <p className="text-slate-400 text-center max-w-md">Ringkasan hasil pengerjaan soal akan muncul di sini setelah siswa mulai mengerjakan.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-slate-100">
                <div className="flex justify-end mb-6">
                    <div className="flex items-center gap-4 text-sm font-bold bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> Benar</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div> Salah</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-200"></div> Kosong</div>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr>
                                <th className="p-4 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-sm tracking-wider w-48 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Siswa</th>
                                {CONTEXTS.map(ctx => (
                                    <th key={ctx.id} className="p-4 border-b-2 border-slate-200 text-slate-500 font-extrabold uppercase text-sm tracking-wider text-center border-l-2">
                                        {ctx.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                    <td className="p-4 border-b border-slate-100 font-bold text-slate-700 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                        {student.username}
                                    </td>
                                    {CONTEXTS.map(ctx => {
                                        const qIds = contextQuestions[ctx.id] || [];
                                        
                                        const circles = qIds.map((qId) => {
                                            const key = `${student.id}_${qId}`;
                                            const ans = latestAnswers.get(key);
                                            if (!ans) return 'empty';
                                            return ans.is_correct ? 'correct' : 'incorrect';
                                        });

                                        return (
                                            <td key={`${student.id}-${ctx.id}`} className="p-4 border-b border-slate-100 border-l-2 border-slate-100 text-center">
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-[200px] mx-auto">
                                                    {circles.map((status, i) => (
                                                        <div 
                                                            key={i} 
                                                            className={`w-4 h-4 md:w-5 md:h-5 rounded-full shrink-0 transition-all ${
                                                                status === 'correct' ? 'bg-green-500 shadow-[0_2px_0_0_#15803d]' : 
                                                                status === 'incorrect' ? 'bg-red-500 shadow-[0_2px_0_0_#b91c1c]' : 
                                                                'bg-slate-200 shadow-[0_2px_0_0_#cbd5e1]'
                                                            }`}
                                                            title={status === 'empty' ? `Soal ${i+1} (Belum)` : status === 'correct' ? `Soal ${i+1} (Benar)` : `Soal ${i+1} (Salah)`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
