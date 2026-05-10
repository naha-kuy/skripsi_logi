# Sequence Diagram — Arsitektur Data Aplikasi Logi Math (Versi Artikel Skripsi)

> **Catatan:** Diagram ini menunjukkan proses pertukaran data antar komponen sistem secara teknis. Diagram ini melengkapi Activity Diagram yang berfokus pada alur interaksi pengguna. Kedua jenis diagram ini dirancang untuk digunakan bersama di dalam artikel.
>
> **Pengecualian:** Fitur Mode Game Petualangan dan Game Labirin tidak dimasukkan.

---

## Gambar 4 — Sequence Diagram: Mekanisme Pengerjaan Ujian (Pre-test dan Post-test)

Diagram ini menggambarkan arsitektur pertukaran data saat siswa mengerjakan ujian (pre-test maupun post-test), termasuk mekanisme penyimpanan sementara (*local caching*) untuk mencegah kehilangan data.

```mermaid
sequenceDiagram
    actor S as Siswa
    participant F as Aplikasi Frontend
    participant LS as Penyimpanan Lokal<br/>(Local Storage)
    participant DB as Basis Data<br/>(Supabase)

    Note over S,DB: Fase Inisialisasi Ujian

    S->>F: Membuka halaman ujian
    F->>DB: Periksa status ujian<br/>(has_completed_pretest/posttest)
    DB-->>F: Status: belum dikerjakan

    F->>LS: Periksa apakah ada<br/>progres tersimpan sebelumnya
    
    alt Progres tersimpan ditemukan
        LS-->>F: Kembalikan jawaban & indeks soal terakhir
        F->>DB: Ambil ulang soal berdasarkan ID tersimpan
        DB-->>F: Data soal
        F-->>S: Lanjutkan dari soal terakhir yang dibuka
    else Tidak ada progres tersimpan
        F->>DB: Ambil daftar soal<br/>(category, teacher_id)
        DB-->>F: Data soal (diacak)
        F->>LS: Simpan state awal<br/>(daftar ID soal, indeks: 0, skor: 0)
        F-->>S: Tampilkan soal pertama
    end

    Note over S,DB: Fase Pengerjaan Soal (Berulang)

    loop Untuk setiap soal
        S->>F: Memilih opsi jawaban
        F->>LS: Simpan jawaban secara otomatis<br/>(auto-save per soal)
        F-->>S: Tampilkan umpan balik<br/>(benar/salah beserta pembahasan)
        F-->>S: Tampilkan soal berikutnya
    end

    Note over S,DB: Fase Penyelesaian dan Sinkronisasi

    S->>F: Mengirim jawaban<br/>(soal terakhir selesai)
    F->>F: Hitung skor akhir<br/>(jawaban benar ÷ total × 100)

    F->>DB: Perbarui status ujian<br/>(has_completed: true, skor)
    DB-->>F: Konfirmasi tersimpan

    F->>DB: Simpan seluruh jawaban siswa<br/>(batch insert: soal, jawaban,<br/>status benar/salah per soal)
    DB-->>F: Konfirmasi tersimpan

    F->>DB: Catat log aktivitas<br/>(pretest_complete / posttest_complete)
    DB-->>F: Konfirmasi tercatat

    F->>LS: Hapus data sementara
    F-->>S: Tampilkan halaman hasil evaluasi
```

**Deskripsi:** Ketika siswa membuka halaman ujian, sistem terlebih dahulu memeriksa apakah ujian telah dikerjakan sebelumnya melalui basis data. Apabila belum, sistem memeriksa penyimpanan lokal perangkat (*local storage*) untuk mendeteksi adanya progres yang tersimpan dari sesi sebelumnya (misalnya akibat penutupan browser atau gangguan koneksi). Jika progres ditemukan, pengerjaan dilanjutkan dari soal terakhir yang dikerjakan.

Selama pengerjaan berlangsung, setiap jawaban yang dipilih siswa secara otomatis disimpan ke penyimpanan lokal (*auto-save*). Mekanisme ini menjamin bahwa jawaban siswa tidak hilang meskipun terjadi gangguan teknis.

