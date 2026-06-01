import React from 'react';
import { CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { CountUp } from '../components/CountUp';

const conclusions = [
  { label: 'Valid', numValue: 92.0, decimals: 1, suffix: '%', text: 'Sangat Valid', color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10' },
  { label: 'Praktis', numValue: 97.7, decimals: 1, suffix: '%', text: 'Sangat Praktis', color: 'text-macaw', bg: 'bg-macaw/5', border: 'border-macaw/10' },
  { label: 'Efektif', numValue: 0.75, decimals: 2, suffix: '', text: 'N-Gain Tinggi', color: 'text-bee-dark', bg: 'bg-bee/5', border: 'border-bee/10' }
];

const suggestions = ['Perluasan materi matematika lainnya', 'Uji coba skala lebih luas', 'Pengembangan game kolaboratif siswa'];

export const Slide15: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-sm font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Penutup</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Kesimpulan & Saran</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Ringkasan hasil penelitian</p>

    <div className="grid md:grid-cols-2 gap-3 w-full max-w-5xl">
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-4 text-left">
        <h3 className="font-extrabold text-base md:text-lg text-slate-800 mb-2 flex items-center gap-2">
          <CheckCircle size={16} className="text-feather" /> Kesimpulan
        </h3>
        <div className="space-y-2">
          {conclusions.map(c => (
            <div key={c.label} className={`${c.bg} ${c.border} border rounded-xl p-3 md:p-4 flex items-center justify-between`}>
              <span className="font-bold text-sm md:text-base text-slate-700">{c.label}</span>
              <span className={`font-black text-sm md:text-base ${c.color}`}>
                <CountUp value={c.numValue} trigger={isActive} decimals={c.decimals} suffix={c.suffix} /> {c.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-4 text-left">
        <h3 className="font-extrabold text-base md:text-lg text-slate-800 mb-2 flex items-center gap-2">
          <Lightbulb size={16} className="text-bee-dark" /> Saran
        </h3>
        <ul className="space-y-1.5">
          {suggestions.map(s => (
            <li key={s} className="flex items-start gap-2 text-sm md:text-base text-slate-700">
              <ArrowRight size={14} className="text-feather mt-0.5 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
