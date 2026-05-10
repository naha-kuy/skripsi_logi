# Activity Diagram — Aplikasi Logi Math (Versi Artikel Skripsi)

> **Catatan:** Diagram ini telah disederhanakan dari detail teknis internal (seperti nama fungsi, tabel database, local storage, dsb.) agar sesuai untuk keperluan publikasi ilmiah. Detail arsitektur teknis direpresentasikan terpisah melalui **Sequence Diagram**.
>
> **Pengecualian:** Fitur Mode Game Petualangan dan Game Labirin tidak dimasukkan.

---

## Gambar 1 — Activity Diagram: Alur Umum Sistem (Autentikasi dan Otorisasi)

Diagram ini menunjukkan alur awal pengguna saat membuka aplikasi hingga diarahkan ke halaman utama berdasarkan perannya (Siswa atau Guru).

```mermaid
flowchart TD
    A([Mulai]) --> B["Pengguna Membuka Aplikasi"]
    B --> C{"Sesi Login\nMasih Aktif?"}

    C -->|"Ya"| F["Sistem Mengambil\nData Profil Pengguna"]
    C -->|"Tidak"| D["Tampilkan\nHalaman Login"]

    D --> D1{"Sudah Punya\nAkun?"}
    D1 -->|"Belum"| REG["Pengguna Mengisi\nFormulir Pendaftaran\n(nama, email, kelas, peran)"]
    REG --> REG2{"Pendaftaran\nBerhasil?"}
    REG2 -->|"Gagal\n(email sudah terdaftar)"| REG
    REG2 -->|"Berhasil"| REG3["Tampilkan Halaman\nKonfirmasi Pendaftaran"]
    REG3 --> D

    D1 -->|"Sudah"| E["Pengguna Memasukkan\nEmail dan Password"]
    E --> E1{"Kredensial\nValid?"}
    E1 -->|"Tidak Valid"| E2["Tampilkan\nPesan Kesalahan"]
    E2 --> D
    E1 -->|"Valid"| F

    F --> G{"Peran\nPengguna?"}

    G -->|"Guru"| H["Masuk ke\nDashboard Guru"]
    G -->|"Siswa"| I["Masuk ke Halaman\nPemilihan Kelas Guru"]

    I --> I1["Sistem Menampilkan\nDaftar Guru Tersedia"]
    I1 --> I2["Siswa Memilih\nKelas Guru"]
    I2 --> I3["Sistem Mendaftarkan Siswa\nke Kelas Guru Terpilih"]
    I3 --> J["Masuk ke\nDashboard Siswa"]

    H --> END_G([Lanjut ke Alur Guru\n— Gambar 3])
    J --> END_S([Lanjut ke Alur Siswa\n— Gambar 2])

    style A fill:#22c55e,color:#fff,stroke:#16a34a,stroke-width:2px
    style END_G fill:#3b82f6,color:#fff,stroke:#2563eb,stroke-width:2px
    style END_S fill:#f59e0b,color:#fff,stroke:#d97706,stroke-width:2px
```

**Deskripsi:** Saat pengguna membuka aplikasi, sistem memeriksa apakah sesi login sebelumnya masih aktif. Jika tidak, pengguna diarahkan ke halaman login. Pengguna baru dapat mendaftarkan akun terlebih dahulu. Setelah autentikasi berhasil, sistem mengidentifikasi peran pengguna. Guru diarahkan ke dashboard guru, sedangkan siswa diarahkan ke halaman pemilihan kelas guru sebelum memasuki dashboard siswa.

---

## Gambar 2 — Activity Diagram: Alur Pembelajaran Siswa

Diagram ini menunjukkan perjalanan belajar siswa secara utuh, mulai dari evaluasi awal (Pre-test), eksplorasi materi dan alat peraga interaktif, hingga evaluasi akhir (Post-test). Detail mekanisme pengerjaan soal dapat dilihat pada Gambar 4.

```mermaid
flowchart TD
    START([Siswa di Dashboard]) --> PRE_CHECK{"Pre-test Sudah\nDikerjakan?"}

    PRE_CHECK -->|"Sudah"| MATERI_OPEN["Akses Roadmap\nMateri Terbuka"]
    PRE_CHECK -->|"Belum"| PRE_TEST

    %% Subgraph orientasi Kiri-ke-Kanan (LR) untuk melebarkan diagram
    subgraph PRE_TEST ["Fase Pre-test"]
        direction LR
        P1["Siswa Mengerjakan\nSoal Pre-test"] --> P2["Sistem Menghitung\nSkor"] --> P3["Tampilkan\nHasil Pre-test"]
    end
    
    PRE_TEST --> MATERI_OPEN

    MATERI_OPEN --> LEARNING

    %% Subgraph orientasi Kiri-ke-Kanan (LR) untuk melebarkan diagram
    subgraph LEARNING ["Fase Pembelajaran & Volume Lab"]
        direction LR
        L1["Memilih dan\nMempelajari Topik"] --> L2{"Eksplorasi\nVolume Lab?"}
        L2 -->|"Ya"| L3["Memanipulasi Parameter\n& Mengamati Volume 3D"]
        L3 --> L4["Tandai Materi\nSelesai"]
        L2 -->|"Tidak"| L4
    end

    LEARNING --> ALL_DONE{"Semua Materi\nTelah Selesai?"}
    
    ALL_DONE -->|"Belum"| LEARNING
    ALL_DONE -->|"Ya"| POST_CHECK{"Post-test Sudah\nDikerjakan?"}

    POST_CHECK -->|"Sudah\n(Tidak bisa diulang)"| SELESAI([Selesai /\nKembali ke Dashboard])
    POST_CHECK -->|"Belum"| POST_TEST

    %% Subgraph orientasi Kiri-ke-Kanan (LR) untuk melebarkan diagram
    subgraph POST_TEST ["Fase Post-test"]
        direction LR
        PT1["Siswa Mengerjakan\nPost-test"] --> PT2["Sistem Menyimpan\nHasil Akhir"] --> PT3["Tampilkan\nSkor Evaluasi"]
    end

    POST_TEST --> SELESAI

    style START fill:#f59e0b,color:#fff,stroke:#d97706,stroke-width:2px
    style SELESAI fill:#22c55e,color:#fff,stroke:#16a34a,stroke-width:2px
```

