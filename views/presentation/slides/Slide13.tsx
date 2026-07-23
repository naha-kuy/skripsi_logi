import React from 'react';
import { ThumbsUp, Smile, CheckCircle } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';

const items = [
  'Mudah digunakan',
  'Alur mudah dipahami',
  'Petunjuk jelas',
  'Tampilan menarik',
  'Teks mudah dibaca',
  'Materi mudah dipahami',
  'Soal relevan',
  'Membantu pemahaman konsep',
  'Meningkatkan skill soal cerita',
  'Menyenangkan',
];

const percentages = [99.1, 98.21, 97.32, 97.32, 99.1, 99.1, 95.53, 99.1, 92.85, 99.1];

export const Slide13: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Praktikalitas</h2>

    <div className="flex flex-col lg:flex-row items-start gap-4 w-full max-w-7xl">
      <div className="bg-macaw/5 border-2 border-macaw/10 rounded-2xl p-5 text-center w-full lg:w-64 shrink-0 flex flex-col items-center">
        <p className="text-base md:text-lg font-bold text-macaw-dark uppercase tracking-wider mb-1">Rata-rata</p>
        <p className="text-5xl md:text-6xl font-black text-macaw-dark font-display">
          <CountUp value={97.7} trigger={isActive} decimals={1} suffix="%" />
        </p>
        <div className="flex items-center gap-1 mt-2 bg-macaw text-white text-base md:text-lg font-black uppercase tracking-wider px-4 py-1.5 rounded-full">
          <ThumbsUp size={16} /> Sangat Praktis
        </div>
        <BarAnimated isActive={isActive} color="bg-macaw" width="98%" trackBg="bg-white" className="mt-2" />
        <div className="flex items-center gap-1.5 mt-2 text-base md:text-lg text-slate-500">
          <Smile size={18} className="text-macaw-dark" /> 28 siswa partisipan
        </div>
      </div>

      <div className="flex-1 w-full grid sm:grid-cols-2 gap-3">
        {items.map((text, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 text-left">
            <div className="flex items-start gap-1.5 mb-0.5">
              <CheckCircle size={16} className="text-macaw-dark shrink-0 mt-0.5" />
              <p className="text-base md:text-lg text-slate-700 leading-snug">{text}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <BarAnimated isActive={isActive} color="bg-macaw" width={`${percentages[i]}%`} delay={i * 50} />
              </div>
              <span className="text-base md:text-lg font-bold text-macaw-dark tabular-nums shrink-0">
                <CountUp value={percentages[i]} trigger={isActive} decimals={percentages[i] % 1 === 0 ? 0 : percentages[i].toString().split('.')[1].length} suffix="%" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
