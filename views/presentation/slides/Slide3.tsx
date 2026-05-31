import React from 'react';
import { Target } from 'lucide-react';

export const Slide3 = () => (
  <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
    <div className="w-full md:w-1/2 flex flex-col gap-5">
      <div className="flex items-center gap-2 text-feather font-black text-base uppercase tracking-wider">
        <Target size={18} /> Latar Belakang Masalah
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display leading-tight">
        Tantangan Visualisasi Geometri Ruang 3D
      </h2>
      <div className="h-1.5 w-20 bg-feather rounded-full" />
      <ul className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed mt-2">
        <li className="flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 font-black text-sm mt-1">!</div>
          <span>Siswa kesulitan melakukan <strong>visualisasi spasial</strong> representasi 3D ke 2D.</span>
        </li>
        <li className="flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 font-black text-sm mt-1">!</div>
          <span>Kesulitan menangkap konsep <strong>abstrak geometris</strong> (jarak titik ke bidang, dll).</span>
        </li>
        <li className="flex gap-3 items-start">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500 font-black text-sm mt-1">!</div>
          <span>Rendahnya ketertarikan siswa akibat media ajar konvensional statis yang kurang interaktif.</span>
        </li>
      </ul>
    </div>
    
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      <div className="relative border-2 border-slate-200 rounded-3xl overflow-hidden aspect-video bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-8 shadow-sm">
        <div className="text-7xl mb-3 animate-bounce-slow">📐</div>
        <div className="font-bold text-slate-700 text-base">Visualisasi Geometri Dimensi Tiga</div>
        <p className="text-xs text-slate-500 text-center mt-2 max-w-sm">
          [PLACEHOLDER: Ilustrasi Interaktif Konsep Jarak dan Sudut dalam Bangun Ruang]
        </p>
        <div className="absolute bottom-2 right-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-mono">
          ilustrasi_kesulitan_geometri.png
        </div>
      </div>
      
      <div className="bg-feather/5 border-l-4 border-feather p-5 rounded-r-2xl">
        <p className="text-xs md:text-sm italic text-slate-600 font-medium leading-relaxed">
          "Visualisasi spasial adalah prasyarat utama dalam menguasai kompetensi ruang tiga dimensi."
        </p>
      </div>
    </div>
  </div>
);