import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../services/supabase';
import { MANUAL_PRETEST_QUESTIONS } from '../../data/manual_questions/pretest';
import { Question } from '../../models/types';
import { Button } from '../shared/Button';
import { Loader2, CheckCircle, XCircle, BrainCircuit, ArrowRight, Play } from 'lucide-react';
import { useAppContext } from '../../lib/AppContext';

interface PretestFlowProps {
  grade: string;
  onComplete: () => void;
}

/**
 * Komponen alur pretest (tes awal) untuk siswa baru.
 * Menghasilkan soal adaptif menggunakan AI untuk menentukan level awal siswa.
 * 
 * @param {PretestFlowProps} props - Properti komponen PretestFlow.
 * @param {string} props.grade - Kelas siswa (misal: "7", "8", "9").
 * @param {() => void} props.onComplete - Callback yang dipanggil saat pretest selesai.
 * @returns {JSX.Element} Elemen antarmuka alur pretest.
 */
export const PretestFlow: React.FC<PretestFlowProps> = ({ grade, onComplete }) => {
  const { userData, setUserData } = useAppContext();
  const [step, setStep] = useState<'intro' | 'loading' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<(Question & { difficulty: string })[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  
  /**
   * Mengambil soal pretest dari input manual
   * dan mengubah state ke mode kuis.
   */
  const loadQuestions = async () => {
    setStep('loading');
    // Menggunakan soal manual
    setQuestions(MANUAL_PRETEST_QUESTIONS);
    setStep('quiz');
  };

  /**
   * Memeriksa jawaban yang dipilih pengguna terhadap jawaban yang benar.
   * Memberikan feedback dan menghitung skor berdasarkan tingkat kesulitan soal.
   */
  const checkAnswer = () => {
    if (!selectedOption) return;
    const currentQ = questions[currentIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    
    // Scoring sederhana: Easy=1, Medium=2, Hard=3
    if (isCorrect) {
        let points = 1;
        if (currentQ.difficulty === 'medium') points = 2;
        if (currentQ.difficulty === 'hard') points = 3;
        scoreRef.current += points;
        setScore(prev => prev + points);
    }
  };

  /**
   * Melanjutkan ke pertanyaan berikutnya atau menyelesaikan pretest
   * jika sudah mencapai pertanyaan terakhir.
   */
  const nextQuestion = () => {
    setFeedbackState('none');
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
    } else {
        finishPretest();
    }
  };

  /**
   * Menyelesaikan pretest, menghitung level awal dan EXP berdasarkan skor,
   * lalu menyimpan hasilnya ke database dan memperbarui context pengguna.
   */
  const finishPretest = async () => {
      setStep('result');
      
      // Hitung Level Awal berdasarkan Score
      // Max Score estimasi: ~20 poin. 
      // Score > 15 -> Level 5
      // Score > 10 -> Level 3
      // Score < 10 -> Level 1
      let startLevel = 1;
      let startExp = 0;
      
      if (scoreRef.current >= 15) { startLevel = 5; startExp = 1200; }
      else if (scoreRef.current >= 10) { startLevel = 3; startExp = 500; }
      else if (scoreRef.current >= 5) { startLevel = 2; startExp = 100; }

      // Update Database
      if (userData) {
          await supabase.from('users_data').update({
              level: startLevel,
              exp: startExp
          }).eq('id', userData.id);
          
          await supabase.from('activity_logs').insert({
              user_id: userData.id,
              username: userData.username,
              action_type: 'pretest_complete',
              details: { message: `Menyelesaikan Pretest`, score: scoreRef.current, level: startLevel } as any
          });

          // Update Local Context
          setUserData({ ...userData, level: startLevel, exp: startExp } as any);
      }
  };

  // --- RENDERERS ---

  if (step === 'intro') {
      return (
          <div className="fixed inset-0 z-[200] glass-overlay flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-white/60 max-w-lg w-full flex flex-col items-center">
                  <div className="w-28 h-28 bg-feather-light/20 rounded-full flex items-center justify-center mb-8 text-feather animate-bounce-slow">
                      <BrainCircuit size={56} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Tes Kemampuan Awal</h1>
                  <p className="text-slate-500 font-medium text-base md:text-lg max-w-md mb-10 leading-relaxed">
                      Jawab beberapa pertanyaan singkat agar Logi bisa menyesuaikan materi dengan levelmu!
                  </p>
                  <Button onClick={loadQuestions} size="lg" className="w-full max-w-sm" icon={<Play size={24}/>}>
                      MULAI TES
                  </Button>
              </div>
          </div>
      );
  }

  if (step === 'loading') {
      return (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-macaw mb-4" size={48} />
              <h2 className="text-xl font-bold text-slate-700">Menyiapkan Soal Adaptif...</h2>
          </div>
      );
  }

  if (step === 'quiz') {
      const q = questions[currentIdx];
      const progress = ((currentIdx + 1) / questions.length) * 100;

      return (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col">
              {/* Header Progress */}
              <div className="p-6">
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-feather transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
              </div>

              {/* Soal */}
              <div className="flex-1 overflow-y-auto px-6 pb-32">
                  <div className="max-w-2xl mx-auto mt-4">
                      <div className="question-container mb-10">
                          {q.question}
                      </div>
                      <div className="space-y-4">
                          {q.options?.map((opt, i) => (
                              <button 
                                key={i}
                                onClick={() => feedbackState === 'none' && setSelectedOption(opt)}
                                disabled={feedbackState !== 'none'}
                                className={`option-btn
                                    ${selectedOption === opt && feedbackState === 'none' ? 'option-btn-selected' : ''}
                                    ${feedbackState !== 'none' && opt === q.correctAnswer ? 'option-btn-correct animate-correct-pulse' : ''}
                                    ${feedbackState === 'incorrect' && selectedOption === opt ? 'option-btn-incorrect animate-shake' : ''}
                                `}
                              >
                                  <div className="option-indicator">
                                      {String.fromCharCode(65+i)}
                                  </div>
                                  <span className="flex-1">{opt}</span>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Footer Feedback */}
              <div className={`fixed bottom-0 left-0 right-0 p-6 border-t-2 transition-colors duration-300 ${feedbackState === 'correct' ? 'bg-green-100 border-green-200' : feedbackState === 'incorrect' ? 'bg-red-100 border-red-200' : 'bg-white border-slate-100'}`}>
                  <div className="max-w-2xl mx-auto flex justify-between items-center">
                      {feedbackState === 'none' ? (
                          <Button onClick={checkAnswer} disabled={!selectedOption} size="lg" className="w-full">PERIKSA</Button>
                      ) : (
                          <div className="w-full flex items-center justify-between animate-in slide-in-from-bottom-2">
                              <div className="flex items-center gap-4">
                                  {feedbackState === 'correct' 
                                    ? <div className="bg-white p-2 rounded-full text-green-500"><CheckCircle size={32}/></div> 
                                    : <div className="bg-white p-2 rounded-full text-red-500"><XCircle size={32}/></div>
                                  }
                                  <div>
                                      <h3 className={`font-black text-xl ${feedbackState === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                                          {feedbackState === 'correct' ? 'Kerja Bagus!' : 'Jawaban Benar:'}
                                      </h3>
                                      {feedbackState === 'incorrect' && (
                                          <p className="text-red-600 font-bold">{q.correctAnswer}</p>
                                      )}
                                  </div>
                              </div>
                              <Button onClick={nextQuestion} variant={feedbackState === 'correct' ? 'primary' : 'danger'} size="lg">
                                  LANJUT <ArrowRight className="ml-2" size={20} />
                              </Button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  // Result
  return (
      <div className="fixed inset-0 z-[200] glass-overlay flex flex-col items-center justify-center p-6 text-center animate-in zoom-in">
          <div className="bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-white/60 max-w-lg w-full flex flex-col items-center">
              <div className="w-28 h-28 bg-feather-light/20 rounded-full flex items-center justify-center mb-8 text-feather animate-bounce">
                  <CheckCircle size={56} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">Tes Selesai!</h1>
              <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
                  Berdasarkan hasil tes, Logi merekomendasikan kamu mulai di...
              </p>
              <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-2xl mb-8 w-full">
                  <span className="text-slate-400 font-bold uppercase text-sm tracking-widest">Starting Level</span>
                  <div className="text-6xl font-black text-feather mt-2">{score >= 15 ? 5 : score >= 10 ? 3 : score >= 5 ? 2 : 1}</div>
              </div>
              <Button onClick={onComplete} size="lg" className="w-full bg-feather border-feather-dark">
                  MASUK DASHBOARD
              </Button>
          </div>
      </div>
  );
};