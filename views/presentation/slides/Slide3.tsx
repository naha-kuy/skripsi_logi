import React from 'react';
import { EyeOff, Gamepad2, Sparkles } from 'lucide-react';

const columns = [
  {
    icon: EyeOff,
    title: 'Akar Permasalahan',
    accent: 'bg-cardinal',
    accentLight: 'bg-cardinal/10',
    color: 'text-cardinal',
    points: [
      'Visual 2D statis buku teks',
      'Hambat abstraksi geometri',
    ],
    ref: ''
  },
  {
    icon: Gamepad2,
    title: 'Kesenjangan Solusi',
    accent: 'bg-bee',
    accentLight: 'bg-bee/10',
    color: 'text-bee-dark',
    points: [
      'Gamifikasi picu tebak jawaban',
      'Terlalu fokus kejar poin',
      'Mastery learning kurang optimal',
    ],
    ref: ''
  },
  {
    icon: Sparkles,
    title: 'Inovasi Platform Logi',
    accent: 'bg-feather',
    accentLight: 'bg-feather/10',
    color: 'text-feather-dark',
    points: [
      'AI Generatif + HITL personal',
      'Kurasi guru memastikan kualitas soal',
    ],
    ref: ''
  }
];

export const Slide3 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <div className="flex items-center gap-2 mb-1">
      <div className="h-0.5 w-6 md:w-8 bg-feather rounded-full" />
      <span className="text-xs md:text-sm font-black text-feather-dark uppercase tracking-[0.25em]">Urgensi</span>
      <div className="h-0.5 w-6 md:w-8 bg-feather rounded-full" />
    </div>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">
      Mengapa Platform Baru?
    </h2>

    <div className="grid md:grid-cols-3 gap-4 w-full max-w-7xl">
      {columns.map(col => {
        const Icon = col.icon;
        return (
          <div key={col.title} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className={`h-1.5 ${col.accent}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${col.accentLight} flex items-center justify-center`}>
                  <Icon size={24} className={col.color} />
                </div>
                <h3 className={`font-extrabold text-xl md:text-2xl ${col.color}`}>{col.title}</h3>
              </div>
              <ul className="space-y-2 mb-4">
                {col.points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-lg md:text-xl text-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${col.color.replace('text-', 'bg-')} mt-2.5 shrink-0`} />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="text-xs md:text-sm text-slate-400 italic leading-relaxed">{col.ref}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
