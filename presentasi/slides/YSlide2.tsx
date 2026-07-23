import React from 'react';
import { BookOpen, Smartphone, Brain, QrCode, Puzzle } from 'lucide-react';

const items = [
  { icon: BookOpen, text: 'Pembelajaran materi ragam hias di MTsN 1 Kediri masih didominasi metode buku cetak.', color: 'text-cardinal', bg: 'bg-cardinal/5' },
  { icon: Smartphone, text: 'Media pembelajaran yang digunakan belum bervariasi dan kurang interaktif.', color: 'text-bee-dark', bg: 'bg-bee/5' },
  { icon: Brain, text: 'Pemahaman siswa terhadap materi ragam hias masih belum optimal.', color: 'text-fox', bg: 'bg-fox/5' },
  { icon: QrCode, text: 'Potensi teknologi Kode QR dan permainan edukatif belum dimanfaatkan dalam pembelajaran.', color: 'text-macaw', bg: 'bg-macaw/5' },
  { icon: Puzzle, text: 'Diperlukan media Game Puzzle Taktil berbasis Kode QR untuk meningkatkan pemahaman siswa.', color: 'text-feather-dark', bg: 'bg-feather/5' }
];

export const YSlide2 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <div className="flex items-center gap-2 mb-1">
      <div className="h-0.5 w-6 md:w-8 bg-fox rounded-full" />
      <span className="text-xs md:text-sm font-black text-fox uppercase tracking-[0.25em]">Latar Belakang</span>
      <div className="h-0.5 w-6 md:w-8 bg-fox rounded-full" />
    </div>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Mengapa Media Ini?</h2>

    <div className="w-full max-w-5xl space-y-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className={`${item.bg} border-2 border-slate-200 rounded-2xl p-4 flex items-start gap-4 transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className={`w-11 h-11 rounded-xl ${item.bg} border border-slate-200 flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon size={22} className={item.color} />
            </div>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">{item.text}</p>
          </div>
        );
      })}
    </div>
  </div>
);
