import React from 'react';
import { Globe, Smartphone, Code2, Database, Cpu, Lock } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

const tech = [
  { icon: Code2, label: 'React + Vite', sub: 'TypeScript' },
  { icon: Database, label: 'Supabase', sub: 'Auth & DB' },
  { icon: Cpu, label: 'Gemini AI', sub: 'Generatif' },
  { icon: Smartphone, label: 'Responsive', sub: 'Mobile first' },
  { icon: Lock, label: 'RLS Policy', sub: 'Keamanan' },
  { icon: Globe, label: 'Vercel', sub: 'Deploy' }
];

export const Slide7 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Development</h2>
    <p className="text-sm md:text-base text-slate-500 mb-3">Membangun platform Logi secara teknis</p>

    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-4xl mb-4">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-2 bg-feather" />
        <SlideImage
          imageName="screenshot_dashboard.png"
          alt="Tampilan Dashboard"
          aspect="4/3"
          className="w-full"
        >
          <p className="text-[11px] md:text-xs font-bold text-slate-400">Tampilan Dashboard</p>
        </SlideImage>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-2 bg-macaw" />
        <SlideImage
          imageName="screenshot_game_3d.png"
          alt="Tampilan Game 3D"
          aspect="4/3"
          className="w-full"
        >
          <p className="text-[11px] md:text-xs font-bold text-slate-400">Tampilan Game 3D</p>
        </SlideImage>
      </div>
    </div>

    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 w-full max-w-4xl">
      {tech.map(t => {
        const Icon = t.icon;
        return (
          <div key={t.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 md:p-4 text-center transition-all hover:border-feather/30 hover:bg-feather/5">
            <Icon size={20} className="text-feather-dark mx-auto mb-1.5" />
            <p className="font-extrabold text-[11px] md:text-xs text-slate-700">{t.label}</p>
            <p className="text-[10px] md:text-[11px] text-slate-400">{t.sub}</p>
          </div>
        );
      })}
    </div>
  </div>
);
