import React, { useState, useEffect } from 'react';
import { Target, Award } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';
import { SlideImage } from '../components/SlideImage';

export const Slide14: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [chartAnim, setChartAnim] = useState(false);
  useEffect(() => { if (isActive) { const t = setTimeout(() => setChartAnim(true), 50); return () => clearTimeout(t); } else setChartAnim(false); }, [isActive]);

  return (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Efektivitas</h2>

    <div className="w-full max-w-7xl mb-4">
      <SlideImage
        imageName="chart_persebaran_nilai.png"
        alt="Chart Persebaran Nilai Siswa"
        aspect="1982/652"
        className="w-full"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full max-w-7xl">
      <div className="lg:col-span-3 bg-white border-2 border-slate-200 rounded-2xl p-5">
        <div className="flex gap-16 md:gap-24 items-end justify-center h-28 md:h-32 w-full border-b-2 border-slate-200 relative px-8">
          <div className="flex flex-col items-center w-16 z-10 h-full justify-end">
            <div className="bg-cardinal w-14 rounded-t-xl transition-all duration-1000 ease-out shadow-[0_4px_10px_rgba(255,75,75,0.25)]"
              style={{ height: chartAnim ? '39.3%' : '0%' }} />
          </div>
          <div className="flex flex-col items-center w-16 z-10 h-full justify-end">
            <div className="bg-feather w-14 rounded-t-xl transition-all duration-1000 ease-out delay-300 shadow-[0_4px_10px_rgba(88,204,2,0.25)]"
              style={{ height: chartAnim ? '84.6%' : '0%' }} />
          </div>
        </div>
        <div className="flex gap-16 md:gap-24 justify-center px-8 pt-3">
          <div className="w-20 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cardinal" />
              <span className="font-extrabold text-lg md:text-xl text-slate-600">Pretest</span>
            </div>
            <p className="font-black text-xl md:text-2xl text-cardinal">
              <CountUp value={39.3} trigger={isActive} decimals={1} suffix="%" />
            </p>
          </div>
          <div className="w-20 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-feather" />
              <span className="font-extrabold text-lg md:text-xl text-slate-600">Posttest</span>
            </div>
            <p className="font-black text-xl md:text-2xl text-feather-dark">
              <CountUp value={84.6} trigger={isActive} decimals={1} suffix="%" />
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-gradient-to-br from-bee/10 to-bee/5 border-2 border-bee/20 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-bee flex items-center justify-center mb-2 shadow-lg shadow-bee/30">
          <Award size={28} className="text-white" />
        </div>
        <p className="text-base md:text-lg font-bold text-bee-dark uppercase tracking-widest mb-1">Skor N-Gain</p>
        <p className="text-5xl md:text-6xl font-black text-bee-dark font-display">
          <CountUp value={0.75} trigger={isActive} decimals={2} />
        </p>
        <div className="mt-2 bg-bee-dark text-white text-base md:text-lg font-black uppercase tracking-wider px-5 py-2 rounded-full inline-flex items-center gap-1.5 shadow-md">
          <Target size={16} /> Efektivitas Tinggi
        </div>
        <BarAnimated isActive={isActive} color="bg-gradient-to-r from-bee to-bee-dark" width="75%" trackBg="bg-white/60" className="mt-2" />
        <p className="text-base md:text-lg font-semibold text-slate-500 mt-1.5">Kategori tinggi menurut Hake (1999)</p>
      </div>
    </div>
  </div>
);
};
