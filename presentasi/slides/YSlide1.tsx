import React from 'react';

export const YSlide1 = () => (
  <div className="flex flex-col items-center justify-center text-center text-white px-4 w-full max-w-7xl mx-auto h-full select-none pt-8 md:pt-12">
    <div className="animate-bounce-slow mb-6">
      <div className="w-36 h-36 md:w-44 md:h-44 bg-white/10 backdrop-blur border-2 border-white/20 rounded-full flex items-center justify-center text-6xl md:text-7xl shadow-xl overflow-hidden relative">
        <img
          src="/images/presentation/logo_um.png"
          alt="Logo UM"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          className="w-full h-full object-contain p-2"
        />
      </div>
    </div>
    <div className="uppercase tracking-widest text-base md:text-lg font-black text-fox mb-4">
      UNIVERSITAS NEGERI MALANG • FAKULTAS SASTRA
    </div>

    <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-6xl text-white font-display mb-4">
      PENGEMBANGAN MEDIA GAME PUZZLE TAKTIL BERBASIS KODE QR MATERI RAGAM HIAS UNTUK MENINGKATKAN PEMAHAMAN SISWA MTSN 1 KEDIRI
    </h1>

    <div className="h-1.5 w-32 md:w-40 bg-gradient-to-r from-fox to-fox-dark rounded-full mb-6 mx-auto" />

    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 w-full max-w-5xl mx-auto shadow-2xl flex flex-col md:flex-row gap-5 items-center justify-center text-left">
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center text-slate-300 relative shadow-md">
          <img
            src="/images/presentation/foto_yuli.JPG"
            alt="Foto Yulia"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-base md:text-lg">
        <div>
          <p className="text-base md:text-lg text-slate-400 font-bold uppercase tracking-wider">Nama Mahasiswa</p>
          <p className="text-lg md:text-xl font-extrabold text-white mt-0.5">Yulia Nuraini</p>
          <p className="text-base text-slate-300">NIM. 220251603151</p>
        </div>
        <div>
          <p className="text-base md:text-lg text-slate-400 font-bold uppercase tracking-wider">Program Studi</p>
          <p className="text-lg md:text-xl font-bold text-white mt-0.5">S1 Pendidikan Seni Rupa</p>
          <p className="text-base text-slate-300">Fakultas Sastra</p>
        </div>
        <div>
          <p className="text-base md:text-lg text-slate-400 font-bold uppercase tracking-wider">Dosen Pembimbing</p>
          <p className="text-lg md:text-xl font-bold text-fox mt-0.5">Dr. Iriaji, M.Pd</p>
        </div>
        <div>
          <p className="text-base md:text-lg text-slate-400 font-bold uppercase tracking-wider">Tanggal Sidang</p>
          <p className="text-lg md:text-xl font-bold text-white mt-0.5">24 Juli 2026</p>
        </div>
      </div>
    </div>
  </div>
);
