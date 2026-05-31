import React from 'react';
import { Award, Trophy, Star, TrendingUp, Shield, Zap } from 'lucide-react';

const features = [
  { icon: Star, title: 'Points & XP', items: ['XP setiap aktivitas', 'Level progresif'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5', accent: 'bg-bee' },
  { icon: Award, title: 'Badges', items: ['Unlock Materi bertahap'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5', accent: 'bg-macaw' },
  { icon: Trophy, title: 'Leaderboard', items: ['Peringkat realtime', 'Motivasi ekstrinsik'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5', accent: 'bg-feather' }
];

export const Slide8 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Fitur Platform</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Mastery Learning & PBL</h2>
    <p className="text-sm md:text-base text-slate-500 mb-4">Point, Badge, Leaderboard sebagai motivator belajar</p>

    <div className="grid md:grid-cols-3 gap-3 md:gap-4 w-full max-w-5xl mb-4">
      {features.map(f => {
        const Icon = f.icon;
        return (
          <div key={f.title} className={`${f.bg} ${f.border} border-2 rounded-2xl p-4 md:p-5 text-left transition-all hover:-translate-y-1 hover:shadow-lg`}>
            <div className={`w-10 h-10 rounded-xl ${f.accent} flex items-center justify-center mb-2 shadow-sm`}>
              <Icon size={20} className="text-white" />
            </div>
            <h3 className={`font-extrabold text-base md:text-lg mb-2 ${f.color}`}>{f.title}</h3>
            <ul className="space-y-1.5">
              {f.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm md:text-base text-slate-700">
                  <TrendingUp size={16} className={`${f.color} mt-0.5 shrink-0`} />{item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>

    <div className="w-full max-w-4xl bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <div className="bg-slate-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <Shield size={24} className="text-feather-dark shrink-0" />
        <div className="text-left">
          <p className="font-extrabold text-sm md:text-base text-slate-800">Mastery Learning</p>
          <p className="text-[11px] md:text-xs text-slate-500">Progress individu bertahap</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <Zap size={24} className="text-bee-dark shrink-0" />
        <div className="text-left">
          <p className="font-extrabold text-sm md:text-base text-slate-800">Adaptif</p>
          <p className="text-[11px] md:text-xs text-slate-500">Materi sesuai kemampuan</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 md:p-4 flex items-center gap-3">
        <Trophy size={24} className="text-macaw shrink-0" />
        <div className="text-left">
          <p className="font-extrabold text-sm md:text-base text-slate-800">Gamified</p>
          <p className="text-[11px] md:text-xs text-slate-500">Belajar serasa bermain</p>
        </div>
      </div>
    </div>
  </div>
);
