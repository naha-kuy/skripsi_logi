import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { StandardQuestion } from '../../models/types';
import { Button } from '../shared/Button';
import { LatexRenderer } from '../shared/LatexRenderer';
import { useAppContext } from '../../lib/AppContext';
import { shuffleArray } from '../../lib/utils';

interface PretestRunnerProps {
  teacherId: string;
  studentId: string;
  onComplete: () => void;
  onCancel?: () => void;
}

// Fallback questions if teacher hasn't created any
const FALLBACK_PRETEST: Omit<StandardQuestion, 'id'>[] = [
  { teacher_id: 'sys', category: 'pretest', question_text: 'Berapakah $2 + 2$?', options: ['3', '4', '5', '6'], correct_answer: '4', explanation: 'Kalkulasi dasar matematika.' },
  { teacher_id: 'sys', category: 'pretest', question_text: 'Berapakah volume balok dengan panjang 2, lebar 3, tinggi 4?', options: ['24', '9', '20', '12'], correct_answer: '24', explanation: '$V = p \\times l \\times t$' },
];

export const PretestRunner: React.FC<PretestRunnerProps> = ({ teacherId, studentId, onComplete, onCancel }) => {
  const { showConfirm, showToast, userData } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<StandardQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  const storageKey = `logimath_pretest_${studentId}_${teacherId}`;

  useEffect(() => {
    fetchQuestions();
  }, [teacherId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Cek apakah sudah dikerjakan
      if (userData?.has_completed_pretest) {
          setAlreadyCompleted(true);
          setLoading(false);
          return;
      }

      // Load jawaban tersimpan
      const savedAnswers = localStorage.getItem(storageKey);
      if (savedAnswers) {
          setAnswers(JSON.parse(savedAnswers));
      }

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('category', 'pretest');
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        const shuffled = (FALLBACK_PRETEST as StandardQuestion[]).map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setQuestions(shuffled);
      } else {
        const shuffled = data.map((q: any) => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setQuestions(shuffled as StandardQuestion[]);
      }
    } catch (err) {
      console.error(err);
      const shuffled = (FALLBACK_PRETEST as StandardQuestion[]).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      setQuestions(shuffled);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number, opt: string) => {
    const newAnswers = { ...answers, [idx]: opt };
    setAnswers(newAnswers);
    localStorage.setItem(storageKey, JSON.stringify(newAnswers));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    // calculate score
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) {
        score += 1;
      }
    });
    
    // Scale to 100
    const finalScore = Math.round((score / questions.length) * 100);

    showConfirm("Selesaikan Pre-test?", "Anda tidak dapat mengulang tes ini.", async () => {
       setIsSubmitting(true);
       try {
         const { error } = await supabase.from('student_teacher_progress')
            .update({ 
              has_completed_pretest: true, 
              pretest_score: finalScore 
            })
            .eq('student_id', studentId)
            .eq('teacher_id', teacherId);
            
         if (error) throw error;

         // Insert student answers
         const answersToInsert = questions.map((q, idx) => ({
             student_id: studentId,
             teacher_id: teacherId,
             question_id: q.id,
             context: 'pretest',
             question_text: q.question_text,
             student_answer: answers[idx] || '',
             is_correct: answers[idx] === q.correct_answer
         }));
         
         if (answersToInsert.length > 0) {
             const { error: insertError } = await supabase.from('student_answers').insert(answersToInsert);
             if (insertError) console.error("Failed to insert answers:", insertError);
         }
         
         localStorage.removeItem(storageKey);
         showToast(`Pre-test selesai! Skor: ${finalScore}`, "success");
         onComplete();
       } catch (err) {
         showToast("Gagal menyimpan hasil.", "error");
       } finally {
         setIsSubmitting(false);
       }
    });
  };

  const handleCancel = () => {
      showConfirm("Keluar dari tes?", "Jawaban sementara Anda telah disimpan di perangkat ini.", () => {
          if (onCancel) onCancel();
          else onComplete();
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-macaw" size={48} />
      </div>
    );
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-md w-full">
            <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-800 mb-2">Pre-test Selesai</h2>
            <p className="text-slate-500 font-medium mb-6">Anda sudah pernah mengerjakan Pre-test untuk kelas ini dan tidak dapat mengulangnya lagi.</p>
            <Button onClick={onComplete} className="w-full">Kembali ke Beranda</Button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-700">
      <div className="bg-white max-w-3xl w-full rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-macaw p-6 text-white text-center relative">
          {onCancel && (
            <button onClick={handleCancel} className="absolute left-6 top-6 text-white/80 hover:text-white font-bold text-sm bg-black/10 px-3 py-1 rounded-full">
              Keluar
            </button>
          )}
          <h1 className="text-2xl font-black mb-2 mt-4 md:mt-0">Pre-test Kemampuan Awal</h1>
          <p className="font-bold opacity-90">Selesaikan soal ini sebelum mulai petualangan!</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-4 rounded-full mt-6 overflow-hidden">
             <div 
               className="bg-bee h-full transition-all duration-500" 
               style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
             />
          </div>
          <div className="text-right text-xs mt-1 font-bold">
            Soal {currentIndex + 1} dari {questions.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
           {currentQ ? (
             <div className="space-y-8 animate-in fade-in zoom-in duration-300">
               <div className="text-xl font-bold bg-slate-50 p-4 md:p-6 rounded-2xl border-2 border-slate-100 overflow-x-auto text-base md:text-lg">
                  <LatexRenderer content={currentQ.question_text} />
               </div>
               
               <div className="flex flex-col gap-3">
                 {(currentQ.options || []).map((opt, optIdx) => {
                   const isSelected = answers[currentIndex] === opt;
                   return (
                     <button
                       key={optIdx}
                       onClick={() => handleSelectOption(currentIndex, opt)}
                       className={`w-full p-4 rounded-xl border-2 font-bold text-left transition-all flex items-center gap-4 ${
                         isSelected 
                           ? 'border-macaw bg-blue-50 text-macaw shadow-md' 
                           : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-macaw bg-white' : 'border-slate-300'}`}>
                         {isSelected && <div className="w-3 h-3 bg-macaw rounded-full" />}
                       </div>
                       <div className="flex-1 overflow-x-auto text-sm md:text-base break-words">
                         <LatexRenderer content={opt} />
                       </div>
                     </button>
                   )
                 })}
               </div>
             </div>
           ) : (
             <div className="text-center p-12 italic text-slate-400 font-bold">Tidak ada soal.</div>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="text-sm font-bold text-slate-400">
             Logi Math Pre-test
          </div>
          <div>
            {currentIndex < questions.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleNext} 
                disabled={!answers[currentIndex]}
                className="flex items-center gap-2"
              >
                Selanjutnya <ArrowRight size={20} />
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                className="flex items-center gap-2 shadow-lg shadow-feather/30"
                disabled={!answers[currentIndex] || isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />} Selesai
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
