import React, { useState, useEffect } from 'react';
import { Target, Award } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';
import { SlideImage } from '../components/SlideImage';

export const Slide14: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [chartAnim, setChartAnim] = useState(false);
  useEffect(() => { if (isActive) { const t = setTimeout(() => setChartAnim(true), 50); return () => clearTimeout(t); } else setChartAnim(false); }, [isActive]);

  return (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-sm font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Hasil Penelitian</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Efektivitas</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Peningkatan skor kuis siswa</p>

    <div className="w-full max-w-6xl mb-2">
      <SlideImage
        imageName="chart_persebaran_nilai.png"
        alt="Chart Persebaran Nilai Siswa"
        aspect="1982/652"
        className="w-full"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs md:text-sm font-bold text-slate-400">Chart Persebaran Nilai Siswa</p>
        </div>
      </SlideImage>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 md:gap-3 w-full max-w-6xl">
      <div className="lg:col-span-3 bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-4">
        <div className="flex gap-10 md:gap-16 items-end justify-center h-24 md:h-28 w-full border-b-2 border-slate-200 relative px-8">
          <div className="flex flex-col items-center w-14 z-10 h-full justify-end">
            <div className="bg-cardinal w-12 rounded-t-xl transition-all duration-1000 ease-out shadow-[0_4px_10px_rgba(255,75,75,0.25)]"
              style={{ height: chartAnim ? '39.3%' : '0%' }} />
          </div>
          <div className="flex flex-col items-center w-14 z-10 h-full justify-end">
            <div className="bg-feather w-12 rounded-t-xl transition-all duration-1000 ease-out delay-300 shadow-[0_4px_10px_rgba(88,204,2,0.25)]"
              style={{ height: chartAnim ? '84.6%' : '0%' }} />
          </div>
        </div>
        <div className="flex gap-10 md:gap-16 justify-center px-8 pt-2">
          <div className="w-16 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cardinal" />
              <span className="font-extrabold text-xs md:text-sm text-slate-600">Pretest</span>
            </div>
            <p className="font-black text-base md:text-lg text-cardinal">
              <CountUp value={39.3} trigger={isActive} decimals={1} suffix="%" />
            </p>
          </div>
          <div className="w-16 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-feather" />
              <span className="font-extrabold text-xs md:text-sm text-slate-600">Posttest</span>
            </div>
            <p className="font-black text-base md:text-lg text-feather-dark">
              <CountUp value={84.6} trigger={isActive} decimals={1} suffix="%" />
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-gradient-to-br from-bee/10 to-bee/5 border-2 border-bee/20 rounded-2xl p-4 md:p-5 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-bee flex items-center justify-center mb-2 shadow-lg shadow-bee/30">
          <Award size={24} className="text-white" />
        </div>
        <p className="text-xs md:text-sm font-bold text-bee-dark uppercase tracking-widest mb-1">Skor N-Gain</p>
        <p className="text-4xl md:text-5xl font-black text-bee-dark font-display">
          <CountUp value={0.75} trigger={isActive} decimals={2} />
        </p>
        <div className="mt-2 bg-bee-dark text-white text-xs md:text-sm font-black uppercase tracking-wider px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
          <Target size={14} /> Efektivitas Tinggi
        </div>
        <BarAnimated isActive={isActive} color="bg-gradient-to-r from-bee to-bee-dark" width="75%" trackBg="bg-white/60" className="mt-2" />
        <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1.5">Kategori tinggi menurut Hake (1999)</p>
      </div>
    </div>
  </div>
);
};
