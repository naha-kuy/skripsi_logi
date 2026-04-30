import React, { useState, useRef } from 'react';
import { supabase } from '../../services/supabase';
import { fetchQuestionsByCategory } from '../../services/questionService';
import { Question } from '../../models/types';
import { Button } from '../shared/Button';
import { Loader2, CheckCircle, XCircle, Trophy, ArrowRight, Play } from 'lucide-react';
import { useAppContext } from '../../lib/AppContext';
import { shuffleArray } from '../../lib/utils';
import { LatexRenderer } from '../shared/LatexRenderer';

interface PosttestFlowProps {
  onComplete: () => void;
  onClose: () => void;
}

/**
 * Komponen alur post-test (ujian akhir) untuk siswa.
 * Menampilkan soal-soal akhir untuk mengukur pemahaman siswa setelah menyelesaikan semua materi.
 */
export const PosttestFlow: React.FC<PosttestFlowProps> = ({ onComplete, onClose }) => {
  const { userData, setUserData, activeTeacherId } = useAppContext();
  const [step, setStep] = useState<'intro' | 'loading' | 'quiz' | 'result'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0); // Ref untuk tracking skor real-time (menghindari stale state)
  const answersRef = useRef<Record<number, string>>({}); // Fix BUG-03: tracking real-time answers
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const storageKey = `logimath_posttest_${userData?.id}_${activeTeacherId}`;

  React.useEffect(() => {
      if (userData?.has_completed_posttest) {
          setAlreadyCompleted(true);
      } else {
          // Check local storage for saved progress
          const savedStr = localStorage.getItem(storageKey);
          if (savedStr) {
              try {
                  const saved = JSON.parse(savedStr);
                  if (saved.answers) {
                      setAnswers(saved.answers);
                      answersRef.current = saved.answers;
                  }
                  if (saved.currentIdx !== undefined) setCurrentIdx(saved.currentIdx);
                  if (saved.score !== undefined) {
                      setScore(saved.score);
                      scoreRef.current = saved.score;
                  }
                  if (saved.questionIds && saved.questionIds.length > 0) {
                      supabase.from('questions').select('*').in('id', saved.questionIds).then(({data}) => {
                          if (data) {
                              const restored = saved.questionIds.map((id: string) => data.find(q => q.id === id)).filter(Boolean).map((q: any) => ({
                                  id: q.id,
                                  type: 'multiple-choice',
                                  question: q.question_text,
                                  options: shuffleArray(q.options),
                                  correctAnswer: q.correct_answer,
                                  explanation: q.explanation,
                                  optionFeedback: q.option_feedback
                              }));
                              setQuestions(restored);
                              setStep('quiz');
                          }
                      });
                  }
              } catch (e) {
                  console.error(e);
              }
          }
      }
  }, [userData]);
  
  const loadQuestions = async () => {
    setStep('loading');
    let fetched = await fetchQuestionsByCategory('posttest', activeTeacherId || undefined, 20);
    if(fetched.length === 0){
        fetched = [
            { id: '1', type: 'multiple-choice', question: "Apakah kamu siap lulus?", options: ["Ya", "Tidak"], correctAnswer: "Ya", explanation: "" }
        ];
    }
    const shuffled = fetched.map(q => ({
        ...q,
        options: shuffleArray(q.options || [])
    }));
    setQuestions(shuffled);
    setStep('quiz');
    localStorage.setItem(storageKey, JSON.stringify({
        questionIds: shuffled.map(q => q.id),
        currentIdx: 0,
        answers: {},
        score: 0
    }));
  };

  const checkAnswer = () => {
    if (!selectedOption) return;
    const currentQ = questions[currentIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    const newAnswers = { ...answers, [currentIdx]: selectedOption };
    setAnswers(newAnswers);
    answersRef.current = newAnswers;
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        scoreRef.current += 1;
        setScore(prev => prev + 1);
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify({
        questionIds: questions.map(q => q.id),
        currentIdx,
        answers: newAnswers,
        score: isCorrect ? scoreRef.current : score
    }));
  };

  const nextQuestion = () => {
    setFeedbackState('none');
    setSelectedOption(null);
    if (currentIdx < questions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        localStorage.setItem(storageKey, JSON.stringify({
            questionIds: questions.map(q => q.id),
            currentIdx: nextIdx,
            answers: answersRef.current,
            score: scoreRef.current
        }));
    } else {
        finishPosttest();
    }
  };

  const finishPosttest = async () => {
      setStep('result');
      
      // Gunakan ref untuk skor akurat (state mungkin stale karena React batching)
      const computedScore = Math.round((scoreRef.current / questions.length) * 100);
      setScore(computedScore);
      
      // Update Database
      if (userData && activeTeacherId) {
          await supabase.from('student_teacher_progress').update({
              has_completed_posttest: true,
              posttest_score: computedScore
          }).eq('student_id', userData.id).eq('teacher_id', activeTeacherId);
          
          await supabase.from('activity_logs').insert({
              user_id: userData.id,
              username: userData.username,
              action_type: 'posttest_complete',
              details: { message: 'Menyelesaikan Post-test', score: computedScore } as any
          });

          // Insert student answers
          const answersToInsert = questions.map((q, idx) => ({
             student_id: userData.id,
             teacher_id: activeTeacherId,
             question_id: q.id,
             context: 'posttest',
             question_text: q.question,
             student_answer: answersRef.current[idx] || '',
             is_correct: answersRef.current[idx] === q.correctAnswer
          }));
          
          if (answersToInsert.length > 0) {
             const { error: insertError } = await supabase.from('student_answers').insert(answersToInsert);
             if (insertError) console.error("Failed to insert answers:", insertError);
          }

          // Update Local Context
          setUserData({ ...userData, has_completed_posttest: true, posttest_score: computedScore } as any);
          localStorage.removeItem(storageKey);
      }
  };

  const handleCancel = () => {
      // Data is already in local storage
      onClose();
  };

  if (alreadyCompleted) {
      return (
          <div className="fixed inset-0 z-[200] glass-overlay flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
             <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 max-w-md w-full">
                <CheckCircle size={64} className="text-feather mx-auto mb-6" />
                <h2 className="text-2xl font-black text-slate-800 mb-3">Post-test Selesai</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">Anda sudah pernah mengerjakan Post-test untuk kelas ini dan tidak dapat mengulangnya lagi.</p>
                <Button onClick={onComplete} className="w-full">Kembali ke Beranda</Button>
             </div>
          </div>
      );
  }

  if (step === 'intro') {
      return (
          <div className="fixed inset-0 z-[200] glass-overlay flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <button onClick={handleCancel} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 backdrop-blur-md rounded-full transition-colors font-bold text-sm flex items-center gap-2 border border-white/20">
                  <XCircle size={20} /> Keluar
              </button>
              <div className="bg-white/90 backdrop-blur-md p-10 md:p-14 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-white/60 max-w-lg w-full flex flex-col items-center">
                  <div className="w-28 h-28 bg-bee-light/30 rounded-full flex items-center justify-center mb-8 text-bee-dark animate-bounce-slow">
                      <Trophy size={56} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Ujian Akhir (Post-test)</h1>
                  <p className="text-slate-500 font-medium text-base md:text-lg max-w-md mb-10 leading-relaxed">
                      Selamat! Kamu telah menyelesaikan semua materi. Sekarang saatnya menguji pemahamanmu secara keseluruhan.
                  </p>
                  <Button onClick={loadQuestions} size="lg" className="w-full max-w-sm bg-bee hover:bg-bee-dark border-bee-dark text-white" icon={<Play size={24}/>}>
                      MULAI UJIAN
                  </Button>
              </div>
          </div>
      );
  }

  if (step === 'loading') {
      return (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
              <h2 className="text-xl font-bold text-slate-700">Menyiapkan Soal Ujian...</h2>
          </div>
      );
  }

  if (step === 'quiz') {
      const q = questions[currentIdx];
      const progress = ((currentIdx + 1) / questions.length) * 100;

      return (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col">
              {/* Header Progress */}
              <div className="p-6 flex items-center gap-4">
                  <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full">
                      <XCircle size={18} /> Keluar
                  </button>
                  <div className="h-4 flex-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
              </div>

              {/* Soal */}
              <div className="flex-1 overflow-y-auto px-6 pb-32 pt-4">
                  <div className="max-w-3xl mx-auto">
                      <div className="question-container mb-8">
                          <LatexRenderer content={q.question} />
                      </div>
                      <div className="flex flex-col gap-4">
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
                                  <div className="flex-1 overflow-x-auto break-words">
                                      <LatexRenderer content={opt} />
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Footer Feedback */}
              <div className={`fixed bottom-0 left-0 right-0 p-6 border-t-2 transition-colors duration-300 ${feedbackState === 'correct' ? 'bg-green-100 border-green-200' : feedbackState === 'incorrect' ? 'bg-red-100 border-red-200' : 'bg-white border-slate-100'}`}>
                  <div className="max-w-2xl mx-auto flex justify-between items-center">
                      {feedbackState === 'none' ? (
                          <Button onClick={checkAnswer} disabled={!selectedOption} size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-white">PERIKSA</Button>
                      ) : (
                          <div className="w-full flex items-center justify-between animate-in slide-in-from-bottom-2">
                              <div className="flex items-center gap-4">
                                  {feedbackState === 'correct' 
                                    ? <div className="bg-white p-2 rounded-full text-green-500 shrink-0"><CheckCircle size={32}/></div> 
                                    : <div className="bg-white p-2 rounded-full text-red-500 shrink-0"><XCircle size={32}/></div>
                                  }
                                  <div>
                                      <h3 className={`font-black text-xl flex items-center gap-2 ${feedbackState === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                                          {feedbackState === 'correct' ? 'Kerja Bagus!' : 'Jawaban Benar:'}
                                          {feedbackState === 'incorrect' && (
                                              <span className="text-slate-800 ml-1">
                                                  <LatexRenderer content={q.correctAnswer} />
                                              </span>
                                          )}
                                      </h3>
                                      {/* Show specific option feedback if available */}
                                      {selectedOption && q.optionFeedback?.[selectedOption] && (
                                          <div className={`mt-1 text-sm font-bold opacity-80 ${feedbackState === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                                              💡 <LatexRenderer content={q.optionFeedback[selectedOption]} />
                                          </div>
                                      )}
                                      {(!q.optionFeedback || !q.optionFeedback[selectedOption || '']) && q.explanation && (
                                          <div className={`mt-1 text-sm font-bold opacity-80 ${feedbackState === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                                             💡 <LatexRenderer content={q.explanation} />
                                          </div>
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
              <div className="w-28 h-28 bg-bee-light/30 rounded-full flex items-center justify-center mb-8 text-bee-dark animate-bounce">
                  <Trophy size={56} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-3">Ujian Selesai!</h1>
              <p className="text-slate-500 font-medium text-lg mb-8 leading-relaxed">
                  Luar biasa! Kamu telah menyelesaikan seluruh rangkaian pembelajaran.
              </p>
              <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-2xl mb-8 w-full">
                  <span className="text-slate-400 font-bold uppercase text-sm tracking-widest">Skor Akhir</span>
                  <div className="text-6xl font-black text-bee-dark mt-2">{score}</div>
              </div>
              <Button onClick={onComplete} size="lg" className="w-full bg-bee hover:bg-bee-dark border-bee-dark text-white">
                  KEMBALI KE DASHBOARD
              </Button>
          </div>
      </div>
  );
};
