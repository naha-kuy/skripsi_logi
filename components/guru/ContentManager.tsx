import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAppContext } from '../../lib/AppContext';
import { Plus, Edit2, Trash2, Wand2, Save, X, BookOpen, HelpCircle } from 'lucide-react';
import { LatexRenderer } from '../shared/LatexRenderer';
import { draftQuestionWithAI } from '../../services/gemini';
import { StandardQuestion } from '../../models/types';
import { QuestionEditor } from './QuestionEditor';

export const ContentManager: React.FC = () => {
  const { showToast, userData, showConfirm } = useAppContext();
  const [questions, setQuestions] = useState<StandardQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<StandardQuestion>>({});
  const [aiTopic, setAiTopic] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'pretest' | 'lesson' | 'game' | 'posttest'>('game');

  useEffect(() => {
    if (userData?.id) {
       fetchQuestions();
    }
  }, [activeTab, userData?.id]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('teacher_id', userData?.id)
        .eq('category', activeTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuestions((data as StandardQuestion[]) || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      showToast("Gagal memuat daftar soal. Silakan muat ulang (refresh) halaman.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const missingFields = [];
      if (!currentQuestion.question_text) missingFields.push("Pertanyaan");
      if (!currentQuestion.correct_answer) missingFields.push("Jawaban Benar");
      if (!activeTab) missingFields.push("Kategori");
      if (!currentQuestion.options || currentQuestion.options.length < 2) missingFields.push("Opsi Jawaban (min. 2)");

      if (missingFields.length > 0) {
        showToast(`Lengkapi kolom berikut sebelum menyimpan: ${missingFields.join(", ")}`, "error");
        return;
      }

      const payload = {
        ...currentQuestion,
        options: currentQuestion.options || [],
        teacher_id: userData?.id,
        category: activeTab
      };

      if (currentQuestion.id) {
        await supabase.from('questions').update(payload as any).eq('id', currentQuestion.id);
        showToast("Soal berhasil diperbarui", "success");
      } else {
        await supabase.from('questions').insert([payload as any]);
        showToast("Soal berhasil ditambahkan", "success");
      }
      
      setIsEditing(false);
      setCurrentQuestion({});
      fetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      showToast("Gagal menyimpan soal", "error");
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm("Hapus Soal", "Yakin ingin menghapus soal ini?", async () => {
      try {
        await supabase.from('questions').delete().eq('id', id);
        showToast("Soal berhasil dihapus", "success");
        fetchQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
        showToast("Gagal menghapus soal", "error");
      }
    }, "danger");
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) {
      showToast("Tulis topik terlebih dahulu sebelum menggunakan AI.", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const draft = await draftQuestionWithAI(aiTopic, 'medium', aiContext);
      setCurrentQuestion({
        ...currentQuestion,
        question_text: draft.question,
        options: draft.options,
        correct_answer: draft.correctAnswer,
        explanation: draft.explanation
      });
      showToast("AI berhasil membuat draf soal.", "success");
    } catch (error) {
      showToast("Gagal membuat draf AI", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="text-macaw" /> Bank Soal Guru
          </h2>
          <p className="text-slate-500 mt-1">Kelola bank soal kuratif khusus untuk kelas Anda.</p>
        </div>
        <button 
          onClick={() => { setCurrentQuestion({ category: activeTab as any, options: ['', '', '', ''] }); setIsEditing(true); }}
          className="bg-macaw text-white px-6 py-3 rounded-2xl font-bold hover:bg-macaw-dark transition-colors flex items-center gap-2 shadow-lg shadow-macaw/30"
        >
          <Plus size={20} /> Tambah Soal
        </button>
      </div>

      <div className="flex gap-4 border-b-2 border-slate-200 pb-2 flex-wrap">
        <button 
          onClick={() => setActiveTab('pretest')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${activeTab === 'pretest' ? 'bg-macaw text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Pretest Wajib
        </button>
        <button 
          onClick={() => setActiveTab('lesson')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${activeTab === 'lesson' ? 'bg-macaw text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Soal Tiap Bab
        </button>
        <button 
          onClick={() => setActiveTab('game')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${activeTab === 'game' ? 'bg-macaw text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Latihan (Game)
        </button>
        <button 
          onClick={() => setActiveTab('posttest')}
          className={`px-4 py-2 font-bold rounded-xl transition-colors ${activeTab === 'posttest' ? 'bg-macaw text-white' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Post Test Wajib
        </button>
      </div>

      {['pretest', 'lesson', 'game', 'posttest'].includes(activeTab) && (
        isEditing ? (
        <QuestionEditor 
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          activeTab={activeTab}
          isGenerating={isGenerating}
          aiTopic={aiTopic}
          setAiTopic={setAiTopic}
          aiContext={aiContext}
          setAiContext={setAiContext}
          handleGenerateAI={handleGenerateAI}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="data-table-container">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : questions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <HelpCircle size={48} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Belum Ada Soal</h3>
              <p className="text-slate-500">Buat soal pertama Anda untuk mulai mengisi bank soal.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b-2 border-slate-100 text-slate-500 font-bold text-sm uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Kode Soal</th>
                    <th className="p-4">Soal (Preview)</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {q.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-600 font-mono text-sm">
                          {q.lesson_id || q.category}
                        </span>
                      </td>
                      <td className="p-4 max-w-md">
                        <div className="line-clamp-2 text-slate-700">
                          <LatexRenderer content={q.question_text} />
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => { setCurrentQuestion(q); setIsEditing(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      
      {(activeTab as string) === 'lessons' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-700 mb-2">Manajemen Materi (Segera Hadir)</h3>
          <p className="text-slate-500">Fitur untuk menambah dan mengedit materi pembelajaran per bab.</p>
        </div>
      )}

      {(activeTab as string) === 'units' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-700 mb-2">Manajemen Bab (Segera Hadir)</h3>
          <p className="text-slate-500">Fitur untuk mengatur urutan bab dan topik utama.</p>
        </div>
      )}
    </div>
  );
};
