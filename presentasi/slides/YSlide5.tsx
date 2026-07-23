import React, { useState } from 'react';
import { Puzzle, Image, QrCode, BookOpen, Package } from 'lucide-react';

const komponen = [
  { icon: Puzzle, label: 'Puzzle taktil berbahan kayu', img: 'produk 1.jpeg', alt: 'Bahan Kayu' },
  { icon: Image, label: 'Empat motif ragam hias batik lokal', img: 'produk 2.jpeg', alt: 'Motif Ragam Hias' },
  { icon: QrCode, label: 'Kode QR terhubung materi digital', img: 'produk 3.jpeg', alt: 'Kode QR' },
  { icon: BookOpen, label: 'Buku panduan penggunaan', img: 'produk 4.jpeg', alt: 'Buku Panduan' },
  { icon: Package, label: 'Kotak penyimpanan', img: 'produk 5.jpeg', alt: 'Kemasan' }
];

const FotoBox: React.FC<{ src: string; alt: string; label: string; aspect?: string }> = ({ src, alt, label, aspect = 'aspect-square' }) => {
  const [err, setErr] = useState(false);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-full ${aspect} rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center shadow-sm`}>
        {!err ? (
          <img
            src={`/images/presentation/${src}`}
            alt={alt}
            onError={() => setErr(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
            <span className="text-2xl">📷</span>
            <span className="text-[10px] font-bold mt-1">{label}</span>
          </div>
        )}
      </div>
      <span className="text-[11px] font-bold text-slate-500 text-center leading-tight">{label}</span>
    </div>
  );
};

export const YSlide5 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-3">Produk yang Dikembangkan</h2>
    <p className="text-lg md:text-xl text-slate-500 mb-5 font-bold">Game Puzzle Taktil Berbasis Kode QR</p>

    <div className="grid lg:grid-cols-5 gap-5 w-full max-w-6xl">
      <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-5 text-left">
        <h3 className="font-extrabold text-xl md:text-2xl text-fox mb-4 flex items-center gap-2">
          <Package size={22} className="text-fox" /> Komponen Media
        </h3>
        <div className="space-y-2">
          {komponen.map((k, i) => {
            const Icon = k.icon;
            return (
              <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 transition-all hover:border-fox/30 hover:bg-fox/5">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-fox" />
                </div>
                <span className="font-bold text-sm md:text-base text-slate-700">{k.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-3 flex items-start">
        <div className="grid grid-cols-3 gap-4 w-full max-w-xl mx-auto">
          <FotoBox src={komponen[0].img} alt={komponen[0].alt} label={komponen[0].alt} />
          <FotoBox src={komponen[1].img} alt={komponen[1].alt} label={komponen[1].alt} />
          <FotoBox src={komponen[2].img} alt={komponen[2].alt} label={komponen[2].alt} />
          <FotoBox src={komponen[3].img} alt={komponen[3].alt} label={komponen[3].alt} />
          <div className="col-span-2">
            <FotoBox src={komponen[4].img} alt={komponen[4].alt} label={komponen[4].alt} aspect="aspect-[2/1]" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
