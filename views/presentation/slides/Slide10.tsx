import React from 'react';
import { Play, Clock, Users, CheckCircle } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

const items = [
  { icon: Users, label: 'Partisipan', value: '28 siswa' },
  { icon: Clock, label: 'Durasi', value: '1 pertemuan' },
  { icon: Play, label: 'Aktivitas', value: 'Pretest & posttest' },
  { icon: CheckCircle, label: 'Metode', value: 'Eksperimen 1 kelas' }
];

export const Slide10 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Implementasi</h2>
    <p className="text-sm md:text-base text-slate-500 mb-4">Uji coba platform pada subjek penelitian</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mb-4">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 md:p-5 text-center transition-all hover:border-feather/30">
            <p className="text-[11px] md:text-xs font-semibold text-slate-500 mb-1">{item.label}</p>
            <Icon size={24} className="text-feather-dark mx-auto mb-1" />
            <p className="font-extrabold text-lg md:text-xl text-slate-900">{item.value}</p>
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 w-full max-w-5xl">
      <div className="md:col-span-3 bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-5 text-left">
        <p className="font-extrabold text-sm md:text-base text-slate-800 mb-3 flex items-center gap-2">
          <Play size={16} className="text-feather" /> Alur Implementasi
        </p>
        <ol className="space-y-2">
          {['Siswa mengerjakan pretest awal', 'Pengenalan platform Logi & fitur', 'Sesi pembelajaran menggunakan Logi', 'Siswa mengerjakan posttest akhir'].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm md:text-base text-slate-700">
              <span className="w-7 h-7 rounded-full bg-feather/10 text-feather-dark font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      <div className="md:col-span-2">
        <SlideImage
          imageName="foto_pelaksanaan.png"
          alt="Foto Pelaksanaan"
          aspect="1599/899"
          className="w-full"
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs md:text-sm font-bold text-slate-400">Foto Pelaksanaan</p>
          </div>
        </SlideImage>
      </div>
    </div>
  </div>
);
