import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './services/supabase'; 
import { AppProvider, useAppContext } from './lib/AppContext';
import { Sidebar } from './components/shared/Sidebar';
import { StudentDashboard } from './components/siswa/StudentDashboard'; 
import { Login } from './components/shared/Auth/Login';
import { Register } from './components/shared/Auth/Register';
import { RegisterSuccess } from './components/shared/Auth/RegisterSuccess';
import { StudentManagement } from './components/guru/StudentManagement';
import { GameMonitor } from './components/guru/GameMonitor';
import { Statistics } from './components/guru/Statistics';
import { ActivityLogManager } from './components/guru/ActivityLogManager'; 
import { TeacherDashboard } from './components/guru/TeacherDashboard';
import { ContentManager } from './components/guru/ContentManager';
import { Forum } from './components/shared/Forum';
import { Profile } from './components/shared/Profile';
import { Leaderboard } from './components/shared/Leaderboard';
import { LogiChat } from './components/siswa/LogiChat'; 
import { PretestRunner } from './components/siswa/PretestRunner';
import { LearnWrapper } from './views/student/GameWrappers';
import { PracticeZone } from './views/student/PracticeZone'; 
import { TestCenter } from './components/siswa/TestCenter';
import { TeacherAnalysis } from './components/guru/TeacherAnalysis';
import { StudentProgressSummary } from './components/guru/StudentProgressSummary';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { CURRICULUM_DATA } from './data/curriculum'; 
import { GlobalModal } from './components/shared/GlobalModal'; 
import { TeacherSelection } from './components/siswa/TeacherSelection';
import { Menu, Loader2, XCircle, CheckCircle, Info } from 'lucide-react';

// PERF-02: Lazy load komponen game berbasis Three.js (~600KB) agar tidak dimuat di awal
// Hanya di-load saat user benar-benar membuka halaman game
const MazeWrapper = lazy(() =>
  import('./views/student/GameWrappers').then(m => ({ default: m.MazeWrapper }))
);
const AdventureWrapper = lazy(() =>
  import('./views/student/GameWrappers').then(m => ({ default: m.AdventureWrapper }))
);

// Fallback loader untuk Suspense
const GameLoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
    <Loader2 className="animate-spin" size={48} />
    <p className="font-bold text-lg tracking-wide">Memuat Game...</p>
  </div>
);

// --- TOAST COMPONENT (Shared UI) ---
const ToastDisplay = () => {
  const { toast } = useAppContext();
  if (!toast) return null;

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: <CheckCircle className="text-white" size={20} />,
    error: <XCircle className="text-white" size={20} />,
    info: <Info className="text-white" size={20} />
  };

  return (
    <div className={`fixed top-4 right-4 z-[1100] flex items-center gap-3 px-6 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 ${bgColors[toast.type]}`}>
      {icons[toast.type]}
      <span className="text-white font-bold text-sm">{toast.message}</span>
    </div>
  );
};

