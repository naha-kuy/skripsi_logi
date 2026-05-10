# 🔬 Audit UI/UX v2 — Optimalisasi Desain Minimalis (Post-Flattening)
### Platform: Logi Math | Tanggal: 10 Mei 2026

> **Status**: Laporan observasi dan rekomendasi. **Tidak ada perubahan kode yang dilakukan.**
> Perubahan hanya akan dilaksanakan setelah persetujuan eksplisit.

> **Catatan**: Audit v1 telah diimplementasikan sebagian — `border-b-4` telah dihapus dari seluruh komponen. Laporan ini mengevaluasi **state terkini** setelah perubahan tersebut.

---

## Daftar Isi

1. [Layout & Komposisi](#1-layout--komposisi)
2. [Sistem Warna](#2-sistem-warna)
3. [Tipografi & Copywriting](#3-tipografi--copywriting)
4. [Eksplorasi Mandiri](#4-eksplorasi-mandiri)
5. [Prioritas Implementasi](#5-prioritas-implementasi)

---

## 1. Layout & Komposisi

### 1.1 Margin Halaman Tidak Konsisten

Setiap halaman mengatur `max-width` dan `padding` sendiri-sendiri. **Tidak ada wrapper universal** yang memastikan margin konsisten.

| Halaman | max-width | Padding | File |
|---|---|---|---|
| StudentDashboard | max-w-6xl | (none — dari App.tsx p-6 lg:p-8) | siswa/StudentDashboard.tsx |
| TeacherDashboard | max-w-6xl | (none) | guru/TeacherDashboard.tsx |
| Profile | max-w-4xl | (none) | shared/Profile.tsx |
| Leaderboard | max-w-4xl | (none) | shared/Leaderboard.tsx |
| StudentManagement | max-w-6xl | (none) | guru/StudentManagement.tsx |
| ContentManager | max-w-6xl | (none) | guru/ContentManager.tsx |
| Statistics | max-w-6xl | (none) | guru/Statistics.tsx |
| ActivityLogManager | max-w-6xl | (none) | guru/ActivityLogManager.tsx |
| LogiChat | max-w-3xl | mt-4 | siswa/LogiChat.tsx |
| Forum | max-w-4xl | h-[calc(100vh-40px)] | shared/Forum.tsx |
| SuperAdminDashboard | max-w-6xl | (none) | admin/SuperAdminDashboard.tsx |
| TestCenter | max-w-5xl | (none) | siswa/TestCenter.tsx |
| TeacherAnalysis | (none — langsung space-y-6) | (none) | guru/TeacherAnalysis.tsx |

**Masalah utama**: `App.tsx` L314 memberikan `p-6 lg:p-8` pada `<main>`, tapi beberapa halaman fullscreen (PracticeZone, TestCenter saat aktif) menggunakan `min-h-screen bg-slate-50 p-6` sendiri — **double padding**.

**Ide Perbaikan:**
- Buat CSS class `.page-container` = `max-w-6xl mx-auto w-full` untuk halaman data/tabel.
- Buat `.page-container-focus` = `max-w-4xl mx-auto w-full` untuk halaman fokus (Profile, Chat, Leaderboard).
- Pastikan **setiap halaman** memiliki margin bawah `pb-20` agar konten tidak terpotong oleh scrollbar/footer.
- Hilangkan padding ganda pada halaman fullscreen test/practice.

---

### 1.2 border-radius Masih Inkonsisten

Meskipun `border-b-4` sudah dihapus, terdapat campuran `rounded-3xl`, `rounded-2xl`, dan `rounded-xl` tanpa aturan yang jelas:

| Elemen | Radius Sekarang | Lokasi |
|---|---|---|
| Hero Card (StudentDashboard) | rounded-3xl | StudentDashboard.tsx L187 |
| Aktivitas Teman container | rounded-3xl | StudentDashboard.tsx L282 |
| Forum header | rounded-3xl | Forum.tsx L272 |
| Forum body | rounded-3xl | Forum.tsx L301 |
| TeacherDashboard shortcuts | rounded-3xl | TeacherDashboard.tsx L193 |
| TeacherDashboard activity | rounded-3xl | TeacherDashboard.tsx L223 |
| GlobalModal | rounded-3xl | GlobalModal.tsx L38 |
| Data tables (via .data-table-container) | rounded-2xl | index.css L117 |
| Card spatial | rounded-xl | index.css L77 |
| Sidebar nav items | rounded-2xl | Sidebar.tsx L118 |
| Buttons | rounded-2xl | Button.tsx L28 |

**Ide Perbaikan — Aturan Radius:**
- `rounded-2xl` (16px): Kontainer utama (kartu, modal, tabel, form area).
- `rounded-xl` (12px): Elemen sekunder (input, badge, chip, dropdown, nav item).
- `rounded-lg` (8px): Elemen kecil (toggle, icon container).
- **Hindari** `rounded-3xl` kecuali untuk elemen dekoratif hero/splash.

---

### 1.3 Sidebar — Sudah Baik, Minor Polish

Sidebar sudah menggunakan `w-56` saat terbuka, icon 22px, dan sentence case. Beberapa perbaikan minor:

- **Border kanan terlalu tebal**: `border-r-2` (L81) → `border-r` (1px) untuk kesan lebih ringan.
- **Toggle button position**: `-right-4` bisa terasa "menggantung". Pertimbangkan posisi di dalam sidebar.
- **Mobile overlay**: `bg-black/50` bisa diganti `bg-slate-900/40 backdrop-blur-sm` agar lebih halus.

---

### 1.4 Spacing Vertikal Antar Section

Beberapa halaman menggunakan `space-y-8`, tapi yang lain `space-y-6`:

| Halaman | Spacing |
|---|---|
| StudentDashboard | space-y-8 |
| TeacherDashboard | space-y-8 |
| Statistics | space-y-8 |
| ContentManager | space-y-8 |
| TeacherAnalysis | space-y-6 |
| ActivityLogManager | (tidak ada, manual mb-6) |
| SuperAdminDashboard | space-y-6 |

**Ide Perbaikan:** Standarkan ke `space-y-8` untuk semua halaman level-atas.

---

## 2. Sistem Warna

### 2.1 Palet Warna — Status Terkini

Dari `tailwind.config.js`, palet aktif:

| Token | Hex | Penggunaan Aktual |
|---|---|---|
| feather | #58cc02 | CTA utama, success state, progress bar |
| macaw | #1cb0f6 | Secondary, active nav, links, guru badge |
| cardinal | #ff4b4b | Danger, error, practice zone |
| bee | #ffc800 | Warning, XP highlight, level badge |
| fox | #ff9600 | Progress gradient, XP icon |

**Warna yang tidak terdaftar di token tapi digunakan ad-hoc:**

| Warna Ad-hoc | Lokasi | Seharusnya |
|---|---|---|
| `bg-blue-100 text-blue-600` | StudentManagement.tsx L46 (kelas badge) | Gunakan `bg-macaw-light/20 text-macaw-dark` |
| `bg-green-500` | StudentProgressSummary.tsx L137 | Gunakan `bg-feather` |
| `bg-red-500` | StudentProgressSummary.tsx L138 | Gunakan `bg-cardinal` |
| `bg-blue-50 border-blue-100` | TeacherAnalysis.tsx L210 (info box) | Gunakan `bg-macaw-light/10 border-macaw-light/30` |
| `text-blue-800, text-blue-700` | TeacherAnalysis.tsx L211-212 | Gunakan `text-macaw-dark` |
| `bg-green-100 text-green-600` | PracticeZone.tsx L66 | Gunakan `bg-feather-light/20 text-feather-dark` |
| `bg-blue-100 text-blue-600` | PracticeZone.tsx L70 | Gunakan `bg-macaw-light/20 text-macaw-dark` |
| `bg-yellow-100 text-yellow-600` | PracticeZone.tsx L74 | Gunakan `bg-bee-light/20 text-bee-dark` |
| `bg-yellow-50/20` | Leaderboard.tsx L82 | Gunakan `bg-bee-light/10` |
| `text-yellow-400, text-yellow-600` | Leaderboard.tsx L59, L91 | Gunakan `text-bee, text-bee-dark` |
| `text-orange-400` | Leaderboard.tsx L61 | Gunakan `text-fox` |
| `bg-red-900/50 border-red-500` | TeacherSelection.tsx L99 (error) | Gunakan `bg-cardinal-light/20 border-cardinal` |
| `bg-purple-100 text-purple-700` | Profile.tsx L136 | Tidak ada token ungu — buat token baru atau gunakan `macaw` |

**Ide Perbaikan:**
- Hapus semua warna ad-hoc Tailwind dan ganti dengan token design system.
- Pertimbangkan menambah token `hare: #ce82ff` (ungu) untuk guru/school badge, karena saat ini menggunakan `purple` hardcoded.

---

### 2.2 Dark Mode — Tidak Ada (Sesuai Permintaan)

User telah memilih untuk **tidak** mengimplementasikan dark mode. Namun ada inkonsistensi pada halaman yang menggunakan background gelap:

| Lokasi | Background | Masalah |
|---|---|---|
| SuperAdmin header | bg-slate-800 | Terasa asing di tengah light mode |
| MazeGame screen | bg-slate-900 | OK — konteks game fullscreen |
| PracticeZone summary | border-b-8 border-cardinal-dark | Border bawah 8px sangat tebal |
| TeacherSelection error box | bg-red-900/50 | Warna gelap di tengah halaman terang |

**Ide Perbaikan:**
- SuperAdmin header: Ganti `bg-slate-800` → `bg-slate-50 border border-slate-200` (selaras dengan light mode).
- PracticeZone summary: `border-b-8` → `border border-slate-200` (konsisten flat).
- TeacherSelection error: `bg-red-900/50` → `bg-cardinal-light/20 border-cardinal text-cardinal-dark`.

---

### 2.3 Kontras Teks

| Lokasi | Kelas | Masalah |
|---|---|---|
| Greeting label | text-[10px] text-slate-400 uppercase | Terlalu kecil + pudar |
| XP Progress labels | text-[10px] text-slate-400 | Sama |
| Forum timestamp | text-[10px] text-slate-400 | Sama |
| Activity timestamp | text-[10px] text-slate-400 | Sama |
| Leaderboard level | text-xs text-slate-400 uppercase | Bisa lebih gelap |

**Ide Perbaikan:**
- Minimum font-size: `text-xs` (12px), bukan `text-[10px]` (10px).
- Label informatif: `text-slate-500` (bukan 400) untuk kontras lebih baik.

---

## 3. Tipografi & Copywriting

### 3.1 Font Weight Masih Terlalu Berat

Hampir semua teks masih menggunakan `font-bold` atau `font-extrabold`, bahkan untuk body text dan label kecil. Ketika **semuanya tebal**, hierarki visual menjadi datar.

**Contoh spesifik:**

| Elemen | Weight Saat Ini | Saran |
|---|---|---|
| Section title ("Zona Aktivitas") | font-extrabold | font-bold — cukup |
| Activity username | font-extrabold | font-semibold |
| Forum username | text-xs font-extrabold | text-xs font-bold |
| Teacher Dashboard description | font-medium | ✅ Sudah tepat |
| Stat labels | font-bold text-xs uppercase | font-medium text-xs uppercase |
| Search input | font-bold | font-medium |
| Empty state text | font-bold | font-medium |
| Badge/chip text | font-bold | font-semibold |

**Sistem Hierarki yang Disarankan:**

| Level | Weight | Size | Contoh |
|---|---|---|---|
| Page Title (H1) | font-extrabold | text-2xl–3xl | "Beranda", "Profil Kamu" |
| Section Title (H2) | font-bold | text-lg | "Zona Aktivitas" |
| Card Title (H3) | font-semibold | text-base | "Distribusi Level" |
| Body Text | font-medium | text-sm | Deskripsi, paragraf |
| Label/Caption | font-medium | text-xs text-slate-500 | Timestamp, badge |
| CTA Button | font-bold | text-sm uppercase | "MULAI", "SIMPAN" |

---

### 3.2 UPPERCASE Masih Berlebihan

| Lokasi | Teks | Masalah |
|---|---|---|
| Action button labels | "LOGICHAT", "UJIAN" | OK — ini CTA |
| Sidebar labels | Sentence case | ✅ Sudah tepat |
| Stat card labels | uppercase tracking-wider | Bisa sentence case |
| "LIHAT SEMUA PERINGKAT" | uppercase tracking-wide | Terlalu agresif — cukup capitalize biasa |
| Table headers | uppercase tracking-wider | OK — standar tabel |

**Ide Perbaikan:**
- Uppercase hanya untuk: button CTA, badge status, table header.
- Link navigasi ("Lihat Semua Peringkat"): sentence case, tanpa tracking-wide.

---

### 3.3 Copywriting — Perbaikan Spesifik

| Lokasi | Teks Saat Ini | Saran | Alasan |
|---|---|---|---|
| SuperAdmin header | "God Mode: Pusat Kendali Admin" | "Pusat Kendali Administrator" | Lebih profesional (konteks skripsi) |
| ContentManager title | "Bank Soal Guru" | "Manajemen Bank Soal" | Lebih formal |
| TestCenter subtitle | "Ikuti Pre-Test sebelum..." | "Kerjakan Pre-Test untuk mengukur pemahamanmu sebelum belajar." | Lebih actionable |
| Forum empty state | "Belum ada percakapan di forum ini." | ✅ Sudah baik | — |
| PracticeZone summary perfect | "LUAR BIASA!" | "Sempurna!" | Lebih tenang, minimalis |
| ActivityLog subtitle | "Kelola notifikasi yang muncul di dashboard siswa." | "Riwayat aktivitas belajar siswa dalam kelas Anda." | Lebih deskriptif |

---

## 4. Eksplorasi Mandiri

### 4.1 Komponen Tabel — Inkonsistensi Styling

Setiap tabel guru menggunakan styling header yang sedikit berbeda:

| Komponen | thead class | divider |
|---|---|---|
| StudentManagement | bg-slate-50 text-xs uppercase font-bold | divide-y divide-slate-100 |
| TeacherAnalysis | bg-slate-100 sticky | divide-y-2 divide-slate-100 |
| ActivityLogManager | bg-slate-50 text-xs uppercase font-bold | divide-y divide-slate-100 |
| ContentManager | bg-slate-50 border-b-2 font-bold text-sm uppercase | divide-y-2 divide-slate-100 |
| SuperAdmin | bg-slate-50 font-bold uppercase text-sm | divide-y-2 divide-slate-100 |
| StudentProgressSummary | (no bg class — inline border-b) | (manual border-b) |

**Ide Perbaikan:**
- Standarkan semua thead: `bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200`.
- Standarkan tbody divider: `divide-y divide-slate-100`.
- StudentProgressSummary harus menggunakan pola yang sama.

---

### 4.2 Loading States Berbeda-Beda

| Halaman | Loading UI |
|---|---|
| App.tsx global | Loader2 + text-feather |
| Statistics | Loader2 + text-slate-400 + "Menganalisis Data..." |
| StudentManagement | Inline td + "Sedang memuat data siswa..." |
| TeacherDashboard | Shimmer skeleton cards |
| StudentDashboard | Shimmer skeleton feed |
| Leaderboard | Inline text "Memuat peringkat..." |
| ContentManager | Inline text "Memuat data..." |
| Forum | No explicit loader (relies on empty state) |

**Ide Perbaikan:**
- Buat shared `<PageLoader />` component: Loader2 spin + teks deskriptif + warna macaw.
- Semua halaman tabel menggunakan skeleton row (shimmer) yang konsisten.

---

### 4.3 Empty States Berbeda Format

| Halaman | Format |
|---|---|
| StudentDashboard activities | Icon + text center |
| Forum | Icon besar + 2 baris teks |
| Leaderboard | Inline text sederhana |
| ContentManager | Icon + heading + subtext |
| TeacherDashboard activity | Inline text |
| StudentProgressSummary | AlertCircle + heading + subtext |

**Ide Perbaikan:**
- Buat shared `<EmptyState icon={} title="" subtitle="" />` component.
- Gunakan format konsisten: icon (48px, opacity-30) + heading (semibold) + subtitle (medium, slate-400).

---

### 4.4 PracticeZone Summary — Border Terlalu Berat

`PracticeZone.tsx` L102: `border-b-8 border-cardinal-dark` pada summary card. Ini adalah sisa gaya 3D yang belum dihapus.

**Ide Perbaikan:** Ganti `border-b-8 border-cardinal-dark` → `border border-slate-200 shadow-sm`.

---

### 4.5 StudentProgressSummary — Circle Indicators Masih 3D

L137-139: Circle indicators menggunakan `shadow-[0_2px_0_0_#15803d]` (hardcoded green shadow) dan `shadow-[0_2px_0_0_#b91c1c]` (hardcoded red shadow). Ini adalah efek 3D mini.

**Ide Perbaikan:** Hapus shadow dari circles. Warna `bg-feather`/`bg-cardinal`/`bg-slate-200` sudah cukup kontras tanpa shadow.

---

### 4.6 Forum — Struktur Input Terlalu Panjang

Forum input (`Forum.tsx` L354) memiliki class string yang sangat panjang. Secara visual:
- Input height `py-4` (64px total) terlalu tinggi untuk chat input.
- Button height `h-[58px]` hardcoded — seharusnya match input.

**Ide Perbaikan:**
- Kurangi input padding: `py-4` → `py-3`.
- Button: hapus `h-[58px]`, gunakan `h-auto py-3` agar match.

---

### 4.7 TeacherDashboard — Hero Buttons Terlalu "Heavy"

L149-154: Dua tombol CTA besar dengan `shadow-lg` dan `active:scale-95`. Untuk dashboard overview, ini terlalu mencolok.

**Ide Perbaikan:**
- Ganti `shadow-lg` → `shadow-sm hover:shadow`.
- Ganti `active:scale-95` → `active:scale-[0.98]` (lebih subtle).

---

### 4.8 Global Modal — rounded-3xl Terlalu Besar

`GlobalModal.tsx` L38: `rounded-3xl` pada modal card. Untuk modal dialog profesional, ini terlalu membulat.

**Ide Perbaikan:** `rounded-3xl` → `rounded-2xl`.

---

### 4.9 TeacherSelection — Layout Perlu Polish

- L96: `text-4xl text-center font-bold` — heading terlalu besar untuk halaman seleksi.
- L112: Teacher card menggunakan `rounded-3xl border-4` — border terlalu tebal.
- Error box (L99) menggunakan `bg-red-900/50` — warna dark mode di halaman light.

**Ide Perbaikan:**
- Heading: `text-4xl` → `text-2xl`, tambah subtitle deskriptif.
- Teacher card border: `border-4` → `border-2`.
- Error: gunakan token cardinal.

---

### 4.10 Leaderboard — Row Divider Terlalu Tebal

L82: `border-b-2 border-slate-100` pada setiap row. Ini menciptakan garis yang terlalu tebal dan mencolok.

**Ide Perbaikan:** `border-b-2` → `border-b` (1px).

---

### 4.11 MazeGame Lobby — Masih Menggunakan Gaya Berat

- L352: `shadow-2xl border-4 border-slate-200` — terlalu berat.
- L367: Input `border-2 rounded-2xl` — OK tapi bisa diratakan.
- L374: Room code box `border-2 border-bee border-dashed` — cukup ramai.

**Ide Perbaikan:**
- Lobby card: `shadow-2xl border-4` → `shadow-lg border-2`.
- Room code: `border-2 border-dashed` → `border border-dashed`.

---

### 4.12 TestCenter — Padding Kurang

`TestCenter.tsx` L41: `max-w-5xl mx-auto` tanpa padding eksplisit. Saat dimuat di `<main>` dengan `p-6`, ini memiliki padding dari parent. Tapi saat dimuat sebagai fullscreen test (`p-0` via `isFullScreenGame`), konten bisa mepet ke tepi.

**Ide Perbaikan:** Tambahkan `px-6` pada wrapper TestCenter agar aman di kedua mode.

---

## 5. Prioritas Implementasi

### Prioritas Tinggi (Dampak Besar, Effort Rendah–Sedang)

| # | Item | Effort | Section |
|---|---|---|---|
| 1 | Standarkan max-width & padding via `.page-container` class | Rendah | 1.1 |
| 2 | Konsistenkan border-radius (3xl → 2xl untuk kontainer) | Rendah | 1.2 |
| 3 | Ganti semua warna ad-hoc Tailwind → design system token | Rendah | 2.1 |
| 4 | Perbaiki kontras teks (10px → 12px, slate-400 → slate-500) | Rendah | 2.3 |
| 5 | Terapkan hierarki font-weight (kurangi extrabold berlebih) | Sedang | 3.1 |
| 6 | Hapus sisa elemen 3D (PracticeZone border-b-8, circle shadows) | Rendah | 4.4, 4.5 |

### Prioritas Sedang (Dampak Sedang, Effort Sedang)

| # | Item | Effort | Section |
|---|---|---|---|
| 7 | Standarkan styling tabel (thead, divider) | Sedang | 4.1 |
| 8 | Buat shared EmptyState component | Sedang | 4.3 |
| 9 | Kurangi uppercase berlebihan | Rendah | 3.2 |
| 10 | Polish TeacherSelection layout | Rendah | 4.9 |
| 11 | Polish Leaderboard row divider | Rendah | 4.10 |
| 12 | Perbaiki copywriting (God Mode, dll) | Rendah | 3.3 |

### Prioritas Rendah (Nice-to-have)

| # | Item | Effort | Section |
|---|---|---|---|
| 13 | Buat shared PageLoader component | Sedang | 4.2 |
| 14 | Polish MazeGame lobby styling | Rendah | 4.11 |
| 15 | Polish GlobalModal border-radius | Rendah | 4.8 |
| 16 | Polish Forum input height | Rendah | 4.6 |
| 17 | Polish TeacherDashboard CTA buttons | Rendah | 4.7 |
| 18 | Sidebar border & mobile overlay polish | Rendah | 1.3 |

---

> **Catatan Akhir**: Audit ini disusun berdasarkan pembacaan mendalam terhadap **40+ file** komponen dalam state terkini (post-flattening). Semua temuan merujuk pada kode aktual. Tidak ada perubahan kode yang dilakukan. Silakan diskusikan poin mana yang ingin diprioritaskan.
