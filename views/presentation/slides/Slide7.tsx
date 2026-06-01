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
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Development</h2>

    <div className="grid grid-cols-2 gap-4 w-full max-w-5xl mb-4">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-2 bg-feather" />
        <SlideImage
          imageName="ss_dashboard.png"
          alt="Tampilan Dashboard"
          aspect="1365/767"
          className="w-full"
        />
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-2 bg-macaw" />
        <SlideImage
          imageName="ss_3d.png"
          alt="Tampilan Game 3D"
          aspect="1365/767"
          className="w-full"
        />
      </div>
    </div>

    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 w-full max-w-5xl">
      {tech.map(t => {
        const Icon = t.icon;
        return (
          <div key={t.label} className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 text-center transition-all hover:border-feather/30 hover:bg-feather/5">
            <Icon size={22} className="text-feather-dark mx-auto mb-1" />
            <p className="font-extrabold text-base md:text-lg text-slate-700">{t.label}</p>
            <p className="text-sm md:text-base text-slate-400">{t.sub}</p>
          </div>
        );
      })}
    </div>
  </div>
);
