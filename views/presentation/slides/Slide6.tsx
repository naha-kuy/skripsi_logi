import React from 'react';
import { Layout, Paintbrush, Shield, Route, LogIn, Swords, ClipboardList, Eye, MessageSquare, TrendingUp, BookOpen, Trophy } from 'lucide-react';

const cards = [
  { icon: Layout, title: 'Arsitektur Platform', items: ['React + TypeScript', 'Supabase backend', 'Three.js 3D visual'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5' },
  { icon: Paintbrush, title: 'Desain Gamifikasi', items: ['Sistem point & XP', 'Badge pencapaian', 'Leaderboard realtime'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5' },
  { icon: Shield, title: 'Integrasi AI', items: ['Gemini API Google', 'Few-Shot prompting', 'Human-in-the-Loop'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5' },
  { icon: Route, title: 'Mastery Learning', items: ['Progress individu', 'Materi bertahap'], color: 'text-cardinal', border: 'border-cardinal/10', bg: 'bg-cardinal/5' }
];

const guruFlow = [
  { icon: ClipboardList, label: 'Kelola' },
  { icon: Eye, label: 'Pantau' },
  { icon: MessageSquare, label: 'Feedback' },
  { icon: TrendingUp, label: 'Evaluasi' }
];

const siswaFlow = [
  { icon: LogIn, label: 'Login' },
  { icon: BookOpen, label: 'Belajar' },
  { icon: Swords, label: 'Latihan' },
  { icon: Trophy, label: 'Progress' }
];

export const Slide6 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Design</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-6xl mb-4">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`${c.bg} ${c.border} border-2 rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-2`}><Icon size={20} className={c.color} /></div>
            <h3 className={`font-extrabold text-lg md:text-xl mb-2 ${c.color}`}>{c.title}</h3>
            <ul className="space-y-1">
              {c.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-lg md:text-xl text-slate-700">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.color.replace('text-', 'bg-')} mt-2 shrink-0`} />{item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>

    <div className="w-full max-w-6xl space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-fox/20" />
        <span className="text-sm font-black text-fox uppercase tracking-wider">Guru</span>
        <div className="h-px flex-1 bg-fox/20" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {guruFlow.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="border-2 border-fox/10 bg-fox/5 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-sm font-black text-fox">{String(i + 1).padStart(2, '0')}</span>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 bg-fox/10 border-fox/20">
                <Icon size={22} className="text-fox" />
              </div>
              <p className="font-extrabold text-lg md:text-xl text-slate-800">{f.label}</p>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-macaw/20" />
        <span className="text-sm font-black text-macaw uppercase tracking-wider">Siswa</span>
        <div className="h-px flex-1 bg-macaw/20" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {siswaFlow.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="border-2 border-macaw/10 bg-macaw/5 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span className="text-sm font-black text-macaw">{String(i + 1).padStart(2, '0')}</span>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 bg-macaw/10 border-macaw/20">
                <Icon size={22} className="text-macaw" />
              </div>
              <p className="font-extrabold text-lg md:text-xl text-slate-800">{f.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
