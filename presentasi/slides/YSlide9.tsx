import React from 'react';
import { Sparkles, QrCode, CheckCircle } from 'lucide-react';

const cards = [
  {
    icon: Sparkles,
    title: 'Pengalaman Interaktif',
    desc: 'Media memberikan pengalaman belajar yang lebih interaktif dibandingkan metode buku cetak.',
    color: 'text-fox',
    bg: 'bg-fox/5',
    border: 'border-fox/10'
  },
  {
    icon: QrCode,
    title: 'Integrasi Teknologi',
    desc: 'Integrasi Puzzle Taktil dan Kode QR membantu siswa memahami materi ragam hias melalui aktivitas langsung dan materi digital.',
    color: 'text-macaw',
    bg: 'bg-macaw/5',
    border: 'border-macaw/10'
  },
  {
    icon: CheckCircle,
    title: 'Layak & Efektif',
    desc: 'Hasil validasi dan implementasi menunjukkan media layak serta efektif digunakan dalam pembelajaran.',
    color: 'text-feather-dark',
    bg: 'bg-feather/5',
    border: 'border-feather/10'
  }
];

export const YSlide9 = () => (
    <div className="flex flex-col items-center px-4 md:px-6 pt-16 pb-4 select-none w-full min-h-[calc(100vh-10rem)]">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Pembahasan</h2>

      <div className="grid md:grid-cols-3 gap-5 w-full max-w-6xl flex-1">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-1">
              <div className={`w-11 h-11 rounded-xl ${card.bg} border ${card.border} flex items-center justify-center`}>
                <Icon size={22} className={card.color} />
              </div>
              <h3 className={`font-extrabold text-xl md:text-2xl ${card.color}`}>{card.title}</h3>
            </div>
            <div className={`${card.bg} ${card.border} border-2 rounded-2xl p-5 text-left flex-1`}>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed">{card.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