Setelah seluruh soal dijawab, sistem menghitung skor akhir di sisi klien, kemudian menyinkronisasi data ke basis data dalam tiga operasi: (1) memperbarui status penyelesaian dan skor, (2) menyimpan detail jawaban per soal secara sekaligus (*batch insert*), dan (3) mencatat aktivitas ke log sistem. Setelah sinkronisasi selesai, data sementara di penyimpanan lokal dihapus.

---

## Gambar 5 — Sequence Diagram: Proses Autentikasi dan Inisialisasi Sesi

Diagram ini menunjukkan alur teknis autentikasi pengguna, mulai dari validasi kredensial hingga pengambilan data profil dan penentuan peran.

```mermaid
sequenceDiagram
    actor U as Pengguna
    participant F as Aplikasi Frontend
    participant AUTH as Layanan Autentikasi<br/>(Supabase Auth)
    participant DB as Basis Data<br/>(Supabase)

    Note over U,DB: Pemeriksaan Sesi Awal

    U->>F: Membuka aplikasi
    F->>AUTH: Periksa sesi yang tersimpan<br/>(getSession)

    alt Sesi aktif ditemukan
        AUTH-->>F: Kembalikan token sesi
    else Tidak ada sesi aktif
        AUTH-->>F: Sesi kosong
        F-->>U: Tampilkan halaman login
        U->>F: Memasukkan email dan password
        F->>AUTH: Kirim kredensial untuk validasi

        alt Kredensial tidak valid
            AUTH-->>F: Respons: gagal (error)
            F-->>U: Tampilkan pesan kesalahan
        else Kredensial valid
            AUTH-->>F: Kembalikan token sesi baru
        end
    end

    Note over U,DB: Pengambilan Data Profil

    F->>DB: Ambil data profil pengguna<br/>(berdasarkan user ID)

    alt Data profil ditemukan
        DB-->>F: Data profil<br/>(username, role, level, XP)
    else Data profil belum ada (pengguna baru)
        DB-->>F: Respons: data kosong
        F->>DB: Buat profil baru secara otomatis<br/>(upsert dengan metadata registrasi)
        DB-->>F: Data profil baru
    end

    Note over U,DB: Penentuan Peran dan Navigasi

    F->>F: Identifikasi peran pengguna<br/>(siswa / guru / superadmin)

    alt Peran = Guru
        F-->>U: Arahkan ke Dashboard Guru
    else Peran = Siswa
        F-->>U: Arahkan ke Pemilihan Kelas Guru
        U->>F: Memilih kelas guru
        F->>DB: Periksa relasi siswa-guru
        alt Relasi belum ada
            F->>DB: Buat relasi baru<br/>(student_teacher_progress)
            DB-->>F: Konfirmasi tersimpan
        end
        F-->>U: Arahkan ke Dashboard Siswa
    end
```

**Deskripsi:** Saat aplikasi dibuka, sistem memeriksa apakah terdapat sesi autentikasi yang masih aktif melalui layanan autentikasi Supabase. Jika tidak ditemukan, pengguna diminta untuk melakukan login. Setelah autentikasi berhasil, sistem mengambil data profil dari basis data. Untuk pengguna baru yang profilnya belum tercatat (misalnya karena kegagalan *trigger* basis data), sistem secara otomatis membuat profil baru berdasarkan metadata pendaftaran. Selanjutnya, sistem menentukan halaman tujuan berdasarkan peran pengguna.

---

## Gambar 6 — Sequence Diagram: Monitoring dan Analisis Data oleh Guru

Diagram ini menggambarkan proses pengambilan dan penyajian data analisis kepada guru, termasuk mekanisme ekspor data ke format spreadsheet.

