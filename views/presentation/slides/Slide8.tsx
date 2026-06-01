import React from 'react';
import { Award, Trophy, Star, Shield, Zap } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

const items = [
  { icon: Shield, title: 'Mastery Learning', color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5', accent: 'bg-feather' },
  { icon: Zap, title: 'Gamified', color: 'text-cardinal', border: 'border-cardinal/10', bg: 'bg-cardinal/5', accent: 'bg-cardinal' },
  { icon: Star, title: 'Points & XP', color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5', accent: 'bg-bee' },
  { icon: Award, title: 'Badges', color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5', accent: 'bg-macaw' },
  { icon: Trophy, title: 'Leaderboard', color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5', accent: 'bg-feather' }
];

export const Slide8 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Mastery Learning & PBL</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-5xl mb-4">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-2 bg-feather" />
        <SlideImage imageName="ss_belajar.png" alt="Tampilan Belajar" aspect="1365/767" className="w-full" />
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="h-2 bg-macaw" />
        <SlideImage imageName="ss_peringkat.png" alt="Tampilan Peringkat" aspect="1365/767" className="w-full" />
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-5xl">
      {items.map(f => {
        const Icon = f.icon;
        return (
          <div key={f.title} className={`${f.bg} ${f.border} border-2 rounded-2xl p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg`}>
            <div className={`w-12 h-12 rounded-xl ${f.accent} flex items-center justify-center shadow-sm mx-auto mb-2`}>
              <Icon size={24} className="text-white" />
            </div>
            <h3 className={`font-extrabold text-lg md:text-xl ${f.color}`}>{f.title}</h3>
          </div>
        );
      })}
    </div>
  </div>
);
