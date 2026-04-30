-- ============================================================================
-- MASTER DB SETUP - LOGI MATH (MULTI-TEACHER ARCHITECTURE)
-- ============================================================================
-- DIAGNOSA DAN OPTIMASI OLEH SENIOR DATABASE ENGINEER
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. FUNCTION: Auto Update Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- MIGRATION BLOCK: Menambahkan kolom yang mungkin belum ada di tabel lama
-- (Ini memastikan script tidak akan gagal di database yang sudah berjalan)
DO $$
BEGIN
  -- Tabel Questions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'questions') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'option_feedback') THEN
        ALTER TABLE public.questions ADD COLUMN option_feedback JSONB DEFAULT '{}'::jsonb;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'teacher_id') THEN
        ALTER TABLE public.questions ADD COLUMN teacher_id UUID;
      END IF;
  END IF;
  
  -- Tabel Users Data
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users_data') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users_data' AND column_name = 'class_code') THEN
        ALTER TABLE public.users_data ADD COLUMN class_code TEXT UNIQUE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users_data' AND column_name = 'school_name') THEN
        ALTER TABLE public.users_data ADD COLUMN school_name TEXT;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users_data' AND column_name = 'is_active') THEN
        ALTER TABLE public.users_data ADD COLUMN is_active BOOLEAN DEFAULT true;
      END IF;
  END IF;
  
  -- Tabel Student Teacher Progress
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_teacher_progress') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_teacher_progress' AND column_name = 'teacher_id') THEN
        ALTER TABLE public.student_teacher_progress ADD COLUMN teacher_id UUID;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'student_teacher_progress' AND column_name = 'updated_at') THEN
        ALTER TABLE public.student_teacher_progress ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
      END IF;
  END IF;
  
  -- Tabel Game Rooms, Activity Logs, Forum Messages
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'game_rooms') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'game_rooms' AND column_name = 'teacher_context_id') THEN
        ALTER TABLE public.game_rooms ADD COLUMN teacher_context_id UUID;
      END IF;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activity_logs' AND column_name = 'teacher_context_id') THEN
        ALTER TABLE public.activity_logs ADD COLUMN teacher_context_id UUID;
      END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_messages') THEN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forum_messages' AND column_name = 'teacher_context_id') THEN
        ALTER TABLE public.forum_messages ADD COLUMN teacher_context_id UUID;
      END IF;
  END IF;
END $$;


-- ============================================================================
-- 1. USERS DATA (Extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users_data (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    role TEXT CHECK (role IN ('siswa', 'guru', 'admin', 'superadmin')) DEFAULT 'siswa',
    grade TEXT DEFAULT '8',
    is_active BOOLEAN DEFAULT true,
    
    -- Progress & Gamification (Global/Legacy)
    level INTEGER DEFAULT 1,
    exp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_login TIMESTAMPTZ DEFAULT NOW(),
    avatar_config JSONB DEFAULT '{"accessory":"none","color":"yellow","eyes":"normal","mouth":"smile"}'::jsonb,
    
    completed_lessons TEXT[] DEFAULT '{}',
    has_completed_pretest BOOLEAN DEFAULT false,
    pretest_score INTEGER DEFAULT 0,
    has_completed_posttest BOOLEAN DEFAULT false,
    posttest_score INTEGER DEFAULT 0,
    
    -- Guru Specific
    class_code TEXT UNIQUE,
    school_name TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraint FK auth.users (Dibuat aman agar tidak error)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = 'id') THEN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_data_id_fkey') THEN
      ALTER TABLE public.users_data DROP CONSTRAINT users_data_id_fkey;
    END IF;
    ALTER TABLE public.users_data ADD CONSTRAINT users_data_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users_data(role);
CREATE INDEX IF NOT EXISTS idx_users_class_code ON public.users_data(class_code); -- OPTIMASI: Percepat pencarian kelas

-- ============================================================================
-- 2. STUDENT TEACHER PROGRESS (Koneksi Murid & Guru)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.student_teacher_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    
    has_completed_pretest BOOLEAN DEFAULT false,
    pretest_score INTEGER DEFAULT 0,
    
    has_completed_posttest BOOLEAN DEFAULT false,
    posttest_score INTEGER DEFAULT 0,
    
    completed_lessons TEXT[] DEFAULT '{}',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(), -- OPTIMASI: Ditambahkan untuk melacak pembaruan skor
    UNIQUE(student_id, teacher_id)
);
CREATE INDEX IF NOT EXISTS idx_stp_student ON public.student_teacher_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_stp_teacher ON public.student_teacher_progress(teacher_id); -- OPTIMASI: Percepat load dashboard guru

