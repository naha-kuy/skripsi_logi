import React from 'react';
import { Target, Users, ClipboardList, BookOpen } from 'lucide-react';

const cards = [
  { icon: Users, title: 'Subjek Penelitian', items: ['28 siswa kelas VIII', 'MTsN 1 Kediri'], color: 'text-macaw', border: 'border-macaw/10', bg: 'bg-macaw/5' },
  { icon: ClipboardList, title: 'Analisis Kebutuhan', items: ['Studi literatur CT'], color: 'text-feather-dark', border: 'border-feather/10', bg: 'bg-feather/5' },
  { icon: BookOpen, title: 'Kajian Pustaka', items: ['Computational Thinking', 'Gamifikasi PBL', 'AI Generatif'], color: 'text-bee-dark', border: 'border-bee/10', bg: 'bg-bee/5' },
  { icon: Target, title: 'Rumusan Masalah', items: ['Validitas produk?', 'Praktikalitas produk?', 'Efektivitas produk?'], color: 'text-cardinal', border: 'border-cardinal/10', bg: 'bg-cardinal/5' }
];

export const Slide5 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Analisis</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full max-w-6xl flex-1 items-stretch">
      {cards.map(c => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`${c.bg} ${c.border} border-2 rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col`}>
            <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-2`}><Icon size={20} className={c.color} /></div>
            <h3 className={`font-extrabold text-lg md:text-xl mb-2 ${c.color}`}>{c.title}</h3>
            <ul className="space-y-1 flex-1">
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

  </div>
);
