import React from 'react';
import { TrendingUp, ArrowUpRight, Target, Award } from 'lucide-react';
import { SlideImage } from '../components/SlideImage';

export const Slide14: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Hasil Penelitian</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Efektivitas</h2>
    <p className="text-sm md:text-base text-slate-500 mb-4">Peningkatan skor kuis siswa</p>

    <div className="w-full max-w-6xl mb-3">
      <SlideImage
        imageName="chart_persebaran_nilai.png"
        alt="Chart Persebaran Nilai Siswa"
        aspect="2/1"
        className="w-full max-h-44"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs md:text-sm font-bold text-slate-400">Chart Persebaran Nilai Siswa</p>
        </div>
      </SlideImage>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 md:gap-4 w-full max-w-6xl">
      <div className="lg:col-span-3 bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-5">
        <div className="flex gap-8 md:gap-12 items-end justify-center h-28 md:h-32 w-full border-b-2 border-slate-200 relative px-6">
          <div className="absolute inset-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none pb-0 pt-2">
            <div className="border-t border-dashed border-slate-200 w-full text-right pr-2">100%</div>
            <div className="border-t border-dashed border-slate-200 w-full text-right pr-2">75%</div>
            <div className="border-t border-dashed border-slate-200 w-full text-right pr-2">50%</div>
            <div className="border-t border-dashed border-slate-200 w-full text-right pr-2">25%</div>
          </div>
          <div className="flex flex-col items-center w-16 z-10 h-full justify-end">
            <div className="bg-cardinal w-12 rounded-t-xl transition-all duration-1000 ease-out shadow-[0_4px_10px_rgba(255,75,75,0.25)]"
              style={{ height: isActive ? '39.3%' : '0%' }} />
          </div>
          <div className="flex flex-col items-center w-16 z-10 h-full justify-end">
            <div className="bg-feather w-12 rounded-t-xl transition-all duration-1000 ease-out shadow-[0_4px_10px_rgba(88,204,2,0.25)]"
              style={{ height: isActive ? '84.6%' : '0%' }} />
          </div>
        </div>
        <div className="flex gap-8 md:gap-12 justify-center px-6 pt-2">
          <div className="w-16 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-cardinal" />
              <span className="font-extrabold text-xs md:text-sm text-slate-600">Pretest</span>
            </div>
            <p className="font-black text-sm md:text-base text-cardinal">39,3%</p>
          </div>
          <div className="w-16 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-feather" />
              <span className="font-extrabold text-xs md:text-sm text-slate-600">Posttest</span>
            </div>
            <p className="font-black text-sm md:text-base text-feather-dark">84,6%</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs md:text-sm font-bold text-feather-dark">
          <ArrowUpRight size={16} /> Kenaikan {isActive ? '45,3' : '0'}%
        </div>
      </div>

      <div className="lg:col-span-2 bg-gradient-to-br from-bee/10 to-bee/5 border-2 border-bee/20 rounded-2xl p-5 md:p-6 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-bee flex items-center justify-center mb-3 shadow-lg shadow-bee/30">
          <Award size={28} className="text-white" />
        </div>
        <p className="text-[10px] md:text-xs font-bold text-bee-dark uppercase tracking-widest mb-1">Skor N-Gain</p>
        <p className="text-5xl md:text-6xl font-black text-bee-dark font-display">{isActive ? '0,75' : '0'}</p>
        <div className="mt-2 bg-bee-dark text-white text-xs md:text-sm font-black uppercase tracking-wider px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
          <Target size={14} /> Efektivitas Tinggi
        </div>
        <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden mt-3">
          <div className="h-full bg-gradient-to-r from-bee to-bee-dark rounded-full transition-all duration-1000" style={{ width: isActive ? '75%' : '0%' }} />
        </div>
        <p className="text-[10px] md:text-xs font-semibold text-slate-500 mt-2">Kategori tinggi menurut Hake (1999)</p>
      </div>
    </div>
  </div>
);