**Deskripsi:** Setelah memasuki dashboard, sistem memeriksa apakah siswa telah menyelesaikan pre-test. Jika belum, akses materi dikunci dan siswa diwajibkan mengerjakan pre-test. Setelah selesai, roadmap materi terbuka. Siswa kemudian memilih topik pelajaran dan dapat menggunakan fitur Volume Lab untuk memanipulasi parameter bangun ruang secara interaktif. Setiap selesai mempelajari topik, progres akan disimpan. Apabila seluruh materi dalam roadmap telah diselesaikan, akses untuk mengerjakan post-test akan terbuka. Post-test dirancang sebagai evaluasi akhir dan hanya dapat dikerjakan satu kali.

---

## Gambar 3 — Activity Diagram: Alur Monitoring oleh Guru

Diagram ini menunjukkan aktivitas guru dalam memantau, menganalisis, dan mengelola proses pembelajaran siswa.

```mermaid
flowchart TD
    START([Guru di Dashboard]) --> LOAD["Sistem Memuat Statistik Ringkasan Kelas
    (total siswa, rata-rata level, aktivitas terbaru)"]

    LOAD --> CH_AN{"Membuka Menu
    Analisis Jawaban?"}

    CH_AN -->|"Ya"| AN_LOAD["Sistem Mengambil
    Rekaman Jawaban Siswa"]
    AN_LOAD --> AN_TAB{"Pilih Tampilan?"}
    AN_TAB -->|"Ringkasan Progres"| AN_SUM["Tampilkan Kartu Progres per Siswa
    (status Pre-test, Post-test, dan skor)"]
    AN_TAB -->|"Tabel Detail"| AN_TBL["Tampilkan Tabel Jawaban Interaktif
    (dapat dicari dan difilter)"]
    AN_TBL --> AN_XLS["Guru Mengunduh
    Data dalam Format Excel"]
    AN_SUM --> BACK["Kembali ke Dashboard"]
    AN_TBL --> BACK
    AN_XLS --> BACK

    CH_AN -->|"Tidak"| CH_SOAL{"Membuka Menu
    Manajemen Soal?"}
    CH_SOAL -->|"Ya"| SOAL["Sistem Menampilkan Editor Bank Soal
    (Pre-test dan Post-test)"]
    SOAL --> S_ACT{"Aksi Guru?"}
    S_ACT -->|"Tambah"| S_ADD["Guru Membuat Soal Baru
    (soal, opsi, kunci, pembahasan)"]
    S_ACT -->|"Edit"| S_EDT["Guru Mengubah Soal"]
    S_ACT -->|"Hapus"| S_DEL["Guru Menghapus Soal"]
    S_ADD --> S_SAV["Sistem Menyimpan Perubahan"]
    S_EDT --> S_SAV
    S_DEL --> S_SAV
    S_SAV --> BACK

    CH_SOAL -->|"Tidak"| CH_OTHER{"Membuka Fitur
    Pendukung?"}
    CH_OTHER -->|"Ya"| OTHER["Fitur Pendukung yang Tersedia:
    • Manajemen Siswa — daftar dan progres siswa
    • Forum Diskusi — baca dan balas pesan siswa
    • Statistik Kelas — grafik distribusi level dan skor
    • Log Aktivitas — riwayat aktivitas seluruh siswa"]
    OTHER --> BACK

    CH_OTHER -->|"Tidak (Logout)"| LOGOUT["Sistem Mengakhiri Sesi
    dan Menghapus Data Login"]
    BACK --> CH_AN
    LOGOUT --> END_LOGOUT([Selesai])

    style START fill:#3b82f6,color:#fff,stroke:#2563eb,stroke-width:2px
    style END_LOGOUT fill:#22c55e,color:#fff,stroke:#16a34a,stroke-width:2px
    style OTHER fill:#f8fafc,color:#334155,stroke:#cbd5e1,stroke-width:1px
```

**Deskripsi:** Setelah guru masuk ke dashboard, sistem secara otomatis memuat statistik ringkasan kelas. Alur navigasi guru dirancang bertingkat berdasarkan prioritas fitur. Guru dapat mengakses menu Analisis Jawaban untuk melihat ringkasan progres siswa per individu atau menelusuri data jawaban dalam tabel interaktif yang dapat dicari dan diunduh dalam format Excel. Guru juga dapat mengelola bank soal pre-test dan post-test melalui menu Manajemen Soal, termasuk menambah, mengubah, dan menghapus soal beserta pembahasannya. Fitur pendukung lainnya — meliputi manajemen siswa, forum diskusi, statistik kelas, dan log aktivitas — dapat diakses melalui menu masing-masing. Sesi guru dapat diakhiri kapan saja melalui tombol logout.
