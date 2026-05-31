import React from 'react';
import { User2 } from 'lucide-react';

export const Slide15 = () => (
  <div className="flex flex-col items-center justify-center text-center text-white px-4 md:px-8 w-full max-w-5xl h-full select-none">
    <div className="w-32 h-32 mb-4 bg-white/10 backdrop-blur border-2 border-white/20 rounded-full flex items-center justify-center text-5xl shadow-xl overflow-hidden relative">
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
        🎓
      </div>
    </div>
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-5xl text-white font-display mb-4">
      Terima Kasih
    </h1>
    <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-6 font-display italic">
      "Meningkatkan Berpikir Komputasional Siswa melalui Platform Pembelajaran Berbasis Game Terintegrasi AI Generatif"
    </p>
    
    <div className="h-1.5 w-32 bg-gradient-to-r from-feather to-feather-light rounded-full mb-6 mx-auto" />

    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-4xl mx-auto shadow-2xl flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center text-left">
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-32 h-32 rounded-2xl bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center text-slate-300 relative shadow-md">
          <img 
            src="/images/presentation/foto_pribadi.png" 
            alt="Foto Pribadi" 
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Mahasiswa</p>
          <p className="text-base font-extrabold text-white mt-0.5">Muhammad Nafis Hakim</p>
          <p className="text-xs text-slate-300">NIM. 220311605217</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Program Studi</p>
          <p className="text-base font-bold text-white mt-0.5">S1 Pendidikan Matematika</p>
          <p className="text-xs text-slate-300">Jurusan Matematika</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dosen Pembimbing</p>
          <p className="text-base font-bold text-feather-light mt-0.5">Indriati Nurul Hidayah, S.Pd, M.Si</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tanggal Ujian Sidang</p>
          <p className="text-base font-bold text-white mt-0.5">2 Juni 2026</p>
        </div>
      </div>
    </div>
  </div>
);