-- ============================================================================
-- 3. QUESTIONS (Bank Soal Buatan Guru)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    category TEXT CHECK (category IN ('pretest', 'posttest', 'lesson', 'game')),
    lesson_id TEXT,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    option_feedback JSONB DEFAULT '{}'::jsonb,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_questions_teacher on public.questions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_questions_category on public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_lesson on public.questions(lesson_id); -- OPTIMASI: Percepat query soal per bab

-- ============================================================================
-- 4. STATIC / GLOBAL RESOURCES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.units (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'bg-ocean',
    order_index INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    order_index INTEGER NOT NULL
);

-- ============================================================================
-- 5. ACTIVITY & FORUM
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    teacher_context_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activity_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_teacher ON public.activity_logs(teacher_context_id); -- OPTIMASI

CREATE TABLE IF NOT EXISTS public.forum_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_ai_response BOOLEAN DEFAULT false,
    parent_id UUID REFERENCES public.forum_messages(id) ON DELETE CASCADE,
    teacher_context_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_forum_teacher ON public.forum_messages(teacher_context_id); -- OPTIMASI

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. MULTIPLAYER GAMES (Labirin & Petualangan)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('waiting', 'playing', 'finished')) DEFAULT 'waiting',
    game_type TEXT CHECK (game_type IN ('maze', 'adventure')),
    teacher_context_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_games_teacher ON public.game_rooms(teacher_context_id); -- OPTIMASI
CREATE INDEX IF NOT EXISTS idx_games_status ON public.game_rooms(status); -- OPTIMASI

CREATE TABLE IF NOT EXISTS public.game_participants (
    room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'disconnected', 'finished')) DEFAULT 'active',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(), -- OPTIMASI: Track kapan skor terakhir update
    PRIMARY KEY (room_id, user_id)
);

-- ============================================================================
-- 7. STUDENT ANSWERS (Track Detail Jawaban Siswa per Soal)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.student_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.users_data(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE SET NULL,
    context TEXT NOT NULL, -- 'pretest', 'posttest', 'u1l1', dll
    question_text TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_student_answers_student ON public.student_answers(student_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_teacher ON public.student_answers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_student_answers_context ON public.student_answers(context); -- OPTIMASI: Analisis berdasarkan bab


-- ============================================================================
-- TRIGGERS (Auto-update updated_at)
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_users_data_updated ON public.users_data;
CREATE TRIGGER trigger_users_data_updated BEFORE UPDATE ON public.users_data FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trigger_questions_updated ON public.questions;
CREATE TRIGGER trigger_questions_updated BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trigger_game_rooms_updated ON public.game_rooms;
CREATE TRIGGER trigger_game_rooms_updated BEFORE UPDATE ON public.game_rooms FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trigger_stp_updated ON public.student_teacher_progress;
CREATE TRIGGER trigger_stp_updated BEFORE UPDATE ON public.student_teacher_progress FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trigger_game_participants_updated ON public.game_participants;
CREATE TRIGGER trigger_game_participants_updated BEFORE UPDATE ON public.game_participants FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- Trigger to handle new users from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_data (
      id, 
      email, 
      username, 
      role, 
      grade,
      class_code,
      school_name,
      is_active
  )
  VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'siswa'),
      COALESCE(NEW.raw_user_meta_data->>'grade', '8'),
      NEW.raw_user_meta_data->>'class_code',
      NEW.raw_user_meta_data->>'school_name',
      true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================================
ALTER TABLE public.users_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_teacher_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Fungsi bantuan untuk mengecek apakah user login adalah superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users_data WHERE id = auth.uid() AND role = 'superadmin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Fungsi untuk Superadmin agar bisa menghapus akun secara permanen (termasuk dari auth.users)
CREATE OR REPLACE FUNCTION public.delete_user_by_superadmin(target_user_id UUID)
RETURNS void AS $$
BEGIN
  IF NOT public.is_superadmin() THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya superadmin yang dapat menghapus akun.';
  END IF;

  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. users_data 
DROP POLICY IF EXISTS "Public users are viewable by everyone." ON public.users_data;
CREATE POLICY "Public users are viewable by everyone." ON public.users_data FOR SELECT USING (true); -- AMAN, data profil dasar.

DROP POLICY IF EXISTS "Users can update own profile." ON public.users_data;
CREATE POLICY "Users can update own profile." ON public.users_data FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Superadmin bypass on users_data" ON public.users_data;
CREATE POLICY "Superadmin bypass on users_data" ON public.users_data FOR ALL USING (public.is_superadmin());

-- 2. student_teacher_progress 
DROP POLICY IF EXISTS "Teachers can view own student progress" ON public.student_teacher_progress;
CREATE POLICY "Teachers can view own student progress" ON public.student_teacher_progress FOR SELECT USING (auth.uid() = teacher_id OR auth.uid() = student_id);

DROP POLICY IF EXISTS "Anyone can insert progress (student joins)" ON public.student_teacher_progress;
CREATE POLICY "Anyone can insert progress (student joins)" ON public.student_teacher_progress FOR INSERT WITH CHECK (auth.uid() = student_id); -- REVISED: Hanya siswa login yang bisa insert untuk dirinya sendiri.

DROP POLICY IF EXISTS "Students and teachers can update progress" ON public.student_teacher_progress;
CREATE POLICY "Students and teachers can update progress" ON public.student_teacher_progress FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = teacher_id);

