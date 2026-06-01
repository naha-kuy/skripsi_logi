import React from 'react';
import { Layout, Paintbrush, Shield, Route, LogIn, Swords, ClipboardList, Eye, MessageSquare, TrendingUp, BookOpen, Trophy } from 'lucide-react';

const cards = [
  { icon: Layout, title: 'Arsitektur Platform', items: ['React + TypeScript', 'Supabase backend', 'Three.js 3D visual'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5' },
  { icon: Paintbrush, title: 'Desain Gamifikasi', items: ['Sistem point & XP', 'Badge pencapaian', 'Leaderboard realtime'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5' },
  { icon: Shield, title: 'Integrasi AI', items: ['Gemini API Google', 'Few-Shot prompting', 'Human-in-the-Loop'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5' },
  { icon: Route, title: 'Mastery Learning', items: ['Progress individu', 'Materi bertahap'], color: 'text-cardinal', border: 'border-cardinal/10', bg: 'bg-cardinal/5' }
];

const guruFlow = [
  { icon: ClipboardList, label: 'Kelola', desc: 'Kelola materi 3D' },
  { icon: Eye, label: 'Pantau', desc: 'Pantau progress siswa' },
  { icon: MessageSquare, label: 'Feedback', desc: 'Review jawaban' },
  { icon: TrendingUp, label: 'Evaluasi', desc: 'Analisis hasil CT' }
];

const siswaFlow = [
  { icon: LogIn, label: 'Login', desc: 'Masuk platform' },
  { icon: BookOpen, label: 'Belajar', desc: 'Materi 3D interaktif' },
  { icon: Swords, label: 'Latihan', desc: 'Soal gamifikasi' },
  { icon: Trophy, label: 'Progress', desc: 'Lihat pencapaian' }
];

export const Slide6 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-sm font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Design</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Perancangan arsitektur dan pengalaman pengguna</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-5xl mb-2 md:mb-3">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`${c.bg} ${c.border} border-2 rounded-2xl p-3 md:p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-1.5`}><Icon size={16} className={c.color} /></div>
            <h3 className={`font-extrabold text-sm md:text-base mb-1.5 ${c.color}`}>{c.title}</h3>
            <ul className="space-y-1">
              {c.items.map(item => (
                <li key={item} className="flex items-start gap-1.5 text-sm md:text-base text-slate-700">
                  <span className={`w-1 h-1 rounded-full ${c.color.replace('text-', 'bg-')} mt-1.5 shrink-0`} />{item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>

    <div className="w-full max-w-5xl space-y-1.5">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-fox/20" />
        <span className="text-xs font-black text-fox uppercase tracking-wider">Guru</span>
        <div className="h-px flex-1 bg-fox/20" />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {guruFlow.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="border-2 border-fox/10 bg-fox/5 rounded-2xl p-2 md:p-3">
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-1.5 gap-y-0.5">
                <div className="row-span-2 w-10 h-10 rounded-2xl flex items-center justify-center border-2 bg-fox/10 border-fox/20">
                  <Icon size={18} className="text-fox" />
                </div>
                <p className="font-extrabold text-xs md:text-sm text-slate-800 leading-tight text-left">{f.label}</p>
                <span className="text-xs font-black text-fox text-right">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-xs md:text-sm text-slate-500 leading-tight text-left col-start-2 col-span-2">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-macaw/20" />
        <span className="text-xs font-black text-macaw uppercase tracking-wider">Siswa</span>
        <div className="h-px flex-1 bg-macaw/20" />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {siswaFlow.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="border-2 border-macaw/10 bg-macaw/5 rounded-2xl p-2 md:p-3">
              <div className="grid grid-cols-[auto_1fr_auto] gap-x-1.5 gap-y-0.5">
                <div className="row-span-2 w-10 h-10 rounded-2xl flex items-center justify-center border-2 bg-macaw/10 border-macaw/20">
                  <Icon size={18} className="text-macaw" />
                </div>
                <p className="font-extrabold text-xs md:text-sm text-slate-800 leading-tight text-left">{f.label}</p>
                <span className="text-xs font-black text-macaw text-right">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-xs md:text-sm text-slate-500 leading-tight text-left col-start-2 col-span-2">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
