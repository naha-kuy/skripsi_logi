import React from 'react';
import { Layout, Paintbrush, Shield, Route } from 'lucide-react';

const cards = [
  { icon: Layout, title: 'Arsitektur Platform', items: ['React + TypeScript', 'Supabase backend', 'Three.js 3D visual'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5' },
  { icon: Paintbrush, title: 'Desain Gamifikasi', items: ['Sistem point & XP', 'Badge pencapaian', 'Leaderboard realtime'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5' },
  { icon: Shield, title: 'Integrasi AI', items: ['Gemini API Google', 'Few-Shot prompting', 'Human-in-the-Loop'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5' },
  { icon: Route, title: 'Mastery Learning', items: ['Progress individu', 'Materi bertahap'], color: 'text-cardinal', border: 'border-cardinal/10', bg: 'bg-cardinal/5' }
];

export const Slide6 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Design</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Perancangan arsitektur dan pengalaman pengguna</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-5xl">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`${c.bg} ${c.border} border-2 rounded-2xl p-3 md:p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-1.5`}><Icon size={16} className={c.color} /></div>
            <h3 className={`font-extrabold text-xs md:text-sm mb-1.5 ${c.color}`}>{c.title}</h3>
            <ul className="space-y-1">
              {c.items.map(item => (
                <li key={item} className="flex items-start gap-1.5 text-xs md:text-sm text-slate-700">
                  <span className={`w-1 h-1 rounded-full ${c.color.replace('text-', 'bg-')} mt-1.5 shrink-0`} />{item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </div>
);
