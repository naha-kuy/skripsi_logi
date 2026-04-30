import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { UserData } from '../../models/types';
import { Loader2, LogOut } from 'lucide-react';
import { Avatar } from '../shared/Avatar';

interface TeacherSelectionProps {
  onSelectTeacher: (teacherId: string) => void;
  onLogout: () => void;
  currentUserId: string;
}

export const TeacherSelection: React.FC<TeacherSelectionProps> = ({ onSelectTeacher, onLogout, currentUserId }) => {
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<Partial<UserData>[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Get all users with role 'guru'
      const { data, error: err } = await supabase
        .from('users_data')
        .select('id, username, school_name, avatar_config')
        .eq('role', 'guru');
        
      if (err) throw err;
      
      setTeachers(data || []);
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      setError("Gagal memuat profil guru.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [currentUserId]);

  const handleSelect = async (teacherId: string) => {
    try {
        setLoading(true);
        // Ensure student_teacher_progress exists
        const { data } = await supabase
            .from('student_teacher_progress')
            .select('id')
            .eq('student_id', currentUserId)
            .eq('teacher_id', teacherId)
            .maybeSingle();

        if (!data) {
             await supabase.from('student_teacher_progress').insert({
                 student_id: currentUserId,
                 teacher_id: teacherId,
                 has_completed_pretest: false,
                 pretest_score: 0,
                 has_completed_posttest: false,
                 posttest_score: 0,
             });
        }
        
        onSelectTeacher(teacherId);
    } catch(err) {
        console.error("Failed to select teacher:", err);
        setError("Gagal memilih kelas guru.");
        setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
         <Loader2 className="animate-spin text-macaw" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      
      {/* Header */}
      <div className="p-6 flex justify-between items-center bg-slate-900">
        <h1 className="text-3xl font-extrabold text-macaw tracking-tight">LOGI MATH</h1>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 font-bold transition-all"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col">
        <h2 className="text-4xl text-center font-bold mb-12 text-slate-100">Siapa guru yang ingin Anda pilih?</h2>
        
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500 rounded-2xl text-center text-red-200 w-full max-w-md mx-auto">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          
          {teachers.map((teacher: Partial<UserData>) => (
              <button 
                key={teacher.id}
                onClick={() => handleSelect(teacher.id!)}
                className="flex flex-col items-center group transition-all"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-slate-800 flex items-center justify-center border-4 border-transparent group-hover:border-white transition-all overflow-hidden mb-4 shadow-xl">
                  {teacher.avatar_config ? (
                    <Avatar config={teacher.avatar_config} className="w-full h-full scale-110" />
                  ) : (
                    <div className="w-full h-full bg-macaw flex items-center justify-center text-4xl font-bold">
                       {teacher.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-slate-400 group-hover:text-white font-bold text-xl transition-colors">
                  {teacher.username}
                </span>
                <span className="text-slate-500 text-sm font-semibold">
                  {teacher.school_name || 'Guru'}
                </span>
              </button>
          ))}
          
          {teachers.length === 0 && !loading && (
             <div className="text-slate-500 font-bold text-xl mt-8 text-center w-full">
                Belum ada profil guru yang tersedia saat ini.
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
