import React from 'react';
import { CheckCircle, BookOpen, Palette, ClipboardList } from 'lucide-react';

const aspects = [
  { label: 'Kelayakan Konten Materi', value: '92,5%', color: 'text-macaw', bar: 'bg-macaw' },
  { label: 'Kelayakan Desain Media', value: '92,18%', color: 'text-feather-dark', bar: 'bg-feather' },
  { label: 'Kelayakan Instrumen & Kesesuaian Soal', value: '91,25%', color: 'text-bee-dark', bar: 'bg-bee' },
];

export const Slide12: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Hasil Penelitian</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Validitas Ahli</h2>
    <p className="text-sm md:text-base text-slate-500 mb-4">Penilaian tiga validator ahli</p>

    <div className="flex flex-col lg:flex-row items-center gap-4 w-full max-w-5xl">
      <div className="bg-feather/5 border-2 border-feather/10 rounded-2xl p-5 md:p-6 text-center w-full lg:w-56 flex flex-col items-center">
        <p className="text-[10px] md:text-xs font-bold text-feather-dark uppercase tracking-wider mb-1">Rata-rata</p>
        <p className="text-5xl md:text-6xl font-black text-feather-dark font-display">
          {isActive ? '92,0' : '0'}<span className="text-3xl md:text-4xl">%</span>
        </p>
        <div className="flex items-center gap-1 mt-2 bg-feather text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
          <CheckCircle size={14} /> Sangat Valid
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden mt-3">
          <div className="h-full bg-feather rounded-full transition-all duration-1000 ease-out" style={{ width: isActive ? '92%' : '0%' }} />
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {aspects.map(a => (
          <div key={a.label} className="bg-white border-2 border-slate-200 rounded-xl p-3 md:p-4 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-bold text-xs md:text-sm text-slate-700">{a.label}</p>
              <p className={`font-extrabold text-xs md:text-sm ${a.color}`}>{a.value}</p>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${a.bar} rounded-full transition-all duration-1000 ease-out`} style={{ width: isActive ? a.value : '0%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
