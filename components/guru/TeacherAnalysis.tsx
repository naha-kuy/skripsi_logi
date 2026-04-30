import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAppContext } from '../../lib/AppContext';
import { Button } from '../shared/Button';
import { Download, Loader2, FileSpreadsheet, Activity, Search, LayoutGrid, Table } from 'lucide-react';
import * as XLSX from 'xlsx';
import { StudentProgressSummary } from './StudentProgressSummary';

export const TeacherAnalysis: React.FC = () => {
    const { userData } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<{ totalAnswers: number, studentsCount: number }>({ totalAnswers: 0, studentsCount: 0 });
    const [answersData, setAnswersData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');

    useEffect(() => {
        if(userData?.id) {
            fetchStats();
        }
    }, [userData?.id]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data, count: answersCount } = await supabase.from('student_answers')
                .select(`
                    id, context, question_text, student_answer, is_correct, created_at,
                    student_id, users_data!student_answers_student_id_fkey(username)
                `, { count: 'exact' })
                .eq('teacher_id', userData!.id)
                .order('created_at', { ascending: false })
                .limit(1000); // Limit data to prevent browser memory crash
                
            const { data: students } = await supabase.from('student_teacher_progress')
                .select('student_id')
                .eq('teacher_id', userData!.id);
                
            setStats({
                totalAnswers: answersCount || 0,
                studentsCount: students?.length || 0
            });

            if (data) setAnswersData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadExcel = () => {
        if (!answersData || answersData.length === 0) {
            alert("Tidak ada data jawaban siswa saat ini.");
            return;
        }

        // Format data for Excel
        const formattedData = answersData.map((item: any) => ({
            "Tanggal": new Date(item.created_at).toLocaleString('id-ID'),
            "Nama Siswa": item.users_data?.username || 'Unknown',
            "Konteks (Bab/Test)": item.context,
            "Pertanyaan": item.question_text,
            "Jawaban Siswa": item.student_answer,
            "Status": item.is_correct ? "Benar" : "Salah"
        }));

        // Create Worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Analisis Jawaban");

        // Auto-size columns slightly
        const wscols = [
            {wch: 20}, // Tanggal
            {wch: 20}, // Nama Siswa
            {wch: 15}, // Konteks
            {wch: 50}, // Pertanyaan
            {wch: 30}, // Jawaban Siswa
            {wch: 10}  // Status
        ];
        worksheet['!cols'] = wscols;

        // Generate Excel file
        XLSX.writeFile(workbook, `Analisis_Siswa_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const filteredData = answersData.filter(item => {
        const term = searchTerm.toLowerCase();
        return (
            (item.users_data?.username || '').toLowerCase().includes(term) ||
            (item.context || '').toLowerCase().includes(term) ||
            (item.question_text || '').toLowerCase().includes(term) ||
            (item.student_answer || '').toLowerCase().includes(term)
        );
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <Activity className="text-macaw" />
                        Analisis Jawaban Siswa
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Pantau ringkasan progres kelas dan analisis data riwayat jawaban mentah.</p>
                </div>
                
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('summary')} 
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'summary' ? 'bg-white text-macaw shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutGrid size={18} /> Ringkasan Progres
                    </button>
                    <button 
                        onClick={() => setActiveTab('detail')} 
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'detail' ? 'bg-white text-macaw shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Table size={18} /> Data Tabel Detail
                    </button>
                </div>
            </div>

            {activeTab === 'summary' ? (
                <div className="animate-fade-in">
                    <StudentProgressSummary />
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
                        <div className="grid grid-cols-2 gap-6 pl-4">
                            <div>
                                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Rekaman</h3>
                                <div className="text-2xl font-black text-slate-800">{stats.totalAnswers}</div>
                            </div>
                            <div>
                                <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Siswa Terdaftar</h3>
                                <div className="text-2xl font-black text-slate-800">{stats.studentsCount}</div>
                            </div>
                        </div>
                        <Button 
                            variant="primary" 
                            onClick={downloadExcel} 
                            disabled={loading || stats.totalAnswers === 0}
                            className="flex items-center gap-2 whitespace-nowrap"
                        >
                            <FileSpreadsheet size={20} />
                            Unduh Data (Excel)
                        </Button>
                    </div>

            {/* Tabel Data Langsung */}
            <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-extrabold text-slate-700">Tabel Jawaban Real-Time</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari siswa, soal, konteks..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl outline-none focus:border-macaw text-sm font-bold text-slate-700"
                        />
                    </div>
                </div>
                
                <div className="overflow-auto max-h-[500px]">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 sticky top-0 z-10">
                            <tr className="text-slate-500 font-extrabold text-xs uppercase tracking-wider">
                                <th className="p-4">Siswa</th>
                                <th className="p-4">Konteks</th>
                                <th className="p-4 min-w-[300px]">Pertanyaan</th>
                                <th className="p-4 min-w-[150px]">Jawaban Siswa</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8 text-slate-400 font-bold"><Loader2 className="animate-spin mx-auto mb-2" /> Memuat data...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={6} className="text-center p-8 text-slate-400 font-bold">Belum ada jawaban dari siswa.</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors font-medium text-sm">
                                        <td className="p-4 font-bold text-slate-700">{item.users_data?.username || 'Unknown'}</td>
                                        <td className="p-4 text-macaw font-bold bg-macaw-light/10 rounded-xl whitespace-nowrap text-center m-2 inline-block px-2 py-1 mt-3">{item.context}</td>
                                        <td className="p-4 text-slate-600 truncate max-w-xs" title={item.question_text}>{item.question_text}</td>
                                        <td className="p-4 font-bold text-slate-800">{item.student_answer}</td>
                                        <td className="p-4 text-center">
                                            {item.is_correct ? 
                                                <span className="bg-feather/20 text-feather-dark px-2 py-1 rounded-md font-bold text-xs uppercase">Benar</span> : 
                                                <span className="bg-cardinal/20 text-cardinal-dark px-2 py-1 rounded-md font-bold text-xs uppercase">Salah</span>
                                            }
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs font-bold whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 mt-4">
                <h3 className="font-bold text-blue-800 mb-2">Informasi</h3>
                <ul className="list-disc pl-5 text-blue-700 space-y-1 text-sm font-medium">
                    <li>Data mencakup seluruh rekaman jawaban siswa dari Pre-test, Latihan Bab, dan Post-test.</li>
                    <li>Siswa tidak diwajibkan menjawab benar pada Pre-test dan Post-test.</li>
                    <li>File Excel bisa diolah lebih lanjut di Microsoft Excel atau SPSS.</li>
                </ul>
            </div>
          </div>
        )}
        </div>
    );
};
