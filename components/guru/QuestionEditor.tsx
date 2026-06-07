import React, { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Wand2, Save, X, BookOpen, HelpCircle, Brain, Eye, EyeOff, Send, Loader2, Zap } from 'lucide-react';
import { LatexRenderer } from '../shared/LatexRenderer';
import { StandardQuestion, CTIndicators } from '../../models/types';
import { analyzeCTIndicators, reviseQuestionWithAI } from '../../services/gemini';

interface QuestionEditorProps {
  currentQuestion: Partial<StandardQuestion>;
  setCurrentQuestion: (q: Partial<StandardQuestion>) => void;
  activeTab: string;
  isGenerating: boolean;
  aiTopic: string;
  setAiTopic: (topic: string) => void;
  aiContext: string;
  setAiContext: (ctx: string) => void;
  handleGenerateAI: () => void;
  handleSave: () => void;
  setIsEditing: (editing: boolean) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  currentQuestion, setCurrentQuestion, activeTab, isGenerating, aiTopic, setAiTopic, aiContext, setAiContext, handleGenerateAI, handleSave, setIsEditing
}) => {
  const [showCT, setShowCT] = useState(false);
  const [ctIndicators, setCtIndicators] = useState<CTIndicators | null>(null);
  const [isAnalyzingCT, setIsAnalyzingCT] = useState(false);

  const [revisionInput, setRevisionInput] = useState('');
  const [isRevising, setIsRevising] = useState(false);

  const handleToggleCT = useCallback(async () => {
    if (showCT) {
      setShowCT(false);
      return;
    }

    if (ctIndicators) {
      setShowCT(true);
      return;
    }

    if (!currentQuestion.question_text || !currentQuestion.correct_answer) {
      return;
    }

    setIsAnalyzingCT(true);
    try {
      const result = await analyzeCTIndicators(
        currentQuestion.question_text || '',
        currentQuestion.options || [],
        currentQuestion.correct_answer || '',
        currentQuestion.explanation || ''
      );
      setCtIndicators(result);
      setShowCT(true);
    } catch (err) {
      console.error('CT Analysis failed:', err);
    } finally {
      setIsAnalyzingCT(false);
    }
  }, [showCT, ctIndicators, currentQuestion]);

  const handleRevise = useCallback(async () => {
    if (!revisionInput.trim() || !currentQuestion.question_text) return;

    setIsRevising(true);
    try {
      const result = await reviseQuestionWithAI(
        currentQuestion.question_text || '',
        currentQuestion.options || [],
        currentQuestion.correct_answer || '',
        currentQuestion.explanation || '',
        revisionInput.trim()
      );
      setCurrentQuestion({
        ...currentQuestion,
        question_text: result.question || currentQuestion.question_text,
        options: result.options || currentQuestion.options,
        correct_answer: result.correctAnswer || currentQuestion.correct_answer,
        explanation: result.explanation || currentQuestion.explanation
      });
      setRevisionInput('');
    } catch (err) {
      console.error('Revision failed:', err);
    } finally {
      setIsRevising(false);
    }
  }, [revisionInput, currentQuestion, setCurrentQuestion]);

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b-2 border-slate-100 pb-4">
        <h3 className="text-xl font-bold text-slate-700">{currentQuestion.id ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
      </div>

      {/* AI Generator Section */}
      <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 space-y-2 w-full">
          <input 
            type="text" 
            placeholder="Topik Soal (Contoh: Volume Balok)" 
            className="w-full p-2 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 outline-none"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Konteks Materi (Opsional)" 
            className="w-full p-2 rounded-xl border-2 border-indigo-200 focus:border-indigo-400 outline-none"
            value={aiContext}
            onChange={(e) => setAiContext(e.target.value)}
          />
        </div>
        <button 
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          <Wand2 size={20} /> {isGenerating ? 'Membuat...' : 'Buat dengan AI'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Kategori Soal</label>
            <select 
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-macaw outline-none disabled:opacity-50"
              value={currentQuestion.category || activeTab}
              onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value as any})}
            >
                <option value="pretest">Pretest Wajib</option>
                <option value="lesson">Soal Tiap Bab (Lesson)</option>
                <option value="game">Soal Latihan (Game/Maze)</option>
                <option value="posttest">Post Test Wajib</option>
            </select>
          </div>
          
          {currentQuestion.category === 'lesson' && (
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">ID Lesson (Contoh: u1l1, u2l2)</label>
                <input 
                  type="text" 
                  placeholder="Contoh: u1l1"
                  className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-macaw outline-none"
                  value={currentQuestion.lesson_id || ''}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, lesson_id: e.target.value})}
                />
              </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Pertanyaan (Dukung LaTeX: $rumus$)</label>
            <textarea 
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-macaw outline-none min-h-[300px]"
              value={currentQuestion.question_text || ''}
              onChange={(e) => setCurrentQuestion({...currentQuestion, question_text: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Opsi Jawaban & Feedback Spesifik</label>
            <p className="text-xs text-slate-500 mb-2">Pilih radio button untuk menentukan jawaban yang benar.</p>
            {(currentQuestion.options || ['', '', '', '']).map((opt, idx) => {
              const optsKey = opt || `Opsi ${['A', 'B', 'C', 'D'][idx]}`;
              return (
                <div key={idx} className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 w-full mb-2">
                        <input 
                            type="radio" 
                            name="correct_answer_radio"
                            className="w-5 h-5 text-macaw cursor-pointer"
                            checked={currentQuestion.correct_answer === opt && opt !== ''}
                            onChange={() => setCurrentQuestion({...currentQuestion, correct_answer: opt})}
                        />
                        <input 
                          type="text" 
                          placeholder={`Opsi ${['A', 'B', 'C', 'D'][idx]}`}
                          className="w-full p-2 rounded-lg border-2 border-slate-200 focus:border-macaw outline-none"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(currentQuestion.options || ['', '', '', ''])];
                            const wasCorrect = currentQuestion.correct_answer === opt;
                            newOpts[idx] = e.target.value;
                            
                            const feedback = {...(currentQuestion.option_feedback || {})};
                            if (feedback[opt]) {
                                feedback[e.target.value] = feedback[opt];
                                delete feedback[opt];
                            }

                            setCurrentQuestion({
                                ...currentQuestion, 
                                options: newOpts,
                                correct_answer: wasCorrect ? e.target.value : currentQuestion.correct_answer,
                                option_feedback: feedback
                            });
                          }}
                        />
                    </div>
                    <div className="pl-8">
                        <input 
                            type="text"
                            placeholder="Feedback singkat jika murid memilih opsi ini (Opsional)"
                            className="w-full p-2 text-sm rounded-lg border-2 border-slate-200 focus:border-macaw outline-none bg-white"
                            value={currentQuestion.option_feedback?.[optsKey] || ''}
                            onChange={(e) => {
                                const feedback = {...(currentQuestion.option_feedback || {})};
                                feedback[optsKey] = e.target.value;
                                setCurrentQuestion({...currentQuestion, option_feedback: feedback});
                            }}
                        />
                    </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Penjelasan Global (Dukung LaTeX)</label>
            <textarea 
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-macaw outline-none min-h-[300px]"
              value={currentQuestion.explanation || ''}
              onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Preview Render LaTeX</h4>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border-2 border-slate-100">
              <span className="text-xs font-bold text-macaw uppercase">Soal:</span>
              <LatexRenderer content={currentQuestion.question_text || 'Belum ada soal'} className="mt-2 text-slate-700" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(currentQuestion.options || []).map((opt, idx) => (
                <div key={idx} className={`p-3 rounded-xl border-2 ${opt && opt === currentQuestion.correct_answer ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'}`}>
                  <LatexRenderer content={opt || `Opsi ${idx+1}`} />
                </div>
              ))}
            </div>
            {currentQuestion.question_text && currentQuestion.correct_answer && (
              <>
                <button
                  onClick={handleToggleCT}
                  disabled={isAnalyzingCT}
                  className="w-full flex items-center justify-between p-3 rounded-xl border-2 border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Brain size={18} className="text-indigo-500" />
                    Analisis Computational Thinking
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-500">
                    {isAnalyzingCT ? (
                      <><Loader2 size={16} className="animate-spin" /> Menganalisis...</>
                    ) : showCT ? (
                      <><EyeOff size={16} /> Sembunyikan</>
                    ) : (
                      <><Eye size={16} /> Tampilkan</>
                    )}
                  </span>
                </button>
                {showCT && ctIndicators && (
                  <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200 space-y-3 animate-in slide-in-from-top-2 fade-in">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                      <Zap size={14} /> Indikator Computational Thinking
                    </span>
                    {[
                      { label: 'Dekomposisi', key: 'decomposition' as const },
                      { label: 'Pengenalan Pola', key: 'patternRecognition' as const },
                      { label: 'Abstraksi', key: 'abstraction' as const },
                      { label: 'Desain Algoritma', key: 'algorithmDesign' as const }
                    ].map(({ label, key }) => (
                      <div key={key} className="bg-white p-3 rounded-lg border border-indigo-100">
                        <span className="text-xs font-bold text-indigo-500 uppercase block mb-1">{label}</span>
                        <p className="text-sm text-slate-700 leading-relaxed">{ctIndicators[key]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {currentQuestion.explanation && (
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                <span className="text-xs font-bold text-blue-500 uppercase">Penjelasan:</span>
                <LatexRenderer content={currentQuestion.explanation} className="mt-2 text-slate-700 text-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-slate-100 space-y-3">
        {currentQuestion.question_text && (
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
            <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
              <Wand2 size={16} className="text-indigo-500" /> Revisi dengan AI
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: ubah tingkat kesulitan jadi lebih mudah, ganti konteks soal..."
                className="flex-1 p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-400 outline-none text-sm"
                value={revisionInput}
                onChange={(e) => setRevisionInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !isRevising) handleRevise(); }}
                disabled={isRevising}
              />
              <button
                onClick={handleRevise}
                disabled={!revisionInput.trim() || isRevising}
                className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {isRevising ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {isRevising ? 'Merevisi...' : 'Kirim'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">Hasil revisi akan langsung mengisi form di atas.</p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-macaw text-white px-8 py-3 rounded-xl font-bold hover:bg-macaw-dark transition-all active:scale-95 flex items-center gap-2"
          >
            <Save size={20} /> Simpan Soal
          </button>
        </div>
      </div>
    </div>
  );
};