```mermaid
sequenceDiagram
    actor G as Guru
    participant F as Aplikasi Frontend
    participant DB as Basis Data<br/>(Supabase)
    participant XL as Generator Spreadsheet<br/>(SheetJS)

    Note over G,XL: Inisialisasi Dashboard

    G->>F: Membuka halaman dashboard
    
    par Pengambilan data paralel
        F->>DB: Ambil daftar ID siswa terdaftar<br/>(student_teacher_progress)
        F->>DB: Ambil data level seluruh siswa<br/>(users_data)
        F->>DB: Ambil log aktivitas terbaru<br/>(activity_logs)
        F->>DB: Hitung jumlah diskusi forum<br/>(forum_messages)
    end

    DB-->>F: Data siswa, level, log, dan diskusi
    F->>F: Kalkulasi statistik ringkasan<br/>(total siswa, rata-rata level)
    F-->>G: Tampilkan kartu statistik<br/>dan umpan aktivitas terbaru

    Note over G,XL: Analisis Jawaban Detail

    G->>F: Membuka menu Analisis Jawaban
    F->>DB: Ambil seluruh rekaman jawaban siswa<br/>(student_answers + data username)
    DB-->>F: Data jawaban (maks. 1000 rekaman)
    F-->>G: Tampilkan tabel data interaktif<br/>(dapat dicari dan difilter)

    opt Guru mengunduh data
        G->>F: Klik tombol Unduh Excel
        F->>XL: Konversi data ke format spreadsheet
        XL-->>F: File .xlsx siap unduh
        F-->>G: Unduh file<br/>(Analisis_Siswa_[tanggal].xlsx)
    end

    Note over G,XL: Manajemen Bank Soal

    G->>F: Membuka menu Manajemen Konten
    F->>DB: Ambil daftar soal milik guru<br/>(questions, teacher_id)
    DB-->>F: Daftar soal pre-test dan post-test
    F-->>G: Tampilkan editor bank soal

    alt Guru menambah soal baru
        G->>F: Mengisi formulir soal baru<br/>(teks soal, opsi jawaban, kunci,<br/>pembahasan per opsi)
        F->>DB: Simpan soal baru
        DB-->>F: Konfirmasi tersimpan
    else Guru mengedit soal
        G->>F: Mengubah data soal
        F->>DB: Perbarui soal
        DB-->>F: Konfirmasi diperbarui
    else Guru menghapus soal
        G->>F: Konfirmasi penghapusan
        F->>DB: Hapus soal
        DB-->>F: Konfirmasi terhapus
    end

    F-->>G: Perbarui tampilan daftar soal
```

**Deskripsi:** Ketika guru membuka dashboard, sistem mengambil beberapa jenis data secara paralel dari basis data untuk menghasilkan ringkasan statistik kelas. Pada menu Analisis Jawaban, seluruh rekaman jawaban siswa ditampilkan dalam tabel interaktif yang mendukung pencarian dan pemfilteran. Guru juga dapat mengekspor data tersebut ke format spreadsheet Excel untuk keperluan analisis lebih lanjut menggunakan aplikasi pihak ketiga (seperti Microsoft Excel atau SPSS). Menu Manajemen Konten memungkinkan guru untuk mengelola bank soal pre-test dan post-test secara mandiri, termasuk menambah, mengubah, dan menghapus soal beserta pembahasan per opsi jawaban.

---

## Panduan Penggunaan Diagram dalam Artikel

### Urutan Penyajian yang Disarankan

| No. | Gambar | Jenis Diagram | Penempatan di Artikel |
|:---:|--------|---------------|----------------------|
| 1 | Gambar 1 | Activity Diagram | Bab Perancangan Sistem — sub-bab alur umum |
| 2 | Gambar 2 | Activity Diagram | Bab Perancangan Sistem — sub-bab alur siswa |
| 3 | Gambar 3 | Activity Diagram | Bab Perancangan Sistem — sub-bab alur guru |
| 4 | Gambar 4 | Sequence Diagram | Bab Perancangan Sistem — sub-bab arsitektur data ujian |
| 5 | Gambar 5 | Sequence Diagram | Bab Perancangan Sistem — sub-bab arsitektur autentikasi |
| 6 | Gambar 6 | Sequence Diagram | Bab Perancangan Sistem — sub-bab arsitektur monitoring |

### Cara Mengekspor ke Gambar (PNG/SVG)
1. Salin kode di dalam blok ` ```mermaid ``` `
2. Buka [Mermaid Live Editor](https://mermaid.live)
3. Tempel kode, lalu klik **Export as PNG** atau **Export as SVG**
4. Sisipkan file gambar ke dokumen artikel Anda
