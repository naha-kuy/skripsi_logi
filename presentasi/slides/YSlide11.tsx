import React from 'react';
import { Presentation, Building, FlaskConical } from 'lucide-react';

const saranList = [
  {
    icon: Presentation,
    title: 'Bagi Guru',
    items: ['Menggunakan media sebagai alternatif pembelajaran materi ragam hias.'],
    color: 'text-fox',
    bg: 'bg-fox/5',
    border: 'border-fox/10'
  },
  {
    icon: Building,
    title: 'Bagi Sekolah',
    items: ['Mendukung pengembangan media pembelajaran berbasis budaya lokal dan teknologi.'],
    color: 'text-macaw',
    bg: 'bg-macaw/5',
    border: 'border-macaw/10'
  },
  {
    icon: FlaskConical,
    title: 'Bagi Peneliti Selanjutnya',
    items: ['Mengembangkan media pada materi seni rupa lainnya dengan fitur yang lebih inovatif.'],
    color: 'text-feather-dark',
    bg: 'bg-feather/5',
    border: 'border-feather/10'
  }
];

export const YSlide11 = () => (
    <div className="flex flex-col items-center px-4 md:px-6 pt-16 pb-4 select-none w-full min-h-[calc(100vh-10rem)]">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Saran</h2>

      <div className="grid md:grid-cols-3 gap-5 w-full max-w-6xl flex-1">
      {saranList.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-1">
              <div className={`w-11 h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                <Icon size={22} className={s.color} />
              </div>
              <h3 className={`font-extrabold text-xl md:text-2xl ${s.color}`}>{s.title}</h3>
            </div>
            <div className={`${s.bg} ${s.border} border-2 rounded-2xl p-5 text-left flex-1`}>
              <ul className="space-y-2">
                {s.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-lg md:text-xl text-slate-700">
                    <span className={`w-1.5 h-1.5 rounded-full ${s.color.replace('text-', 'bg-')} mt-2.5 shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
