# UML Activity Diagram - Aplikasi Logi Math
> Diagram ini menggambarkan keseluruhan alur aktivitas sistem.  
> **Pengecualian:** Alur Game Petualangan & Game Labirin tidak dimasukkan.  
> Dibuat berdasarkan analisis kode nyata: `App.tsx`, `PretestRunner.tsx`, `PosttestFlow.tsx`, `PracticeZone.tsx`, `TeacherDashboard.tsx`, `TeacherAnalysis.tsx`, dll.

---

```mermaid
flowchart TD
    START([🟢 Mulai]) --> OPEN_APP

    %% ============================================================
    %% FASE 0: INISIALISASI APLIKASI
    %% ============================================================
    subgraph SYS ["⚙️ Sistem / Frontend"]
        OPEN_APP["Buka Aplikasi (index.tsx)"]
        CHECK_SESSION["getSession() dari Supabase"]
        FATAL_ERR["Tampilkan Halaman\n'Koneksi Gagal'"]
        LOADING_SPINNER["Tampilkan Loading Spinner"]
        FETCH_USER["Fetch profil user\ndari tabel 'users_data'"]
        UPSERT_USER["Upsert baris user baru\n(fallback jika trigger DB gagal)"]
    end

    subgraph DB ["🗄️ Database (Supabase)"]
        DB_SESSION[("Validasi Session\n& JWT Token")]
        DB_USER[("Tabel: users_data")]
        DB_PROGRESS[("Tabel:\nstudent_teacher_progress")]
        DB_QUESTIONS[("Tabel: questions")]
        DB_ANSWERS[("Tabel: student_answers")]
        DB_ACTIVITY[("Tabel: activity_logs")]
        DB_FORUM[("Tabel: forum_messages")]
    end

    subgraph USER ["👤 Pengguna (Siswa / Guru)"]
        U_INPUT_CRED["Input Email & Password"]
        U_REGISTER["Isi Form Registrasi\n(username, role, kelas)"]
        U_SELECT_TEACHER["Pilih Guru dari Daftar"]
    end

    OPEN_APP --> CHECK_SESSION
    CHECK_SESSION -->|"Network Error"| FATAL_ERR
    FATAL_ERR --> RETRY_BTN["Klik Tombol 'Coba Lagi'"]
    RETRY_BTN --> OPEN_APP

    CHECK_SESSION -->|"Memuat..."| LOADING_SPINNER
    LOADING_SPINNER --> SESSION_EXISTS{"Sesi aktif\nterdeteksi?"}

    %% ============================================================
    %% FASE 1: AUTENTIKASI & OTORISASI
    %% ============================================================
    SESSION_EXISTS -->|"Tidak"| SHOW_LOGIN["Tampilkan Halaman Login"]
    SHOW_LOGIN --> AUTH_CHOICE{"Pilihan\nPengguna?"}
    AUTH_CHOICE -->|"Belum punya akun"| SHOW_REGISTER["Tampilkan Form Registrasi"]
    SHOW_REGISTER --> U_REGISTER
    U_REGISTER --> DB_SESSION
    DB_SESSION -->|"Registrasi OK"| SHOW_REG_SUCCESS["Tampilkan Halaman\n'Registrasi Berhasil'"]
    SHOW_REG_SUCCESS --> SHOW_LOGIN

    AUTH_CHOICE -->|"Login"| U_INPUT_CRED
    U_INPUT_CRED --> DB_SESSION
    DB_SESSION -->|"Kredensial Salah"| SHOW_AUTH_ERR["Tampilkan Pesan Error\n(toast / inline)"]
    SHOW_AUTH_ERR --> SHOW_LOGIN

    DB_SESSION -->|"Login Berhasil\n(kembalikan token)"| FETCH_USER
    SESSION_EXISTS -->|"Ya"| FETCH_USER

    FETCH_USER --> DB_USER
    DB_USER -->|"Baris tidak ada\n(trigger gagal)"| UPSERT_USER
    UPSERT_USER --> DB_USER
    DB_USER -->|"Data profil diterima"| CHECK_ROLE{"Cek Role\nPengguna"}

    %% ============================================================
    %% PERCABANGAN ROLE
    %% ============================================================
    CHECK_ROLE -->|"role = superadmin"| SUPERADMIN_DASH["Dashboard SuperAdmin\n(Kelola semua user & guru)"]
    CHECK_ROLE -->|"role = guru"| GURU_FLOW
    CHECK_ROLE -->|"role = siswa"| CHECK_TEACHER{"activeTeacherId\ntersimpan di state?"}

    %% ============================================================
    %% FASE SISWA: PEMILIHAN GURU (TeacherSelection)
    %% ============================================================
    CHECK_TEACHER -->|"Tidak / Null"| SHOW_TEACHER_SEL["Tampilkan Halaman\nPilih Guru"]
    SHOW_TEACHER_SEL --> DB_USER
    DB_USER -->|"Fetch semua user\nrole = 'guru'"| SHOW_TEACHER_LIST["Render Daftar Kartu Guru"]
    SHOW_TEACHER_LIST --> U_SELECT_TEACHER
    U_SELECT_TEACHER --> CHECK_STP{"Record di\nstudent_teacher_progress\nsudah ada?"}
    CHECK_STP -->|"Belum"| INSERT_STP["INSERT baris baru\nhas_completed_pretest: false\nhas_completed_posttest: false"]
    INSERT_STP --> DB_PROGRESS
    CHECK_STP -->|"Sudah"| SET_TEACHER_ID["Simpan teacherId\ndi AppContext State"]
    DB_PROGRESS --> SET_TEACHER_ID
    SET_TEACHER_ID --> SISWA_FLOW

    CHECK_TEACHER -->|"Ya"| SISWA_FLOW

    %% ============================================================
    %% FASE SISWA: DASHBOARD & ROUTING UTAMA
    %% ============================================================
    subgraph SISWA_FLOW ["🎒 Alur Utama Siswa"]

        direction TB
        STUDENT_DASH["Halaman Dashboard Siswa\n(StudentDashboard.tsx)\n• Tampilkan nama, Level, XP, Streak\n• Tampilkan progress bar XP ke level berikutnya\n• Fetch & tampilkan Aktivitas Teman (activity_logs)\n• Tampilkan banner 'Ruang Kelas Aktif' (nama guru)"]

        %% PRETEST GATE
        STUDENT_DASH --> FETCH_PROGRESS["Fetch student_teacher_progress\n(completed_lessons,\nhas_completed_posttest)"]
        FETCH_PROGRESS --> DB_PROGRESS
        DB_PROGRESS --> CHECK_PRETEST{"has_completed_pretest\n== true?"}

        %% PRETEST BELUM DIKERJAKAN
        CHECK_PRETEST -->|"Belum"| SHOW_PRETEST_MODAL["Tampilkan Modal Overlay\n'Tes Kemampuan Awal'\n(PretestFlow.tsx)"]

        subgraph PRETEST_FLOW ["📝 Alur Pre-Test (PretestRunner.tsx)"]
            direction TB
            PT_CHECK_DONE{"has_completed_pretest\ndi userData?"}
            PT_CHECK_DONE -->|"Sudah"| PT_ALREADY["Tampilkan Notif\n'Pre-test Sudah Dikerjakan'\n(tidak bisa diulang)"]
            PT_CHECK_DONE -->|"Belum"| PT_LOAD_LOCAL["Cek Local Storage\nuntuk jawaban tersimpan"]
            PT_LOAD_LOCAL --> PT_FETCH_Q["Fetch soal dari DB\n(category: 'pretest',\nteacher_id: activeTeacherId)"]
            PT_FETCH_Q --> DB_QUESTIONS
            DB_QUESTIONS -->|"Ada soal"| PT_SHOW_Q["Render Soal Satu-per-Satu\n(dengan progress bar)"]
            DB_QUESTIONS -->|"Soal kosong"| PT_FALLBACK["Gunakan Soal Fallback\n(FALLBACK_PRETEST)"]
            PT_FALLBACK --> PT_SHOW_Q
            PT_SHOW_Q --> PT_ANSWER["Siswa Memilih Opsi Jawaban"]
            PT_ANSWER --> PT_AUTOSAVE["Auto-Save Jawaban\nke Local Storage\n(storageKey: logimath_pretest_*)"]
            PT_AUTOSAVE --> PT_NEXT{"Soal\nTerakhir?"}
            PT_NEXT -->|"Belum"| PT_SHOW_NEXT["Tampilkan Soal Berikutnya\n(tombol Selanjutnya aktif\njika jawaban terisi)"]
            PT_SHOW_NEXT --> PT_ANSWER
            PT_NEXT -->|"Ya"| PT_CONFIRM_SUBMIT["Tampilkan Dialog Konfirmasi\n'Selesaikan Pre-test?\n(Tidak bisa diulang)'"]
            PT_CONFIRM_SUBMIT -->|"Batal"| PT_ANSWER
            PT_CONFIRM_SUBMIT -->|"Konfirmasi"| PT_CALC["Hitung Skor Akhir\n(benar/total × 100)"]
            PT_CALC --> PT_SAVE_DB["UPDATE student_teacher_progress\nhas_completed_pretest: true\npretest_score: finalScore"]
            PT_SAVE_DB --> DB_PROGRESS
            DB_PROGRESS --> PT_INSERT_ANS["INSERT semua jawaban\nke tabel student_answers\n(context: 'pretest')"]
            PT_INSERT_ANS --> DB_ANSWERS
            DB_ANSWERS --> PT_CLEAR_LS["Hapus data dari\nLocal Storage"]
            PT_CLEAR_LS --> PT_TOAST["Tampilkan Toast\n'Pre-test selesai! Skor: X'"]
            PT_TOAST --> PT_DONE(["Pre-test Selesai ✅"])
        end

        SHOW_PRETEST_MODAL --> PT_CHECK_DONE
        PT_DONE --> STUDENT_DASH

        %% MATERI TERBUKA
        CHECK_PRETEST -->|"Sudah"| ROADMAP_OPEN["Roadmap Materi Terbuka\n(Gembok hilang)"]
        ROADMAP_OPEN --> STUDENT_NAV{"Siswa Memilih\nMenu Navigasi"}

        %% ============================================================
        %% SUB-ALUR: MATERI (LearnWrapper -> LessonView)
        %% ============================================================
        STUDENT_NAV -->|"Klik 'Materi'\n(tab: learn)"| LEARN_VIEW["Halaman Materi\n(LearnWrapper / LessonView.tsx)"]
        LEARN_VIEW --> SHOW_UNITS["Tampilkan Roadmap\nUnit 1 & Unit 2\n(UnitPath.tsx)"]
        SHOW_UNITS --> SELECT_LESSON{"Siswa Pilih\nUnit/Lesson?"}
        SELECT_LESSON -->|"Pilih Lesson"| LOAD_LESSON["Muat Konten Materi Dinamis\n(teks, gambar, ilustrasi)"]
        LOAD_LESSON --> READ_MATERIAL["Siswa Membaca Materi"]

        READ_MATERIAL --> OPEN_VOLUMELAB{"Siswa Buka\nVolume Lab?"}
        OPEN_VOLUMELAB -->|"Ya"| VOLUMELAB["Fitur Volume Lab\n(VolumeLab.tsx)\n• Muat Alat Peraga 3D/Interaktif"]
        VOLUMELAB --> VL_INPUT["Siswa Input\nParameter/Angka"]
        VL_INPUT --> VL_RENDER["Sistem Render Perubahan\nVolume secara Real-Time"]
        VL_RENDER --> VL_EXPLORE{"Eksplorasi\nSelesai?"}
        VL_EXPLORE -->|"Lanjut"| VL_INPUT
        VL_EXPLORE -->|"Tutup Lab"| READ_MATERIAL

        OPEN_VOLUMELAB -->|"Tidak"| MARK_COMPLETE{"Siswa Tandai\nLesson Selesai?"}
        READ_MATERIAL --> MARK_COMPLETE
        MARK_COMPLETE -->|"Ya"| SAVE_LESSON["Simpan lesson_id ke\ncompleted_lessons (DB)"]
        SAVE_LESSON --> DB_PROGRESS
        DB_PROGRESS --> LOG_ACTIVITY["INSERT activity_logs\n(action: lesson_complete)"]
        LOG_ACTIVITY --> DB_ACTIVITY
        DB_ACTIVITY --> CHECK_ALL_DONE{"Semua Lesson\ndi Semua Unit\nSelesai?"}
        CHECK_ALL_DONE -->|"Belum"| SHOW_UNITS
        CHECK_ALL_DONE -->|"Ya (Semua Selesai)"| UNLOCK_POSTTEST["Buka Akses Post-test\n(isCourseCompleted = true)"]

        MARK_COMPLETE -->|"Kembali"| SHOW_UNITS

        %% ============================================================
        %% SUB-ALUR: ZONA LATIHAN (PracticeZone)
        %% ============================================================
        STUDENT_NAV -->|"Klik 'Ujian/Latihan'\n(tab: challenges)"| PRACTICE_INTRO["Halaman Zona Latihan\n(PracticeZone.tsx)\n• Intro: 5 soal/sesi, +50 XP/jawaban benar\n• Bonus +50 XP jika Perfect"]
        PRACTICE_INTRO --> PZ_START["Klik 'MULAI LATIHAN'"]
        PZ_START --> PZ_LOAD["Fetch Soal Adaptif\n(dari controller usePractice)"]
        PZ_LOAD --> PZ_SHOW["Tampilkan Soal\n(1 dari 5)"]
        PZ_SHOW --> PZ_SELECT["Siswa Pilih Opsi Jawaban"]
        PZ_SELECT --> PZ_CHECK_BTN["Klik 'PERIKSA JAWABAN'"]
        PZ_CHECK_BTN --> PZ_EVAL{"Jawaban\nBenar?"}
        PZ_EVAL -->|"Benar"| PZ_CORRECT["Tampilkan Feedback Hijau\n(+50 XP)"]
        PZ_EVAL -->|"Salah"| PZ_WRONG["Tampilkan Feedback Merah\n+ Tampilkan Pembahasan Soal"]
        PZ_CORRECT --> PZ_NEXT_Q{"Soal\nTerakhir?"}
        PZ_WRONG --> PZ_NEXT_Q
        PZ_NEXT_Q -->|"Belum"| PZ_SHOW
        PZ_NEXT_Q -->|"Ya"| PZ_FINISH["Hitung Total XP\n(+ Bonus Perfect jika semua benar)"]
        PZ_FINISH --> PZ_SAVE_XP["Update XP & Level\ndi tabel users_data"]
        PZ_SAVE_XP --> DB_USER
        DB_USER --> PZ_SUMMARY["Tampilkan Halaman Ringkasan\n(Skor, XP Diperoleh,\nBadge Perfect jika ada)"]
        PZ_SUMMARY --> STUDENT_DASH

        %% ============================================================
        %% SUB-ALUR: POST-TEST (PosttestFlow)
        %% ============================================================
        UNLOCK_POSTTEST --> STUDENT_NAV
        STUDENT_NAV -->|"Klik 'Pusat Evaluasi'\n(tab: tests)"| TEST_CENTER["Halaman Test Center\n(TestCenter.tsx)\n• Kartu Pre-test\n• Kartu Post-test"]
        TEST_CENTER --> PICK_TEST{"Siswa Pilih\nTes?"}
        PICK_TEST -->|"Mulai Post-test"| POST_CHECK{"has_completed_posttest\n== true?"}
        POST_CHECK -->|"Ya (Sudah)"| POST_ALREADY["Tampilkan Notif\n'Post-test Sudah Dikerjakan'\n(tidak bisa diulang)\n[Tombol: Kembali ke Beranda]"]
        POST_ALREADY --> STUDENT_DASH

        POST_CHECK -->|"Belum"| POST_CHECK_LS["Cek Local Storage\nuntuk progress tersimpan"]
        POST_CHECK_LS -->|"Ada data tersimpan"| POST_RESTORE["Restore state:\ncurrentIdx, answers, score\nFetch ulang soal dari DB by ID"]
        POST_RESTORE --> POST_QUIZ["Lanjut ke soal\nyang terakhir dibuka"]
        POST_CHECK_LS -->|"Tidak ada"| POST_INTRO["Tampilkan Halaman Intro\nPost-test (PosttestFlow.tsx)\n[Tombol: Keluar]"]
        POST_INTRO -->|"Klik 'Keluar'"| POST_CANCEL["Tutup Post-test\n(jawaban sudah di Local Storage)"]
        POST_CANCEL --> TEST_CENTER
        POST_INTRO -->|"Klik 'MULAI UJIAN'"| POST_LOAD["Fetch Soal Post-test\n(category: 'posttest'\nteacher_id: activeTeacherId, max 20 soal)\nSoal di-shuffle"]
        POST_LOAD --> DB_QUESTIONS
        DB_QUESTIONS --> POST_SAVE_LS_INIT["Simpan state awal\nke Local Storage\n(storageKey: logimath_posttest_*)"]
        POST_SAVE_LS_INIT --> POST_QUIZ

        POST_QUIZ --> POST_ANSWER["Siswa Memilih Jawaban"]
        POST_ANSWER --> POST_CHECK_ANS["Klik 'PERIKSA'"]
        POST_CHECK_ANS --> POST_EVAL{"Jawaban\nBenar?"}
        POST_EVAL -->|"Benar"| POST_CORRECT["Feedback Hijau\n+1 Skor\nTampilkan feedback opsi jika ada"]
        POST_EVAL -->|"Salah"| POST_WRONG["Feedback Merah\nTampilkan Jawaban Benar\n+ Pembahasan Soal (optionFeedback / explanation)"]
        POST_CORRECT --> POST_SAVE_LS["Auto-Save ke Local Storage\n(answers, currentIdx, score)"]
        POST_WRONG --> POST_SAVE_LS
        POST_SAVE_LS --> POST_NEXT_Q{"Soal\nTerakhir?"}
        POST_NEXT_Q -->|"Belum"| POST_QUIZ
        POST_NEXT_Q -->|"Ya"| POST_CALC["Hitung Skor Akhir:\n(skor/total) × 100"]
        POST_CALC --> POST_SAVE_DB["UPDATE student_teacher_progress\nhas_completed_posttest: true\nposttest_score: computedScore"]
        POST_SAVE_DB --> DB_PROGRESS
        DB_PROGRESS --> POST_LOG["INSERT activity_logs\n(action: posttest_complete)"]
        POST_LOG --> DB_ACTIVITY
        DB_ACTIVITY --> POST_INSERT_ANS["INSERT semua jawaban siswa\nke tabel student_answers\n(context: 'posttest', is_correct per soal)"]
        POST_INSERT_ANS --> DB_ANSWERS
        DB_ANSWERS --> POST_CLEAR_LS["Hapus Local Storage\n(storageKey)"]
        POST_CLEAR_LS --> POST_UPDATE_CTX["Update AppContext\n(has_completed_posttest: true)"]
        POST_UPDATE_CTX --> POST_RESULT["Tampilkan Halaman Hasil\n'Ujian Selesai!'\nSkor Akhir: XX"]
        POST_RESULT --> STUDENT_DASH

        %% ============================================================
        %% SUB-ALUR: LOGICHAT, LEADERBOARD, FORUM, PROFIL (SISWA)
        %% ============================================================
        STUDENT_NAV -->|"tab: chatbot"| LOGICHAT["LogiChat (AI Chatbot)\nSiswa Kirim Pertanyaan\nSistem Streaming Jawaban AI\n(Gemini API via gemini.ts)"]
        LOGICHAT --> STUDENT_NAV

        STUDENT_NAV -->|"tab: leaderboard"| LEADERBOARD_S["Halaman Leaderboard\nFetch & Render Ranking\nSemua Siswa berdasarkan XP"]
        LEADERBOARD_S --> STUDENT_NAV

        STUDENT_NAV -->|"tab: forum"| FORUM_S["Forum Diskusi (Siswa)\nLihat & Kirim Pesan\n(userRole: 'siswa')"]
        FORUM_S --> DB_FORUM
        DB_FORUM --> STUDENT_NAV

        STUDENT_NAV -->|"tab: profile"| PROFILE_S["Halaman Profil Siswa\n• Edit username, avatar\n• Ganti password"]
        PROFILE_S --> DB_USER
        DB_USER --> STUDENT_NAV

        STUDENT_NAV -->|"Klik 'Ganti Guru'"| LOGOUT_TEACHER["Reset activeTeacherId\ndi State (null)\nReload halaman"]
        LOGOUT_TEACHER --> CHECK_TEACHER

        STUDENT_NAV -->|"Klik 'Logout'"| DO_LOGOUT_S["supabase.auth.signOut()\nReset session & userData"]
    end

    %% ============================================================
    %% FASE GURU: DASHBOARD & SEMUA MENU GURU
    %% ============================================================
    subgraph GURU_FLOW ["👨‍🏫 Alur Utama Guru"]
        direction TB
        TEACHER_DASH["Dashboard Guru\n(TeacherDashboard.tsx)\n• Tampilkan Statistik:\n  - Total Siswa\n  - Game Aktif\n  - Rata-rata Level\n  - Total Diskusi\n• Tampilkan Activity Feed Terbaru"]

        TEACHER_DASH --> T_FETCH_STATS["Fetch Paralel dari DB:\n1. student_teacher_progress (ID siswa)\n2. users_data (level rata-rata)\n3. activity_logs (log terbaru)\n4. game_rooms (count aktif)\n5. forum_messages (count)"]
        T_FETCH_STATS --> DB_PROGRESS
        T_FETCH_STATS --> DB_USER
        T_FETCH_STATS --> DB_ACTIVITY
        DB_PROGRESS --> T_RENDER_STATS["Render Stat Cards\n& Activity Feed"]
        DB_USER --> T_RENDER_STATS
        DB_ACTIVITY --> T_RENDER_STATS

        T_RENDER_STATS --> GURU_NAV{"Guru Pilih\nMenu?"}

        %% --- MENU: ANALISIS ---
        GURU_NAV -->|"tab: analysis"| T_ANALYSIS["Halaman Analisis Jawaban\n(TeacherAnalysis.tsx)"]
        T_ANALYSIS --> T_FETCH_ANS["Fetch dari tabel student_answers\n(filter: teacher_id = guru)\nFetch dari student_teacher_progress\n(hitung jumlah siswa)"]
        T_FETCH_ANS --> DB_ANSWERS
        T_FETCH_ANS --> DB_PROGRESS
        DB_ANSWERS --> T_ANALYSIS_VIEW{"Guru Pilih\nTab Tampilan?"}
        T_ANALYSIS_VIEW -->|"Ringkasan Progres"| T_SUMMARY["Komponen StudentProgressSummary\n• Kartu per siswa\n• Status Pre-test & Post-test\n• Skor masing-masing"]
        T_ANALYSIS_VIEW -->|"Data Tabel Detail"| T_TABLE["Tabel Jawaban Real-Time\n(searchable)\n• Kolom: Siswa, Konteks, Soal,\n  Jawaban, Status (Benar/Salah), Waktu"]
        T_TABLE --> T_SEARCH["Guru Dapat Filter/Search\nberdasarkan nama, konteks, soal"]
        T_TABLE --> T_EXPORT["Klik 'Unduh Data (Excel)'\n→ Generate file .xlsx\nmenggunakan library SheetJS"]
        T_SUMMARY --> GURU_NAV
        T_TABLE --> GURU_NAV
        T_EXPORT --> GURU_NAV

        %% --- MENU: MANAJEMEN KONTEN ---
        GURU_NAV -->|"tab: content"| T_CONTENT["Manajemen Konten Soal\n(ContentManager.tsx)\n• CRUD soal Pre-test\n• CRUD soal Post-test\n• Editor soal (QuestionEditor.tsx)"]
        T_CONTENT --> DB_QUESTIONS
        DB_QUESTIONS --> GURU_NAV

        %% --- MENU: MANAJEMEN SISWA ---
        GURU_NAV -->|"tab: students"| T_STUDENTS["Manajemen Siswa\n(StudentManagement.tsx)\n• Lihat daftar siswa terdaftar\n• Lihat progress masing-masing siswa"]
        T_STUDENTS --> DB_PROGRESS
        DB_PROGRESS --> GURU_NAV

        %% --- MENU: STATISTIK ---
        GURU_NAV -->|"tab: statistics"| T_STATISTICS["Halaman Statistik\n(Statistics.tsx)\n• Grafik distribusi level\n• Rata-rata skor pre/post-test"]
        T_STATISTICS --> DB_USER
        DB_USER --> GURU_NAV

        %% --- MENU: LOG AKTIVITAS ---
        GURU_NAV -->|"tab: activities"| T_ACTLOGS["Log Aktivitas\n(ActivityLogManager.tsx)\n• Riwayat semua aktivitas siswa\n  (lesson_complete, level_up,\n   pretest_complete, posttest_complete)"]
        T_ACTLOGS --> DB_ACTIVITY
        DB_ACTIVITY --> GURU_NAV

        %% --- MENU: FORUM & PROFIL ---
        GURU_NAV -->|"tab: forum"| FORUM_G["Forum Diskusi (Guru)\nLihat & Balas Pesan Siswa\n(userRole: 'guru')"]
        FORUM_G --> DB_FORUM
        DB_FORUM --> GURU_NAV

        GURU_NAV -->|"tab: profile"| PROFILE_G["Profil Guru\n• Edit data\n• Ganti avatar & password\n• Isi nama Sekolah"]
        PROFILE_G --> DB_USER
        DB_USER --> GURU_NAV

        GURU_NAV -->|"Klik 'Logout'"| DO_LOGOUT_G["supabase.auth.signOut()\nReset session & userData"]
    end

    %% Sambungkan ke Guru Flow
    GURU_FLOW --> TEACHER_DASH

    %% Logout menuju akhir
    DO_LOGOUT_S --> SHOW_LOGIN
    DO_LOGOUT_G --> SHOW_LOGIN

    %% Style Nodes
    style START fill:#22c55e,color:#fff,stroke:#16a34a
    style FATAL_ERR fill:#ef4444,color:#fff,stroke:#dc2626
    style DB_SESSION fill:#6366f1,color:#fff,stroke:#4f46e5
    style DB_USER fill:#6366f1,color:#fff,stroke:#4f46e5
    style DB_PROGRESS fill:#6366f1,color:#fff,stroke:#4f46e5
    style DB_QUESTIONS fill:#6366f1,color:#fff,stroke:#4f46e5
    style DB_ANSWERS fill:#6366f1,color:#fff,stroke:#4f46e5
    style DB_ACTIVITY fill:#6366f1,color:#fff,stroke:#4f46e5
    style DB_FORUM fill:#6366f1,color:#fff,stroke:#4f46e5
    style PT_DONE fill:#22c55e,color:#fff,stroke:#16a34a
    style UNLOCK_POSTTEST fill:#f59e0b,color:#fff,stroke:#d97706
    style SUPERADMIN_DASH fill:#8b5cf6,color:#fff,stroke:#7c3aed
```

