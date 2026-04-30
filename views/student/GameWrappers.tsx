import React, { useState, useEffect } from 'react';
import { MazeGame } from '../../components/siswa/MazeGame'; 
import { AdventureGame } from '../../components/siswa/AdventureGame'; 
import { GameIntro } from '../../components/shared/GameIntro';
import { LessonView } from '../../components/siswa/LessonView';
import { PosttestFlow } from '../../components/siswa/PosttestFlow';
import { PretestRunner } from '../../components/siswa/PretestRunner';
import { UnitPath } from '../../components/siswa/UnitPath';
import { CURRICULUM_DATA } from '../../data/curriculum';
import { useAppContext } from '../../lib/AppContext';
import { getLevelFromXP } from '../../lib/levelSystem';
import { supabase } from '../../services/supabase';
import { Lesson, UserData } from '../../models/types';

// --- VIEW LAYER (Sub-Components) ---
// Komponen wrapper untuk merapikan App.tsx

export const MazeWrapper = ({ userData, onBack }: { userData: UserData, onBack: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'solo' | 'coop' | 'duel'>('solo');

  if (isPlaying) {
    return <MazeGame userData={userData} mode={mode} onExit={() => setIsPlaying(false)} />;
  }
  return (
    <GameIntro 
      type="maze" 
      title="Labirin Logika" 
      description="Navigasikan karaktermu melewati lorong labirin yang penuh teka-teki." 
      rules={[
        "Gunakan tombol panah / joystick untuk bergerak.",
        "Cari Kunci untuk membuka gerbang pertanyaan.",
        "Jawab soal matematika dengan benar untuk lanjut.",
        "Hati-hati, jawaban salah akan mengurangi Nyawa.",
        "Temukan Bendera Finish untuk memenangkan permainan!"
      ]} 
      onBack={onBack} 
      onStart={(m) => { setMode(m); setIsPlaying(true); }} 
    />
  );
};

export const AdventureWrapper = ({ userData, onBack }: { userData: UserData, onBack: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'solo' | 'coop' | 'duel'>('solo');

  if (isPlaying) {
    return <AdventureGame userData={userData} mode={mode} onExit={() => setIsPlaying(false)} />;
  }
  return (
    <GameIntro 
      type="adventure" 
      title="Jelajah Sekolah" 
      description="Eksplorasi gedung sekolah, cari guru (NPC), dan kumpulkan poin sebanyak mungkin!" 
      rules={[
        "Jelajahi area sekolah secara bebas (Open World).",
        "Cari Guru (NPC) yang tersebar di peta.",
        "Dekati mereka dan tekan tombol 'Jawab Soal'.",
        "Kumpulkan Poin XP sebanyak mungkin dalam waktu 3 Menit.",
        "Mode Kelompok: Skor tim akan digabungkan!"
      ]} 
      onBack={onBack} 
      onStart={(m) => { setMode(m); setIsPlaying(true); }} 
    />
  );
};

export const LearnWrapper = ({ userData }: { userData: UserData }) => {
    const { session, setUserData, showToast, activeTeacherId } = useAppContext();
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [showPosttest, setShowPosttest] = useState(false);
    const [showPretest, setShowPretest] = useState(false);
    const [tProgress, setTProgress] = useState<{completed_lessons: string[]} | null>(null);

    useEffect(() => {
        if (activeTeacherId && session?.user?.id) {
            supabase.from('student_teacher_progress')
              .select('completed_lessons')
              .eq('student_id', session.user.id)
              .eq('teacher_id', activeTeacherId)
              .single()
              .then(({data}) => {
                  if(data) setTProgress(data);
              });
        }
    }, [activeTeacherId, session?.user?.id]);

    const handleStartLesson = (lesson: Lesson) => setCurrentLesson(lesson);

    const handleLessonComplete = async (score: number) => {
        if (!currentLesson || !userData || !session) return;
        
        // Logic: Only complete if score >= 80
        if (score < 80) {
            showToast(`Skor Anda ${score}. Capai minimal 80 untuk lulus. Ayo coba lagi!`, 'error');
            return;
        }

        const xpEarned = currentLesson.xpReward;
        const currentTCompleted = tProgress?.completed_lessons || [];
        const isFirstTime = !currentTCompleted.includes(currentLesson.id);
        const newCompleted = isFirstTime ? [...currentTCompleted, currentLesson.id] : currentTCompleted;
        const newExp = isFirstTime ? userData.exp + xpEarned : userData.exp;
        const newLevel = getLevelFromXP(newExp);
        const isLevelUp = newLevel > userData.level;

        // Snapshot untuk rollback (ARCH-04)
        const previousUserData = { ...userData };
        const previousTProgress = tProgress ? { ...tProgress } : null;

        // Optimistic Update
        setUserData({ ...userData, exp: newExp, level: newLevel, completed_lessons: newCompleted });
        setTProgress({ completed_lessons: newCompleted });

        try {
            // Database Update (Main User XP and Level)
            const { error: udErr } = await supabase.from('users_data').update({ exp: newExp, level: newLevel }).eq('id', session.user.id);
            if (udErr) throw udErr;
            
            // Update teacher progress
            if (activeTeacherId && isFirstTime) {
                const { error: tpErr } = await supabase.from('student_teacher_progress').update({
                    completed_lessons: newCompleted
                }).eq('student_id', session.user.id).eq('teacher_id', activeTeacherId);
                if (tpErr) throw tpErr;
            }
            
            if (isFirstTime) {
                await supabase.from('activity_logs').insert({
                    user_id: session.user.id,
                    username: userData.username,
                    action_type: 'lesson_complete',
                    details: { lesson_id: currentLesson.id, lesson_title: currentLesson.title, xp_earned: xpEarned } as any
                });
                showToast(`Selamat! Materi Selesai. +${xpEarned} XP`, 'success');
            } else {
                showToast(`Latihan Selesai! Skor: ${score}`, 'success');
            }

            if (isLevelUp) {
                await supabase.from('activity_logs').insert({
                    user_id: session.user.id,
                    username: userData.username,
                    action_type: 'level_up',
                    details: { new_level: newLevel } as any
                });
                showToast(`LEVEL UP! Kamu naik ke level ${newLevel}`, 'info');
            }
        } catch (err) {
            // Rollback optimistic update (ARCH-04)
            console.error('Gagal menyimpan progress pelajaran:', err);
            setUserData(previousUserData);
            setTProgress(previousTProgress);
            showToast('Progres gagal disimpan. Periksa koneksi internet dan coba lagi.', 'error');
        }
        
        setCurrentLesson(null);
    };

    if (currentLesson) {
        return <LessonView lesson={currentLesson} onComplete={handleLessonComplete} onExit={() => setCurrentLesson(null)} />;
    }

    if (showPosttest) {
        return <PosttestFlow onComplete={() => setShowPosttest(false)} onClose={() => setShowPosttest(false)} />;
    }

    if (showPretest && activeTeacherId && session?.user?.id) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-50 overflow-y-auto">
                <PretestRunner 
                   teacherId={activeTeacherId} 
                   studentId={session.user.id} 
                   onComplete={() => {
                       setShowPretest(false);
                       // Update tProgress to trigger re-render if necessary, though Pretest doesn't affect roadmap locks currently.
                       setTProgress(prev => prev ? { ...prev } : null);
                   }} 
                />
            </div>
        );
    }

    const currentCompletedLessons = activeTeacherId ? (tProgress?.completed_lessons || []) : (userData.completed_lessons || []);

    return (
        <UnitPath 
            units={CURRICULUM_DATA} 
            completedLessonIds={currentCompletedLessons} 
            onStartLesson={handleStartLesson} 
            onStartPosttest={() => setShowPosttest(true)} 
            onStartPretest={() => setShowPretest(true)}
        />
    );
};