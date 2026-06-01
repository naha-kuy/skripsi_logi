import React from 'react';

export const Slide1 = () => (
  <div className="flex flex-col items-center justify-center text-center text-white px-2 md:px-4 w-full max-w-6xl mx-auto h-full select-none py-0">
    <div className="animate-bounce-slow mb-6 md:mb-8">
      <div className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 bg-white/10 backdrop-blur border-2 border-white/20 rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-xl overflow-hidden relative">
        <img 
          src="/images/presentation/logo_um.png" 
          alt="Logo UM" 
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
          className="w-full h-full object-contain p-2"
        />
        <div className="hidden absolute inset-0 items-center justify-center text-6xl">
          🏫
        </div>
      </div>
    </div>
    <div className="uppercase tracking-widest text-sm md:text-base lg:text-sm font-black text-feather-light mb-4 md:mb-6">
      UNIVERSITAS NEGERI MALANG • FAKULTAS MIPA
    </div>
    
    <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight max-w-5xl text-white font-display mb-4 md:mb-6">
      Meningkatkan Berpikir Komputasional Siswa melalui Platform Pembelajaran Berbasis Game Terintegrasi AI Generatif
    </h1>
    
    <div className="h-1.5 w-28 md:w-36 bg-gradient-to-r from-feather to-feather-light rounded-full mb-6 md:mb-8 mx-auto" />
    
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 w-full max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center text-left">
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center text-slate-300 relative shadow-md">
          <img 
            src="/images/presentation/foto_pribadi.png" 
            alt="Foto Pribadi" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
        <div>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-wider">Nama Mahasiswa</p>
          <p className="text-sm md:text-base lg:text-lg font-extrabold text-white mt-0.5">Muhammad Nafis Hakim</p>
          <p className="text-sm text-slate-300">NIM. 220311605217</p>
        </div>
        <div>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-wider">Program Studi</p>
          <p className="text-sm md:text-base lg:text-lg font-bold text-white mt-0.5">S1 Pendidikan Matematika</p>
          <p className="text-sm text-slate-300">Jurusan Matematika</p>
        </div>
        <div>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-wider">Dosen Pembimbing</p>
          <p className="text-sm md:text-base lg:text-lg font-bold text-feather-light mt-0.5">Indriati Nurul Hidayah, S.Pd, M.Si</p>
        </div>
        <div>
          <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-wider">Tanggal Ujian Sidang</p>
          <p className="text-sm md:text-base lg:text-lg font-bold text-white mt-0.5">2 Juni 2026</p>
        </div>
      </div>
    </div>
  </div>
);