---

## Keterangan Swimlane / Aktor

| Aktor | Warna Node | Keterangan |
|---|---|---|
| **Pengguna (Siswa/Guru)** | Putih/Default | Aksi yang diinisiasi langsung oleh pengguna |
| **Sistem / Frontend** | Abu-abu (subgraph) | Logika React, state management, localStorage |
| **Database (Supabase)** | Ungu (#6366f1) | Operasi baca/tulis ke tabel Supabase |

## Tabel Database yang Terlibat

| Tabel | Digunakan Untuk |
|---|---|
| `users_data` | Profil, role, level, XP, streak, avatar |
| `student_teacher_progress` | Status pre-test/post-test, skor, completed_lessons per pasangan siswa-guru |
| `questions` | Soal pre-test & post-test (dibuat guru) |
| `student_answers` | Rekaman jawaban detail per soal (untuk analisis guru) |
| `activity_logs` | Log event: lesson_complete, pretest_complete, posttest_complete, level_up |
| `forum_messages` | Pesan diskusi antara siswa dan guru |

## Fitur yang TIDAK Dimasukkan (Sesuai Pengecualian)
- ❌ Game Petualangan (`AdventureWrapper` / `AdventureGame.tsx`)
- ❌ Game Labirin (`MazeWrapper` / `MazeGame.tsx`)