-- 3. questions 
DROP POLICY IF EXISTS "Anyone can read questions" ON public.questions;
CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Teachers can manage own questions" ON public.questions;
CREATE POLICY "Teachers can manage own questions" ON public.questions FOR ALL USING (auth.uid() = teacher_id);

-- 4. Units & Lessons (Static data)
DROP POLICY IF EXISTS "Anyone can read units" ON public.units;
CREATE POLICY "Anyone can read units" ON public.units FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read lessons" ON public.lessons;
CREATE POLICY "Anyone can read lessons" ON public.lessons FOR SELECT USING (true);

-- 5. Activity Logs & Forum
DROP POLICY IF EXISTS "Activity logs viewable by relevant teacher or user" ON public.activity_logs;
CREATE POLICY "Activity logs viewable by relevant teacher or user" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id OR auth.uid() = teacher_context_id); -- REVISED: Jangan buka public, lindungi log aktivitas.

DROP POLICY IF EXISTS "Users can insert logs" ON public.activity_logs;
CREATE POLICY "Users can insert logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Forum readable by context" ON public.forum_messages;
CREATE POLICY "Forum readable by context" ON public.forum_messages FOR SELECT USING (true); -- Forum memang publik di kelas.

DROP POLICY IF EXISTS "Authenticated users can insert forum" ON public.forum_messages;
CREATE POLICY "Authenticated users can insert forum" ON public.forum_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only teachers can delete forum messages" ON public.forum_messages;
CREATE POLICY "Only teachers can delete forum messages" ON public.forum_messages FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users_data WHERE id = auth.uid() AND role = 'guru')
);

DROP POLICY IF EXISTS "Anyone can read settings" ON public.system_settings;
CREATE POLICY "Anyone can read settings" ON public.system_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only teachers can modify settings" ON public.system_settings;
CREATE POLICY "Only teachers can modify settings" ON public.system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users_data WHERE id = auth.uid() AND role IN ('guru', 'superadmin'))
);

-- 6. Game 
DROP POLICY IF EXISTS "Game rooms readable by all" ON public.game_rooms;
CREATE POLICY "Game rooms readable by all" ON public.game_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create rooms" ON public.game_rooms;
CREATE POLICY "Users can create rooms" ON public.game_rooms FOR INSERT WITH CHECK (auth.uid() = host_id);

DROP POLICY IF EXISTS "Host can update room" ON public.game_rooms;
CREATE POLICY "Host can update room" ON public.game_rooms FOR UPDATE USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Participants readable by all" ON public.game_participants;
CREATE POLICY "Participants readable by all" ON public.game_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join games" ON public.game_participants;
CREATE POLICY "Users can join games" ON public.game_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Participants can update own score" ON public.game_participants;
CREATE POLICY "Participants can update own score" ON public.game_participants FOR UPDATE USING (auth.uid() = user_id);

-- 7. Student Answers
DROP POLICY IF EXISTS "Teachers can view answers of their students" ON public.student_answers;
CREATE POLICY "Teachers can view answers of their students" ON public.student_answers FOR SELECT USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Students can insert their own answers" ON public.student_answers;
CREATE POLICY "Students can insert their own answers" ON public.student_answers FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Superadmin Bypass untuk semua tabel utama yang butuh kontrol penuh
DROP POLICY IF EXISTS "Superadmin bypass on student_teacher_progress" ON public.student_teacher_progress;
CREATE POLICY "Superadmin bypass on student_teacher_progress" ON public.student_teacher_progress FOR ALL USING (public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin bypass on questions" ON public.questions;
CREATE POLICY "Superadmin bypass on questions" ON public.questions FOR ALL USING (public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin bypass on activity_logs" ON public.activity_logs;
CREATE POLICY "Superadmin bypass on activity_logs" ON public.activity_logs FOR ALL USING (public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin bypass on student_answers" ON public.student_answers;
CREATE POLICY "Superadmin bypass on student_answers" ON public.student_answers FOR ALL USING (public.is_superadmin());
