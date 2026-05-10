import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../Button';
import { Eye, EyeOff, Lock, Mail, User, Loader2, GraduationCap } from 'lucide-react';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

/**
 * Komponen form registrasi untuk pengguna baru.
 * Menangani pembuatan akun baru menggunakan Supabase dan menyimpan data profil awal.
 * 
 * @param {RegisterProps} props - Properti komponen Register.
 * @param {() => void} props.onRegisterSuccess - Callback yang dipanggil saat registrasi berhasil.
 * @param {() => void} props.onSwitchToLogin - Callback untuk beralih ke tampilan login.
 * @returns {JSX.Element} Elemen form registrasi yang dirender.
 */
export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [role, setRole] = useState<'siswa' | 'guru'>('siswa');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('8');
  const [schoolName, setSchoolName] = useState(''); // Untuk guru
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  /**
   * SEC-07: Validasi username — hanya alphanumeric dan spasi, 3-30 karakter.
   */
  const isValidUsername = (name: string) => /^[a-zA-Z0-9\s]{3,30}$/.test(name.trim());

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // SEC-07: Validasi username
    if (!isValidUsername(username)) {
      setError("Nama pengguna hanya boleh mengandung huruf, angka, dan spasi. Minimal 3 dan maksimal 30 karakter.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok!");
      setLoading(false);
      return;
    }
    
    try {
      const classCode = role === 'guru' ? generateClassCode() : null;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            role: role,
            grade: role === 'siswa' ? grade : null,
            school_name: role === 'guru' ? schoolName : null,
            class_code: classCode
          }
        }
      });
      
      if (authError) {
        throw new Error(authError.message);
      }
      
      onRegisterSuccess();
    } catch (err: unknown) {
      console.error("Register Error:", err);
      const msg = err instanceof Error ? err.message : "Gagal mendaftar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-feather mb-2">Buat Akun</h1>
          <p className="text-slate-400 font-bold">Gabung Logi Math sekarang!</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${role === 'siswa' ? 'bg-white shadow-sm text-macaw' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setRole('siswa')}
          >
            Siswa
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${role === 'guru' ? 'bg-white shadow-sm text-feather' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setRole('guru')}
          >
            Guru
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-cardinal text-sm font-bold rounded-xl border-2 border-red-100 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-macaw focus:ring-0 outline-none transition-all font-bold text-slate-700 placeholder-slate-400" placeholder="Nama Pengguna" />
            </div>
          </div>
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-macaw focus:ring-0 outline-none transition-all font-bold text-slate-700 placeholder-slate-400" placeholder="Alamat Surel" />
            </div>
          </div>
          
          {role === 'siswa' ? (
            <div>
               <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <select 
                      value={grade} 
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-macaw focus:ring-0 outline-none transition-all font-bold text-slate-700 appearance-none"
                  >
                      <option value="7">Kelas 7 SMP</option>
                      <option value="8">Kelas 8 SMP</option>
                      <option value="9">Kelas 9 SMP</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs font-bold">▼</div>
               </div>
            </div>
          ) : (
            <div>
               <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input type="text" required value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-macaw focus:ring-0 outline-none transition-all font-bold text-slate-700 placeholder-slate-400" placeholder="Nama Sekolah" />
               </div>
               <p className="text-xs text-slate-400 mt-2 ml-2 font-bold">* Kode Kelas otomatis akan digenerate</p>
            </div>
          )}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type={showPassword ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:border-macaw focus:ring-0 outline-none transition-all font-bold text-slate-700 placeholder-slate-400" placeholder="Kata Sandi" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type={showPassword ? 'text' : 'password'} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl focus:ring-0 outline-none transition-all font-bold text-slate-700 placeholder-slate-400 ${password && confirmPassword && password !== confirmPassword ? 'border-cardinal' : 'border-slate-200 focus:border-macaw'}`} placeholder="Konfirmasi Kata Sandi" />
            </div>
            {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-cardinal font-bold mt-1 ml-2">Kata sandi tidak cocok</p>
            )}
          </div>
          <Button type="submit" variant="primary" className="w-full" size="lg" disabled={loading || (password !== confirmPassword)}>
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : 'BUAT AKUN'}
          </Button>
        </form>
        <div className="mt-8 text-center text-sm font-bold text-slate-400">
          Sudah punya akun?{' '}
          <button onClick={onSwitchToLogin} className="text-macaw hover:text-macaw-light uppercase tracking-wide">
            MASUK
          </button>
        </div>
      </div>
    </div>
  );
};