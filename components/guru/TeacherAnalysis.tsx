import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAppContext } from '../../lib/AppContext';
import { Button } from '../shared/Button';
import { Download, Loader2, FileSpreadsheet, Activity, Search, LayoutGrid, Table, Filter, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { StudentProgressSummary } from './StudentProgressSummary';

export const TeacherAnalysis: React.FC = () => {
    const { userData } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<{ totalAnswers: number, studentsCount: number }>({ totalAnswers: 0, studentsCount: 0 });
    const [answersData, setAnswersData] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'summary' | 'detail'>('summary');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<string>('');
    const [filterLatest, setFilterLatest] = useState<'all' | 'latest'>('all');
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);

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
                    id, context, question_id, question_text, student_answer, is_correct, created_at,
                    student_id, users_data!student_answers_student_id_fkey(username)
                `, { count: 'exact' })
                .eq('teacher_id', userData!.id)
                .order('created_at', { ascending: false })
                .limit(1000); // Limit data to prevent browser memory crash
                
            const { data: students } = await supabase.from('student_teacher_progress')
                .select('student_id')
                .eq('teacher_id', userData!.id);

            const { data: qData } = await supabase.from('questions')
                .select('id, category, question_text')
                .eq('teacher_id', userData!.id)
                .order('created_at', { ascending: true });
                
            setStats({
                totalAnswers: answersCount || 0,
                studentsCount: students?.length || 0
            });

            if (data) setAnswersData(data);
            if (qData) setQuestions(qData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const uniqueStudents = Array.from(new Set(answersData.map(item => item.users_data?.username).filter(Boolean))) as string[];
    
    const questionOptions = React.useMemo(() => {
        const options: { label: string, value: string }[] = [];
        const categorized: Record<string, any[]> = {};
        
        questions.forEach(q => {
            if (!categorized[q.category]) categorized[q.category] = [];
            categorized[q.category].push(q);
        });

        ['pretest', 'posttest'].forEach(cat => {
            if (categorized[cat]) {
                categorized[cat].forEach((q, idx) => {
                    options.push({
                        label: `${cat === 'pretest' ? 'Pre-test' : 'Post-test'} ${idx + 1}`,
                        value: q.question_text
                    });
                });
            }
        });

        // Other categories
        Object.keys(categorized).forEach(cat => {
            if (cat !== 'pretest' && cat !== 'posttest') {
                categorized[cat].forEach((q, idx) => {
                    options.push({
                        label: `Soal ${cat} ${idx + 1}`,
                        value: q.question_text
                    });
                });
            }
        });

        // Fallback for any answers whose questions are missing from the questions table
        const seenTexts = new Set(options.map(o => o.value));
        answersData.forEach(ans => {
            if (ans.question_text && !seenTexts.has(ans.question_text)) {
                options.push({
                    label: ans.question_text.length > 40 ? ans.question_text.substring(0, 40) + '...' : ans.question_text,
                    value: ans.question_text
                });
                seenTexts.add(ans.question_text);
            }
        });

        return options;
    }, [questions, answersData]);

    const getQuestionLabel = (qText: string) => {
        const opt = questionOptions.find(o => o.value === qText);
        return opt ? opt.label : qText;
    };

    const filteredData = React.useMemo(() => {
        let data = [...answersData];

        if (filterLatest === 'latest') {
            const seen = new Set();
            data = data.filter(item => {
                const key = `${item.student_id}_${item.question_id || item.question_text}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }

        return data.filter(item => {
            const term = searchTerm.toLowerCase();
            const username = item.users_data?.username || 'Unknown';
            
            const matchesSearch = (
                (username).toLowerCase().includes(term) ||
                (item.context || '').toLowerCase().includes(term) ||
                (item.question_text || '').toLowerCase().includes(term) ||
                (item.student_answer || '').toLowerCase().includes(term)
            );

            const matchesStudent = selectedStudents.length === 0 || selectedStudents.includes(username);
            const matchesQuestion = selectedQuestion === '' || item.question_text === selectedQuestion;

            return matchesSearch && matchesStudent && matchesQuestion;
        });
    }, [answersData, filterLatest, searchTerm, selectedStudents, selectedQuestion]);

    const downloadExcel = () => {
        if (!filteredData || filteredData.length === 0) {
            alert("Tidak ada data jawaban siswa saat ini.");
            return;
        }

        // Format data for Excel
        const formattedData = filteredData.map((item: any) => ({
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

        // Generate dynamic filename components
        const studentCountLabel = selectedStudents.length > 0 
            ? `${selectedStudents.length}_Siswa` 
            : `Semua_Siswa`;
            
        const questionTypeLabel = selectedQuestion === '' 
            ? "Semua_Soal" 
            : getQuestionLabel(selectedQuestion).replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
            
        const modeLabel = filterLatest === 'latest' 
            ? "Jawaban_Akhir" 
            : "Semua_Jawaban";
            
        const fileName = `Analisis_Jawaban_${studentCountLabel}_${questionTypeLabel}_${modeLabel}.xlsx`;

        // Generate Excel file
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
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
            <div className="data-table-container flex flex-col">
                <div className="p-4 border-b-2 border-slate-100 flex flex-col gap-4 bg-slate-50">
                    <div className="flex justify-between items-center w-full">
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
                    
                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mr-2">
                            <Filter size={16} /> Filter:
                        </div>
                        
                        {/* Student Filter Dropdown (Multiple Selection) */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowStudentDropdown(!showStudentDropdown)} 
                                className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white flex items-center gap-2 min-w-[160px] justify-between focus:border-macaw transition-colors"
                            >
                                <span className="truncate max-w-[120px]">
                                    {selectedStudents.length === 0 ? 'Semua Siswa' : `${selectedStudents.length} Siswa Terpilih`}
                                </span>
                                <ChevronDown size={16} className="text-slate-400" />
                            </button>
                            {showStudentDropdown && (
                                <div className="absolute z-20 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto w-64 p-2 left-0">
                                    <label className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer mb-1 border-b border-slate-100">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedStudents.length === 0} 
                                            onChange={() => setSelectedStudents([])} 
                                            className="w-4 h-4 accent-macaw rounded"
                                        />
                                        <span className="font-bold text-slate-700 text-sm">Pilih Semua</span>
                                    </label>
                                    {uniqueStudents.map(student => (
                                        <label key={student} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedStudents.includes(student)} 
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedStudents([...selectedStudents, student]);
                                                    } else {
                                                        setSelectedStudents(selectedStudents.filter(s => s !== student));
                                                    }
                                                }} 
                                                className="w-4 h-4 accent-macaw rounded"
                                            />
                                            <span className="font-bold text-slate-600 text-sm truncate">{student}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Question Filter Dropdown (Single Selection) */}
                        <select 
                            value={selectedQuestion} 
                            onChange={(e) => setSelectedQuestion(e.target.value)}
                            className="px-4 py-2 border-2 border-slate-200 rounded-xl outline-none focus:border-macaw text-sm font-bold text-slate-700 bg-white min-w-[200px] max-w-sm truncate appearance-none cursor-pointer"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                        >
                            <option value="">Semua Pertanyaan</option>
                            {questionOptions.map(opt => (
                                <option key={opt.label} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        
                        {/* Latest vs All Filter */}
                        <select 
                            value={filterLatest} 
                            onChange={(e) => setFilterLatest(e.target.value as 'all' | 'latest')}
                            className="px-4 py-2 border-2 border-slate-200 rounded-xl outline-none focus:border-macaw text-sm font-bold text-slate-700 bg-white appearance-none cursor-pointer"
                            style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em', paddingRight: '2.5rem' }}
                        >
                            <option value="all">Semua Jawaban</option>
                            <option value="latest">Jawaban Terakhir Saja</option>
                        </select>
                        
                        {(selectedStudents.length > 0 || selectedQuestion !== '' || filterLatest !== 'all') && (
                            <button 
                                onClick={() => {
                                    setSelectedStudents([]);
                                    setSelectedQuestion('');
                                    setFilterLatest('all');
                                }}
                                className="text-xs font-bold text-slate-400 hover:text-cardinal underline decoration-dashed ml-2"
                            >
                                Reset Filter
                            </button>
                        )}
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
                                        <td className="p-4 text-slate-600 truncate max-w-xs" title={item.question_text}>
                                            <span className="block text-xs font-black text-slate-400 mb-1">{getQuestionLabel(item.question_text)}</span>
                                            {item.question_text}
                                        </td>
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
