import React from 'react';
import { ThumbsUp, Smile, CheckCircle } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';

const items = [
  'Platform Logi mudah digunakan oleh siswa.',
  'Alur permainan dalam platform mudah dipahami.',
  'Petunjuk bermain dalam platform terlihat jelas.',
  'Tampilan visual platform Logi menarik bagi siswa.',
  'Tulisan dan angka dalam platform mudah dibaca.',
  'Materi bangun ruang mudah dipahami.',
  'Soal sesuai dengan materi yang sedang dipelajari.',
  'Platform membantu memahami konsep bangun ruang.',
  'Platform meningkatkan keterampilan soal cerita.',
  'Belajar menggunakan platform terasa menyenangkan.',
];

const percentages = [99.1, 98.21, 97.32, 97.32, 99.1, 99.1, 95.53, 99.1, 92.85, 99.1];

export const Slide13: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Hasil Penelitian</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Praktikalitas</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Respons 28 siswa terhadap platform Logi</p>

    <div className="flex flex-col lg:flex-row items-start gap-3 w-full max-w-6xl">
      <div className="bg-macaw/5 border-2 border-macaw/10 rounded-2xl p-4 md:p-5 text-center w-full lg:w-56 shrink-0 flex flex-col items-center">
        <p className="text-[10px] md:text-xs font-bold text-macaw-dark uppercase tracking-wider mb-1">Rata-rata</p>
        <p className="text-4xl md:text-5xl font-black text-macaw-dark font-display">
          <CountUp value={97.7} trigger={isActive} decimals={1} suffix="%" />
        </p>
        <div className="flex items-center gap-1 mt-2 bg-macaw text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
          <ThumbsUp size={14} /> Sangat Praktis
        </div>
        <BarAnimated isActive={isActive} color="bg-macaw" width="98%" trackBg="bg-white" className="mt-2" />
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
          <Smile size={16} className="text-macaw-dark" /> 28 siswa partisipan
        </div>
      </div>

      <div className="flex-1 w-full grid sm:grid-cols-2 gap-1.5">
        {items.map((text, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-2.5 text-left">
            <div className="flex items-start gap-1.5 mb-0.5">
              <CheckCircle size={14} className="text-macaw-dark shrink-0 mt-0.5" />
              <p className="text-[11px] md:text-xs text-slate-700 leading-snug">{text}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <BarAnimated isActive={isActive} color="bg-macaw" width={`${percentages[i]}%`} delay={i * 50} />
              </div>
              <span className="text-[10px] font-bold text-macaw-dark tabular-nums shrink-0">
                <CountUp value={percentages[i]} trigger={isActive} decimals={percentages[i] % 1 === 0 ? 0 : percentages[i].toString().split('.')[1].length} suffix="%" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
