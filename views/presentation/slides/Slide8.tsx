import React from 'react';
import { Award, Trophy, Star, Shield, TrendingUp } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

const features = [
  { icon: Star, title: 'Points & XP', items: ['XP setiap aktivitas', 'Level progresif'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5', accent: 'bg-bee' },
  { icon: Award, title: 'Badges', items: ['Unlock Materi bertahap'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5', accent: 'bg-macaw' },
  { icon: Trophy, title: 'Leaderboard', items: ['Peringkat realtime', 'Motivasi ekstrinsik'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5', accent: 'bg-feather' }
];

export const Slide8 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Fitur Platform</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Mastery Learning & PBL</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2">Point, Badge, Leaderboard sebagai motivator belajar</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 w-full max-w-4xl mb-2">
      <SlideImage imageName="ss_belajar.png" alt="Tampilan Belajar" aspect="1365/767" className="w-full" />
      <SlideImage imageName="ss_peringkat.png" alt="Tampilan Peringkat" aspect="1365/767" className="w-full" />
    </div>

    <div className="grid grid-cols-2 gap-2 md:gap-3 w-full max-w-4xl mb-2">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5">
        <Shield size={18} className="text-feather-dark shrink-0" />
        <div className="text-left">
          <p className="font-extrabold text-xs md:text-sm text-slate-800">Mastery Learning</p>
          <p className="text-[10px] md:text-xs text-slate-500">Progress bertahap</p>
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center gap-2.5">
        <Trophy size={18} className="text-macaw shrink-0" />
        <div className="text-left">
          <p className="font-extrabold text-xs md:text-sm text-slate-800">Gamified</p>
          <p className="text-[10px] md:text-xs text-slate-500">Belajar serasa bermain</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 w-full max-w-4xl">
      {features.map(f => {
        const Icon = f.icon;
        return (
          <div key={f.title} className={`${f.bg} ${f.border} border-2 rounded-2xl p-2.5 md:p-3.5 text-left transition-all hover:-translate-y-1 hover:shadow-lg`}>
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-2.5 gap-y-0.5 items-center">
              <div className="row-span-2 flex items-center justify-center h-full">
                <div className={`w-2 h-2 rounded-full ${f.accent} opacity-60`} />
              </div>
              <h3 className={`font-extrabold text-xs md:text-sm ${f.color}`}>{f.title}</h3>
              <div className="text-[11px] md:text-xs text-slate-700 space-y-0.5">
                {f.items.map(item => (
                  <div key={item} className="flex items-center gap-1.5">
                    <TrendingUp size={11} className={`${f.color} shrink-0`} />{item}
                  </div>
                ))}
              </div>
              <div className={`row-span-2 w-7 h-7 md:w-8 md:h-8 rounded-xl ${f.accent} flex items-center justify-center shadow-sm`}>
                <Icon size={14} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
