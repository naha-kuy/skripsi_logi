import React from 'react';
import { Target, Users, ClipboardList, BookOpen } from 'lucide-react';

const cards = [
  { icon: Users, title: 'Subjek Penelitian', items: ['28 siswa kelas VIII', 'MTsN 1 Kediri'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5' },
  { icon: ClipboardList, title: 'Analisis Kebutuhan', items: ['Studi literatur CT'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5' },
  { icon: BookOpen, title: 'Kajian Pustaka', items: ['Computational Thinking', 'Gamifikasi PBL', 'AI Generatif'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5' },
  { icon: Target, title: 'Rumusan Masalah', items: ['Validitas produk?', 'Praktikalitas produk?', 'Efektivitas produk?'], color: 'text-cardinal', border: 'border-cardinal/10', bg: 'bg-cardinal/5' }
];

export const Slide5 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-sm font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Analisis</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Identifikasi masalah dan kebutuhan pembelajaran</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-5xl flex-1 items-stretch">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`${c.bg} ${c.border} border-2 rounded-2xl p-3 md:p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col`}>
            <div className={`w-8 h-8 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-1.5`}><Icon size={16} className={c.color} /></div>
            <h3 className={`font-extrabold text-sm md:text-base mb-1.5 ${c.color}`}>{c.title}</h3>
            <ul className="space-y-1 flex-1">
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

  </div>
);
