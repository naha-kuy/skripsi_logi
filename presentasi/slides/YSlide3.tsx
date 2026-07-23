import React from 'react';
import { HelpCircle, Target } from 'lucide-react';

const rumusan = [
  'Bagaimana proses pengembangan media Game Puzzle Taktil berbasis Kode QR pada materi ragam hias?',
  'Bagaimana tingkat kelayakan media berdasarkan hasil validasi ahli?',
  'Bagaimana efektivitas media dalam meningkatkan pemahaman siswa?'
];

const tujuan = [
  'Mengembangkan media Game Puzzle Taktil berbasis Kode QR.',
  'Mengetahui tingkat kelayakan media.',
  'Mengetahui efektivitas media dalam meningkatkan pemahaman siswa.'
];

export const YSlide3 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Rumusan Masalah & Tujuan</h2>

    <div className="grid md:grid-cols-2 gap-5 w-full max-w-6xl">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-11 h-11 rounded-xl bg-cardinal/10 border border-cardinal/20 flex items-center justify-center">
            <HelpCircle size={22} className="text-cardinal" />
          </div>
          <h3 className="font-extrabold text-xl md:text-2xl text-cardinal">Rumusan Masalah</h3>
        </div>
        <div className="bg-cardinal/5 border-2 border-cardinal/10 rounded-2xl p-5 text-left flex-1">
          <ol className="space-y-3">
            {rumusan.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-lg md:text-xl text-slate-700">
                <span className="w-7 h-7 rounded-full bg-cardinal/20 text-cardinal font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-11 h-11 rounded-xl bg-fox/10 border border-fox/20 flex items-center justify-center">
            <Target size={22} className="text-fox" />
          </div>
          <h3 className="font-extrabold text-xl md:text-2xl text-fox">Tujuan</h3>
        </div>
        <div className="bg-fox/5 border-2 border-fox/10 rounded-2xl p-5 text-left flex-1">
          <ol className="space-y-3">
            {tujuan.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-lg md:text-xl text-slate-700">
                <span className="w-7 h-7 rounded-full bg-fox/20 text-fox font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  </div>
);
