import React from 'react';

export const Slide12: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
    <div className="w-full lg:w-1/2 bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center">
      <span className="text-sm text-slate-500 font-extrabold uppercase tracking-wider mb-6">Grafik Peningkatan Skor Kuis</span>
      
      <div className="flex gap-16 items-end justify-center h-56 w-full border-b-2 border-slate-200 pb-4 relative px-6">
        
        <div className="flex flex-col items-center justify-end h-full w-24 z-10">
          <div className="mb-2 font-display font-black text-sm text-cardinal">Pre-Test (39,3%)</div>
          <div className="w-full flex-1 flex items-end justify-center">
            <div 
              className="bg-cardinal w-full rounded-t-xl transition-all duration-1000 ease-out flex items-end justify-center font-display font-black text-white text-base shadow-[0_4px_14px_rgba(255,75,75,0.3)] pb-2" 
              style={{ height: isActive ? '39.3%' : '0%' }}
            >
              {isActive && '39%'}
            </div>
          </div>
          <span className="text-sm font-extrabold text-slate-600 mt-2">Awal</span>
        </div>

        <div className="flex flex-col items-center justify-end h-full w-24 z-10">
          <div className="mb-2 font-display font-black text-sm text-feather">Post-Test (84,6%)</div>
          <div className="w-full flex-1 flex items-end justify-center">
            <div 
              className="bg-feather w-full rounded-t-xl transition-all duration-1000 ease-out flex items-end justify-center font-display font-black text-white text-base shadow-[0_4px_14px_rgba(88,204,2,0.3)] pb-2" 
              style={{ height: isActive ? '84.6%' : '0%' }}
            >
              {isActive && '85%'}
            </div>
          </div>
          <span className="text-sm font-extrabold text-slate-600 mt-2">Akhir</span>
        </div>

        <div className="absolute left-0 top-0 text-[10px] font-bold text-slate-300 w-full flex flex-col justify-between h-full pointer-events-none pb-8 pt-4">
          <div className="border-t border-dashed border-slate-200 w-full">100%</div>
          <div className="border-t border-dashed border-slate-200 w-full">75%</div>
          <div className="border-t border-dashed border-slate-200 w-full">50%</div>
          <div className="border-t border-dashed border-slate-200 w-full">25%</div>
        </div>
      </div>
    </div>

    <div className="w-full lg:w-1/2 flex flex-col gap-5">
      <span className="text-feather font-black text-base uppercase tracking-wider">Evaluasi Hasil Belajar</span>
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display">
        Kemampuan Berpikir Komputasional (CT) Siswa
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="border-2 border-slate-200 rounded-2xl p-4 bg-white text-center shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Pre-Test</span>
          <span className="font-display font-black text-2xl md:text-3xl text-cardinal">39,3%</span>
        </div>
        <div className="border-2 border-slate-200 rounded-2xl p-4 bg-white text-center shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Post-Test</span>
          <span className="font-display font-black text-2xl md:text-3xl text-feather">84,6%</span>
        </div>
        <div className="border-2 border-slate-200 rounded-2xl p-4 bg-white text-center shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Skor N-Gain</span>
          <span className="font-display font-black text-2xl md:text-3xl text-bee-dark">0,75</span>
        </div>
      </div>

      <div className="bg-bee/10 border border-bee/30 rounded-2xl p-5 mt-2">
        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-semibold">
          Skor N-Gain diperoleh sebesar <strong className="text-bee-dark">0,75</strong> yang berada pada kategori <strong className="text-bee-dark">"Tinggi"</strong>. 
          Ini menunjukkan bahwa platform Logi efektif secara signifikan dalam melatih siswa memecahkan masalah geometri dengan pendekatan Computational Thinking.
        </p>
      </div>
    </div>
  </div>
);