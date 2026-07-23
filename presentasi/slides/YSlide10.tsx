import React from 'react';
import { CheckCircle } from 'lucide-react';

const conclusions = [
  { label: 'Produk', text: 'Media Game Puzzle Taktil berbasis Kode QR berhasil dikembangkan menggunakan model ADDIE.', color: 'text-fox', bg: 'bg-fox/5', border: 'border-fox/10' },
  { label: 'Kelayakan', text: 'Media memperoleh kategori Sangat Layak berdasarkan validasi ahli.', color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10' },
  { label: 'Efektivitas', text: 'Media efektif meningkatkan pemahaman siswa berdasarkan hasil pretest–posttest dan nilai N-Gain.', color: 'text-macaw', bg: 'bg-macaw/5', border: 'border-macaw/10' }
];

export const YSlide10: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full min-h-[calc(100vh-10rem)]">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Kesimpulan</h2>

    <div className="w-full max-w-5xl flex-1 flex flex-col justify-center gap-4">
      {conclusions.map((c, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center gap-3 px-1">
            <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
              <CheckCircle size={20} className={c.color} />
            </div>
            <p className={`font-extrabold text-xl md:text-2xl ${c.color}`}>{c.label}</p>
          </div>
          <div className={`${c.bg} ${c.border} border-2 rounded-2xl p-5 text-left`}>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
