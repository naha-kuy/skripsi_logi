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
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-3">Metode Penelitian</h2>
    <p className="text-lg md:text-xl text-slate-500 mb-4">Research & Development dengan model ADDIE</p>

    <div className="w-full max-w-md mb-3">
      <SlideImage
        imageName="bagan_metode.png"
        alt="Bagan Metode Penelitian ADDIE"
        aspect="885/433"
        className="w-full"
      />
    </div>

    <div className="w-full max-w-6xl flex items-center">
      <div className="hidden md:block w-full">
        <div className="grid grid-cols-5 gap-2">
          {stages.map((s, i) => {
            const Icon = s.icon;
            const colors = ['text-macaw bg-macaw/10 border-macaw/20', 'text-feather-dark bg-feather/10 border-feather/20', 'text-bee-dark bg-bee/10 border-bee/20', 'text-fox bg-fox/10 border-fox/20', 'text-cardinal bg-cardinal/10 border-cardinal/20'];
            return (
              <button key={s.label} onClick={() => goSlide(s.target)}
                className="flex flex-col items-center text-center group transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 border-2 ${colors[i]} transition-colors group-hover:shadow-lg`}>
                  <Icon size={24} />
                </div>
                <span className={`text-base md:text-lg font-black ${colors[i].split(' ')[0]}`}>{String(i + 1).padStart(2, '0')}</span>
                <p className="font-extrabold text-lg md:text-xl text-slate-800 mt-1">{s.label}</p>
                <p className="text-lg md:text-xl text-slate-500 leading-tight">{s.desc}</p>
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
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${colors[i]}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-base text-slate-800">{s.label}</p>
                <p className="text-base text-slate-500">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
