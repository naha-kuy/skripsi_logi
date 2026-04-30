# Laporan Bedah Kode Mendalam (Post-Remediation)

Berdasarkan perbaikan ekstensif yang sudah dilakukan sebelumnya (keamanan password, RLS, routing, dsb), codebase saat ini sudah jauh lebih solid dan *production-ready*. Namun, sebagai Senior Full-Stack Developer, jika kita membedah lebih dalam ke area **Arsitektur Tingkat Lanjut, Skalabilitas, dan Multiplayer Logic**, masih terdapat beberapa ruang untuk optimasi.

## Ringkasan Temuan Audit

| Kategori | Masalah | Tingkat Keparahan | File Terkait | Solusi Ringkas |
| :--- | :--- | :---: | :--- | :--- |
| **Arsitektur (Anti-Pattern)** | Komponen raksasa (*God Object*) dengan *Coupling* yang tinggi antara UI, logika Game, dan Jaringan (*Networking*). | 🟠 Medium | `AdventureGame.tsx`, `MazeGame.tsx` | Ekstrak logika *Multiplayer/Supabase Channels* ke dalam *custom hook* independen (misal: `useMultiplayer.ts`). |
| **Keamanan (Multiplayer)** | *Client-Side Trust* pada Broadcast Skor. Pemain dapat memanipulasi dan memalsukan *payload* `score_update` via sisi *client*. | 🔴 High | `AdventureGame.tsx`, `MazeGame.tsx` | Kirimkan event aksi (misal: `answered_correctly`) dan biarkan setiap *client* yang menghitung skornya secara mandiri, bukan mengirim skor absolut. |
| **Efisiensi Algoritma** | Bias pada fungsi pengacakan array (`0.5 - Math.random()`) dan penggunaan rumusan jarak (*Euclidean*) yang *verbose*. | 🟡 Low | `AdventureGame.tsx` (baris 149 & 155) | Gunakan algoritma *Fisher-Yates Shuffle* murni dan metode `Math.hypot()` untuk kalkulasi jarak 2D yang lebih cepat dan bersih. |
| **Clean Code** | Terdapat *Dead Code* (kode mati) dan variabel *mocking* yang dideklarasikan tapi tidak berdampak pada fungsi. | 🟡 Low | `AdventureGame.tsx`, `MazeGame.tsx` | Hapus deklarasi variabel `userTopics` dan `_topics` yang mengotori *scope* fungsi inisialisasi AI. |
| **Koneksi Database** | Tidak ada penanganan jika koneksi WebSockets/Realtime Supabase terputus di tengah permainan (*Reconnect Logic*). | 🟠 Medium | `AdventureGame.tsx`, `MazeGame.tsx` | Tambahkan *event listener* berjenis `system` di `supabase.channel` untuk mendeteksi *disconnect* (*timeout/error*) dan mencoba *re-subscribe*. |

---

## Penjelasan Mendetail & Rekomendasi Solusi

### 1. Arsitektur Komponen Raksasa (God Object Anti-Pattern)
**Konteks & Masalah:**
File game memiliki panjang lebih dari 600 baris. File ini menanggung beban rendering UI, kalkulasi matriks 2D, animasi (*shaking/flashing*), sinkronisasi Supabase Realtime (*channel/broadcast*), status lobby (*join/create*), masukan *joystick*, dan *state* kuis. Ini sangat melanggar prinsip desain *Single Responsibility Principle (SRP)*. Membaca, melakukan *debugging*, dan memelihara kode ini ke depannya akan sangat menyulitkan dan rawan *error* yang tidak disengaja.

**Solusi Teknis:**
Pisahkan menjadi beberapa abstraksi. Logika *lobby* dan sinkronisasi jaringan seharusnya berada di luar komponen visual. Buat sebuah custom hook baru, contohnya `useMultiplayer.ts` untuk menangani semua komunikasi antar pemain.

### 2. Celah Keamanan Skoring Multiplayer (Client-Side Trust)
**Konteks & Masalah:**
Aplikasi secara mentah mengirimkan pembaruan skor dalam bentuk *payload* absolut dari *client-to-client*. Pemain nakal dapat dengan mudah menyuntikkan dan mengirimkan *payload* skor palsu untuk memenangkan mode *Duel*.

**Solusi Teknis:**
Alih-alih mengirim skor absolut, kirimkan event aksi (*Event-driven*). Misalnya, kirim pesan bahwa "Pemain A menjawab benar". Sisi lawan yang menerima pesan tersebut akan menambahkan skor Pemain A di tampilannya sendiri. Ini mencegah pengiriman skor arbitrer dari sisi *client*.

### 3. Bias Pengacakan Array & Kalkulasi Jarak
**Konteks & Masalah:**
Penggunaan `floorPositions.sort(() => 0.5 - Math.random())` tidak menghasilkan acakan yang merata (*biased shuffle*). Selain itu, kalkulasi jarak menggunakan rumusan *Euclidean* klasik `Math.sqrt(Math.pow(x,2) + Math.pow(y,2))` tergolong tidak efisien secara semantik.

**Solusi Teknis:**
Gunakan algoritma *Fisher-Yates Shuffle* untuk pengacakan yang benar-benar acak. Untuk kalkulasi jarak, gunakan fungsi bawaan `Math.hypot` yang lebih ringkas dan dioptimasi oleh *engine*.

### 4. Penanganan Disconnect pada Supabase Realtime
**Konteks & Masalah:**
Tidak ada mekanisme penanganan *error* atau pemberitahuan UI jika koneksi WebSockets Supabase terputus di tengah permainan, yang bisa merusak sinkronisasi antar pemain.

**Solusi Teknis:**
Gunakan *event listener* internal Supabase untuk memonitor status jaringan (`system`). Berikan indikator visual atau notifikasi kepada user jika koneksi terputus dan coba lakukan *re-subscribe* secara otomatis.

### 5. Dead Code (Kode Mati)
**Konteks & Masalah:**
Terdapat variabel `userTopics` dan `_topics` yang dikonstruksi tapi tidak pernah digunakan dalam logika game atau AI.

**Solusi Teknis:**
Bersihkan variabel-variabel tersebut untuk menjaga kebersihan kode dan sedikit menghemat beban memori.
