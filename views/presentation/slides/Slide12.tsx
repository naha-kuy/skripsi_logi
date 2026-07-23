import React from 'react';
import { CheckCircle } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';

const aspects = [
  { label: 'Kelayakan Konten Materi', numValue: 92.5, decimals: 1, barW: '92.5%', color: 'text-macaw', bar: 'bg-macaw' },
  { label: 'Kelayakan Desain Media', numValue: 92.18, decimals: 2, barW: '92.18%', color: 'text-feather-dark', bar: 'bg-feather' },
  { label: 'Instrumen & Kesesuaian Soal', numValue: 91.25, decimals: 2, barW: '91.25%', color: 'text-bee-dark', bar: 'bg-bee' },
];

export const Slide12: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Validitas Ahli</h2>

    <div className="flex flex-col lg:flex-row items-center gap-4 w-full max-w-6xl">
      <div className="bg-feather/5 border-2 border-feather/10 rounded-2xl p-5 text-center w-full lg:w-64 shrink-0 flex flex-col items-center">
        <p className="text-base md:text-lg font-bold text-feather-dark uppercase tracking-wider mb-1">Rata-rata</p>
        <p className="text-5xl md:text-6xl font-black text-feather-dark font-display">
          <CountUp value={92.0} trigger={isActive} decimals={1} suffix="%" />
        </p>
        <div className="flex items-center gap-1 mt-2 bg-feather text-white text-base md:text-lg font-black uppercase tracking-wider px-4 py-1.5 rounded-full">
          <CheckCircle size={16} /> Sangat Valid
        </div>
        <BarAnimated isActive={isActive} color="bg-feather" width="92%" trackBg="bg-white" className="mt-2" />
      </div>

      <div className="flex-1 w-full space-y-2">
        {aspects.map((a, idx) => (
          <div key={a.label} className="bg-white border-2 border-slate-200 rounded-xl p-3 text-left">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-lg md:text-xl text-slate-700">{a.label}</p>
              <p className={`font-extrabold text-lg md:text-xl ${a.color}`}>
                <CountUp value={a.numValue} trigger={isActive} decimals={a.decimals} suffix="%" />
              </p>
            </div>
            <BarAnimated isActive={isActive} color={a.bar} width={a.barW} delay={(idx + 1) * 100} />
          </div>
        ))}
      </div>
    </div>
  </div>
);
