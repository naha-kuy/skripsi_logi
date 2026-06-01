import React from 'react';
import { Play, Clock, Users } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

const items = [
  { icon: Users, label: 'Partisipan', value: '28 siswa' },
  { icon: Clock, label: 'Durasi', value: '1 pertemuan' },
  { icon: Play, label: 'Aktivitas', value: 'Pretest & posttest' }
];

export const Slide10 = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Implementasi</h2>

    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl mb-4">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 text-center transition-all hover:border-feather/30">
            <p className="text-lg md:text-xl font-semibold text-slate-500 mb-1">{item.label}</p>
            <Icon size={24} className="text-feather-dark mx-auto mb-1" />
            <p className="font-extrabold text-2xl md:text-3xl text-slate-900">{item.value}</p>
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-6xl">
      <div className="md:col-span-3 bg-white border-2 border-slate-200 rounded-2xl p-5 text-left">
        <p className="font-extrabold text-lg md:text-xl text-slate-800 mb-3 flex items-center gap-2">
          <Play size={18} className="text-feather" /> Alur Implementasi
        </p>
        <ol className="space-y-2">
          {['Siswa mengerjakan pretest awal', 'Pengenalan platform Logi & fitur', 'Sesi pembelajaran menggunakan Logi', 'Siswa mengerjakan posttest akhir'].map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-lg md:text-xl text-slate-700">
              <span className="w-7 h-7 rounded-full bg-feather/10 text-feather-dark font-extrabold text-base flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
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
        />
      </div>
    </div>
  </div>
);
