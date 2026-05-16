import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAppContext } from '../../lib/AppContext';
import { Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../shared/Button';

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
    email?: string;
}

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
                .select('id, username, email')
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

            // Map questions to contexts (Only Pretest and Posttest)
            const qMap: Record<string, string[]> = {
                'pretest': (questionsData || []).filter(q => q.category === 'pretest').map(q => q.id),
                'posttest': (questionsData || []).filter(q => q.category === 'posttest').map(q => q.id)
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

    const renderCircles = (qIds: string[], studentId: string) => {
        const circles = qIds.map((qId) => {
            const key = `${studentId}_${qId}`;
            const ans = latestAnswers.get(key);
            if (!ans) return 'empty';
            return ans.is_correct ? 'correct' : 'incorrect';
        });

        return (
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
        );
    };

    const getScore = (qIds: string[], studentId: string) => {
        if (qIds.length === 0) return "-";
        let correct = 0;
        qIds.forEach(qId => {
            const key = `${studentId}_${qId}`;
            const ans = latestAnswers.get(key);
            if (ans && ans.is_correct) correct++;
        });
        const percentage = Math.round((correct / qIds.length) * 100);
        return `${percentage}%`;
    };

    const downloadExcel = () => {
        if (students.length === 0) return;

        const pretestIds = contextQuestions['pretest'] || [];
        const posttestIds = contextQuestions['posttest'] || [];

        const reportData = students.map((student, idx) => {
            const row: any = {
                "No": idx + 1,
                "Username": student.username,
                "Email": student.email || '-',
                "Nilai Pre-test": getScore(pretestIds, student.id),
                "Nilai Post-test": getScore(posttestIds, student.id),
            };

            // Tambahkan status per butir soal Pre-test
            pretestIds.forEach((qId, i) => {
                const key = `${student.id}_${qId}`;
                const ans = latestAnswers.get(key);
                row[`Pre-test Soal ${i + 1}`] = ans ? (ans.is_correct ? 'Benar' : 'Salah') : 'Belum';
            });

            // Tambahkan status per butir soal Post-test
            posttestIds.forEach((qId, i) => {
                const key = `${student.id}_${qId}`;
                const ans = latestAnswers.get(key);
                row[`Post-test Soal ${i + 1}`] = ans ? (ans.is_correct ? 'Benar' : 'Salah') : 'Belum';
            });

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ringkasan Progres");

        // Auto-size columns
        const wscols = [
            { wch: 5 },  // No
            { wch: 20 }, // Username
            { wch: 25 }, // Email
            { wch: 15 }, // Nilai Pre
            { wch: 15 }, // Nilai Post
        ];
        
        // Add column widths for questions
        pretestIds.forEach(() => wscols.push({ wch: 15 }));
        posttestIds.forEach(() => wscols.push({ wch: 15 }));
        
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, `Laporan_Ringkasan_Siswa_${new Date().toISOString().slice(0, 10)}.xlsx`);
        showToast("Laporan Excel berhasil diunduh", "success");
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <Button 
                        variant="primary" 
                        onClick={downloadExcel}
                        className="flex items-center gap-2"
                    >
                        <FileSpreadsheet size={20} />
                        Download Laporan Ringkasan (Excel)
                    </Button>

                    <div className="flex items-center gap-4 text-sm font-bold bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500"></div> Benar</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500"></div> Salah</div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-200"></div> Kosong</div>
                    </div>
                </div>

                <div className="overflow-x-auto pb-4">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider text-center w-16">Nomor</th>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider w-40 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Username</th>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider w-48">Email siswa</th>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider text-center border-l">Pre-test</th>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider text-center w-32">Nilai</th>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider text-center border-l">Post-test</th>
                                <th className="p-4 border-b border-slate-200 text-slate-500 font-bold uppercase text-sm tracking-wider text-center w-32">Nilai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => {
                                const pretestIds = contextQuestions['pretest'] || [];
                                const posttestIds = contextQuestions['posttest'] || [];
                                const bgRowColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

                                return (
                                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                        <td className="p-4 border-b border-slate-100 font-bold text-slate-500 text-center">
                                            {idx + 1}
                                        </td>
                                        <td className="p-4 border-b border-slate-100 font-bold text-slate-700 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" style={{ backgroundColor: bgRowColor }}>
                                            {student.username || '-'}
                                        </td>
                                        <td className="p-4 border-b border-slate-100 font-bold text-slate-700">
                                            {student.email || '-'}
                                        </td>
                                        
                                        <td className="p-4 border-b border-slate-100 border-l-2 border-slate-100 text-center">
                                            {renderCircles(pretestIds, student.id)}
                                        </td>
                                        <td className="p-4 border-b border-slate-100 font-bold text-slate-700 text-center">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm">{getScore(pretestIds, student.id)}</span>
                                        </td>

                                        <td className="p-4 border-b border-slate-100 border-l-2 border-slate-100 text-center">
                                            {renderCircles(posttestIds, student.id)}
                                        </td>
                                        <td className="p-4 border-b border-slate-100 font-bold text-slate-700 text-center">
                                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm">{getScore(posttestIds, student.id)}</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

