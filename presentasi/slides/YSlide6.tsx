import React, { useState, useEffect } from 'react';
import { CheckCircle, User, Monitor } from 'lucide-react';
import { BarAnimated } from '../components/BarAnimated';

const materiItems = [
  { label: 'Isi', value: 91, color: 'bg-feather', w: '91%' },
  { label: 'Bahasa', value: 83, color: 'bg-macaw', w: '83%' },
  { label: 'Penyajian', value: 100, color: 'bg-bee-dark', w: '100%' },
];

const mediaItems = [
  { label: 'Tampilan Media', value: 93.75, color: 'bg-fox', w: '93.75%' },
  { label: 'Tipografi', value: 100, color: 'bg-cardinal', w: '100%' },
  { label: 'Layout', value: 83, color: 'bg-feather', w: '83%' },
  { label: 'Ilustrasi Gambar', value: 87, color: 'bg-macaw', w: '87%' },
  { label: 'Warna', value: 87.5, color: 'bg-bee-dark', w: '87.5%' },
  { label: 'Penggunaan Media', value: 75, color: 'bg-fox-dark', w: '75%' },
];

export const YSlide6: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [anim, setAnim] = useState(false);
  useEffect(() => { if (isActive) { const t = setTimeout(() => setAnim(true), 100); return () => clearTimeout(t); } else setAnim(false); }, [isActive]);

  return (
    <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Hasil Validasi Media</h2>

      <div className="grid md:grid-cols-2 gap-5 w-full max-w-6xl">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-feather/10 border border-feather/20 flex items-center justify-center">
              <User size={22} className="text-feather-dark" />
            </div>
            <h3 className="font-extrabold text-xl md:text-2xl text-slate-800">Ahli Materi</h3>
          </div>
          <div className="space-y-3 mb-4">
            {materiItems.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-base md:text-lg text-slate-700">{item.label}</span>
                  <span className="font-extrabold text-base md:text-lg text-slate-800">{item.value}</span>
                </div>
                <BarAnimated isActive={anim} color={item.color} width={item.w} delay={i * 80} />
              </div>
            ))}
          </div>
          <div className="bg-feather/5 border border-feather/10 rounded-xl p-3 flex items-center justify-between">
            <span className="font-bold text-lg md:text-xl text-slate-700">Rata-rata</span>
            <span className="font-black text-2xl md:text-3xl text-feather-dark">85.9</span>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-fox/10 border border-fox/20 flex items-center justify-center">
              <Monitor size={22} className="text-fox" />
            </div>
            <h3 className="font-extrabold text-xl md:text-2xl text-slate-800">Ahli Media</h3>
          </div>
          <div className="space-y-2 mb-4">
            {mediaItems.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm md:text-base text-slate-700">{item.label}</span>
                  <span className="font-extrabold text-sm md:text-base text-slate-800">{item.value}</span>
                </div>
                <BarAnimated isActive={anim} color={item.color} width={item.w} delay={i * 60} />
              </div>
            ))}
          </div>
          <div className="bg-fox/5 border border-fox/10 rounded-xl p-3 flex items-center justify-between">
            <span className="font-bold text-lg md:text-xl text-slate-700">Rata-rata</span>
            <span className="font-black text-2xl md:text-3xl text-fox">88.16</span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-feather-dark/5 border-2 border-feather-dark/10 rounded-2xl px-6 py-3 flex items-center gap-3">
        <CheckCircle size={22} className="text-feather-dark shrink-0" />
        <p className="font-black text-base md:text-lg text-slate-800">
          Kesimpulan: Media termasuk kategori <span className="text-feather-dark">Sangat Layak</span> digunakan pada tahap implementasi
        </p>
      </div>
    </div>
  );
};
