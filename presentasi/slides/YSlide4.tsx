import React from 'react';
import { Search, PenTool, Code, Play, CheckCircle2 } from 'lucide-react';

const stages = [
  { icon: Search, label: 'Analysis', desc: 'Menganalisis kebutuhan siswa', color: 'text-macaw', border: 'border-macaw/20', bg: 'bg-macaw/5' },
  { icon: PenTool, label: 'Design', desc: 'Merancang media', color: 'text-fox', border: 'border-fox/20', bg: 'bg-fox/5' },
  { icon: Code, label: 'Development', desc: 'Mengembangkan media', color: 'text-feather-dark', border: 'border-feather/20', bg: 'bg-feather/5' },
  { icon: Play, label: 'Implementation', desc: 'Penerapan media', color: 'text-cardinal', border: 'border-cardinal/20', bg: 'bg-cardinal/5' },
  { icon: CheckCircle2, label: 'Evaluation', desc: 'Evaluasi hasil uji coba', color: 'text-bee-dark', border: 'border-bee/20', bg: 'bg-bee/5' }
];

export const YSlide4 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full min-h-[calc(100vh-10rem)]">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-2">Metode Penelitian</h2>
    <p className="text-lg md:text-xl text-slate-500 mb-6 font-bold">Research &amp; Development dengan model ADDIE</p>

    <div className="w-full mx-auto flex-1 flex items-center">
      <div className="flex flex-wrap gap-y-10 justify-center gap-x-10 w-full">
        {stages.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex flex-col items-center gap-3 flex-1 min-w-[8rem]">
              <span className="text-sm font-black text-slate-400 tracking-wider">{String(i + 1).padStart(2, '0')}</span>
              <div className={`w-24 h-24 rounded-full ${s.bg} border-[3px] ${s.border} flex items-center justify-center shadow-lg`}>
                <Icon size={38} className={s.color} />
              </div>
              <p className={`font-extrabold text-xl md:text-2xl ${s.color}`}>{s.label}</p>
              <p className="text-sm md:text-base text-slate-500 text-center leading-snug">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
