import React from 'react';
import { Search, PenTool, Code, Play, CheckCircle2 } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

const stages = [
  { icon: Search, label: 'Analisis', desc: 'Kebutuhan, subjek, pustaka', target: 5 },
  { icon: PenTool, label: 'Desain', desc: 'Arsitektur & gamifikasi', target: 6 },
  { icon: Code, label: 'Pengembangan', desc: 'Frontend, backend, AI', target: 7 },
  { icon: Play, label: 'Implementasi', desc: 'Uji coba lapangan', target: 11 },
  { icon: CheckCircle2, label: 'Evaluasi', desc: 'Validitas & efektivitas', target: 12 },
];

export const Slide4: React.FC<{ goSlide: (n: number) => void }> = ({ goSlide }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Metode</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Metode Penelitian</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2">Research & Development dengan model ADDIE</p>

    <div className="w-full max-w-lg mb-2">
      <SlideImage
        imageName="bagan_metode.png"
        alt="Bagan Metode Penelitian ADDIE"
        aspect="885/433"
        className="w-full"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-slate-400">Bagan Metode Penelitian ADDIE</p>
        </div>
      </SlideImage>
    </div>

    <div className="w-full max-w-5xl flex items-center">
      <div className="hidden md:block w-full">
        <div className="grid grid-cols-5 gap-1.5">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const colors = ['text-macaw bg-macaw/10 border-macaw/20', 'text-feather-dark bg-feather/10 border-feather/20', 'text-bee-dark bg-bee/10 border-bee/20', 'text-fox bg-fox/10 border-fox/20', 'text-cardinal bg-cardinal/10 border-cardinal/20'];
            return (
              <button key={s.label} onClick={() => goSlide(s.target)}
                className="flex flex-col items-center text-center group transition-all hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-0.5 border-2 ${colors[i]} transition-colors group-hover:shadow-lg`}>
                  <Icon size={18} />
                </div>
                <span className={`text-[10px] font-black ${colors[i].split(' ')[0]}`}>{String(i + 1).padStart(2, '0')}</span>
                <p className="font-extrabold text-[10px] md:text-xs text-slate-800 mt-0.5">{s.label}</p>
                <p className="text-[9px] md:text-[10px] text-slate-500 leading-tight">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:hidden flex flex-col items-center gap-2 w-full max-w-sm mx-auto">
        {stages.map((s, i) => {
          const Icon = s.icon;
          const colors = ['text-macaw bg-macaw/10 border-macaw/20', 'text-feather-dark bg-feather/10 border-feather/20', 'text-bee-dark bg-bee/10 border-bee/20', 'text-fox bg-fox/10 border-fox/20', 'text-cardinal bg-cardinal/10 border-cardinal/20'];
          return (
            <button key={s.label} onClick={() => goSlide(s.target)}
              className="flex items-center gap-3 w-full text-left group transition-all hover:-translate-y-0.5"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 ${colors[i]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
