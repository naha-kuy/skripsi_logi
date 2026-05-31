import React from 'react';
import { Box, Brain, BookX } from 'lucide-react';

const blocks = [
  { icon: Box, title: 'Visualisasi 3D', points: ['Siswa sulit visualisasi', 'Konsep abstrak geometri', 'Media konvensional statis'], color: 'text-cardinal', bg: 'bg-cardinal/5', border: 'border-cardinal/10' },
  { icon: Brain, title: 'CT Rendah', points: ['Computational Thinking rendah', 'Kurang latihan terstruktur', 'Kurikulum tuntut CT'], color: 'text-macaw', bg: 'bg-macaw/5', border: 'border-macaw/10' },
  { icon: BookX, title: 'Media Konvensional', points: ['Buku teks tidak interaktif', 'Minim teknologi adaptif', 'Perlu inovasi pembelajaran'], color: 'text-bee-dark', bg: 'bg-bee/5', border: 'border-bee/10' }
];

export const Slide3 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Pendahuluan</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Tiga Tantangan Utama</h2>
    <p className="text-sm md:text-base text-slate-500 mb-4 max-w-2xl">Pembelajaran geometri menghadapi kendala fundamental</p>

    <div className="grid md:grid-cols-3 gap-3 md:gap-4 w-full max-w-5xl">
      {blocks.map(b => {
        const Icon = b.icon;
        return (
          <div key={b.title} className={`${b.bg} ${b.border} border-2 rounded-2xl p-4 md:p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}>
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center mb-3`}>
              <Icon size={26} className={b.color} />
            </div>
            <h3 className={`font-extrabold text-base md:text-lg mb-2 ${b.color}`}>{b.title}</h3>
            <ul className="space-y-1.5">
              {b.points.map(p => (
                <li key={p} className="flex items-start gap-2 text-sm md:text-base text-slate-700">
                  <span className={`w-1.5 h-1.5 rounded-full ${b.color === 'text-cardinal' ? 'bg-cardinal' : b.color === 'text-macaw' ? 'bg-macaw' : 'bg-bee-dark'} mt-1.5 shrink-0`} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </div>
);