// --- MAIN CONTROLLER COMPONENT ---
export const AppContent: React.FC = () => {
  const { session, userData, isLoading, activeTeacherId, setActiveTeacherId, setSession, setUserData, setLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState(() => {
    return window.location.pathname.slice(1) || 'dashboard';
  });
  const [authView, setAuthView] = useState<'login' | 'register' | 'success'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);

  // Sync state dengan URL (pushState)
  useEffect(() => {
    const currentPath = window.location.pathname.slice(1);
    if (currentPath !== activeTab) {
      window.history.pushState({}, '', `/${activeTab}`);
    }
  }, [activeTab]);

  // Handle tombol back/forward di browser
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1);
      setActiveTab(path || 'dashboard');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initial Auth Check
  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id, session);
      else setLoading(false);
    }).catch((error: unknown) => {
      console.error("Error getting session:", error);
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Failed to fetch')) {
         setFatalError("Gagal terhubung ke Supabase (Failed to fetch). Pastikan URL ini dimasukkan ke dalam daftar CORS (Settings -> API) di dashboard Supabase Anda, atau cek koneksi internet.");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id, session);
      else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [studentProgress, setStudentProgress] = useState<import('./models/types').StudentTeacherProgress | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const isSiswaHook = userData?.role?.toLowerCase() !== 'guru';

  useEffect(() => {
    if (isSiswaHook && activeTeacherId) {
       const fetchTeacherProgress = async () => {
         try {
           const { data, error } = await supabase.from('student_teacher_progress')
             .select('*')
             .eq('student_id', userData?.id)
             .eq('teacher_id', activeTeacherId)
             .single();
           if(error) throw error;
           if(data) setStudentProgress(data);
         } catch(err) {
           console.log(err)
         }
       }
       fetchTeacherProgress();
    }
  }, [userData?.id, activeTeacherId, fetchTrigger]);

  const fetchUserData = async (userId: string, sessionObj?: typeof session) => {
    try {
      let { data, error } = await supabase.from('users_data').select('*').eq('id', userId).single();
      
      if (error && error.code === 'PGRST116') {
        // Fallback: If trigger failed to create the row, we force create it from client
        const email = sessionObj?.user?.email || '';
        const meta = sessionObj?.user?.user_metadata || {};
        const { data: newData, error: insertError } = await supabase.from('users_data').upsert({
          id: userId,
          email: email,
          username: meta.username || email.split('@')[0] || 'User',
          role: meta.role || 'siswa',
          grade: meta.grade || '8'
        }).select().single();
        
        if (!insertError && newData) {
          data = newData;
          error = null as unknown as typeof error;
        }
      }

      if (error) {
        if (error.message?.includes('Failed to fetch')) {
          setFatalError("Gagal terhubung ke Supabase (Failed to fetch). Pastikan URL ini ditaruh di CORS/Whitelist. Atau ini mungkin masalah jaringan.");
        }
        throw error;
      }
      if (data) setUserData(data);
    } catch (error: unknown) {
      console.error("Error fetching user data:", error);
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Failed to fetch')) {
         setFatalError("Gagal terhubung ke Supabase (Failed to fetch). Pastikan koneksi jaringan stabil atau URL ini masuk daftar CORS Supabase.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserData(null);
    setAuthView('login');
    setActiveTab('dashboard');
  };

  if (fatalError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg border-2 border-red-200">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Koneksi Gagal</h2>
          <p className="text-slate-600 mb-6 font-medium">{fatalError}</p>
          <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md">Coba Lagi</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-feather" size={48} />
      </div>
    );
  }

  // --- AUTH FLOW ---
  if (!session || !userData) {
    if (authView === 'login') return <Login onLoginSuccess={() => setActiveTab('dashboard')} onSwitchToRegister={() => setAuthView('register')} />;
    if (authView === 'register') return <Register onRegisterSuccess={() => setAuthView('success')} onSwitchToLogin={() => setAuthView('login')} />;
    if (authView === 'success') return <RegisterSuccess onGoToLogin={() => setAuthView('login')} />;
    return <Login onLoginSuccess={() => setActiveTab('dashboard')} onSwitchToRegister={() => setAuthView('register')} />;
  }

  const isSiswa = userData?.role?.toLowerCase() === 'siswa';

  // SISWA: INTERCEPT WITH TEACHER SELECTION
  if (isSiswa && !activeTeacherId) {
    return (
      <TeacherSelection 
         currentUserId={userData.id} 
         onSelectTeacher={setActiveTeacherId}
         onLogout={handleLogout}
      />
    );
  }

  // --- CONTENT ROUTING ---
  const renderContent = () => {
    if (userData.role?.toLowerCase() === 'superadmin') {
         switch(activeTab) {
             case 'superadmin': return <SuperAdminDashboard userData={userData} />;
             case 'profile': return <Profile userData={userData} onUpdate={() => fetchUserData(userData.id)} />;
             default: return <SuperAdminDashboard userData={userData} />;
         }
    } else if (userData.role?.toLowerCase() === 'guru') {
       switch(activeTab) {
           case 'dashboard': return <TeacherDashboard onNavigate={setActiveTab} />; // New Overview
           case 'content': return <ContentManager />;
           case 'students': return <StudentManagement />;
           case 'analysis': return <TeacherAnalysis />;
           case 'activities': return <ActivityLogManager />; 
           case 'games': return <GameMonitor />;
           case 'statistics': return <Statistics />;
           case 'leaderboard': return <Leaderboard />; 
           case 'forum': return <Forum currentUserId={userData.id} userRole="guru" />;
           case 'profile': return <Profile userData={userData} onUpdate={() => fetchUserData(userData.id)} />;
           default: return <TeacherDashboard onNavigate={setActiveTab} />;
       }
    } else {
        // SISWA ROUTING
        switch(activeTab) {
            case 'dashboard': return <StudentDashboard userData={userData} units={CURRICULUM_DATA} onNavigate={setActiveTab} />;
            case 'learn': return <LearnWrapper userData={userData} />;
            case 'chatbot': return <LogiChat />;
            case 'maze': return (
              <Suspense fallback={<GameLoadingFallback />}>
                <MazeWrapper userData={userData} onBack={() => setActiveTab('dashboard')} />
              </Suspense>
            );
            case 'adventure': return (
              <Suspense fallback={<GameLoadingFallback />}>
                <AdventureWrapper userData={userData} onBack={() => setActiveTab('dashboard')} />
              </Suspense>
            );
            case 'challenges': return <PracticeZone userData={userData} onBack={() => setActiveTab('dashboard')} />; 
            case 'tests': return <TestCenter onNavigate={setActiveTab} />;
            case 'leaderboard': return <Leaderboard />;
            case 'forum': return <Forum currentUserId={userData.id} userRole="siswa" />;
            case 'profile': return <Profile userData={userData} onUpdate={() => fetchUserData(userData.id)} />;
            default: return <StudentDashboard userData={userData} units={CURRICULUM_DATA} onNavigate={setActiveTab} />;
        }
    }
  };

  // Check if we are in a fullscreen game mode
  const isFullScreenGame = ['maze', 'adventure', 'challenges', 'tests'].includes(activeTab);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700 flex">
        <ToastDisplay />
        <GlobalModal /> {/* Mount Global Modal Here */}
        
        {/* HIDE SIDEBAR ON FULLSCREEN GAMES */}
        {!isFullScreenGame && (
          <Sidebar 
              userData={userData} 
              activeTab={activeTab} 
              onNavigate={setActiveTab}
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              onLogout={handleLogout}
          />
        )}

        <main className={`flex-1 relative overflow-x-hidden min-h-screen transition-all duration-300 ${isFullScreenGame ? 'p-0' : 'p-6 lg:p-8'}`}>
            {/* Mobile Header (Hide on Fullscreen Game) */}
            {!isFullScreenGame && (
              <div className="md:hidden p-4 bg-white border-b-2 border-slate-200 flex items-center gap-3 sticky top-0 z-10">
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg"><Menu size={20} /></button>
                  <span className="font-extrabold text-feather text-lg">Logi Math</span>
              </div>
            )}

            {renderContent()}
        </main>
    </div>
  );
};

// --- ERROR BOUNDARY (ARCH-03) ---
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg border-2 border-red-200">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Terjadi Kesalahan</h2>
            <p className="text-slate-600 mb-2 font-medium">Komponen mengalami error tak terduga.</p>
            <p className="text-xs text-slate-400 font-mono mb-6">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md">Muat Ulang</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </ErrorBoundary>
);

export default App;