import React from 'react';
import { CountUp } from '../components/CountUp';

export const Slide11: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
    <div className="w-full md:w-2/5 text-center">
      <div className="bg-macaw/5 border-2 border-macaw/20 rounded-3xl p-8 flex flex-col items-center shadow-sm">
        <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Skor Kepraktisan Pengguna</span>
        <div className="text-7xl md:text-8xl font-display font-black text-macaw mt-2 leading-none">
          <CountUp value={97.7} trigger={isActive} suffix="%" />
        </div>
        <div className="mt-4 px-6 py-2 bg-macaw text-white rounded-full font-display font-black text-sm uppercase tracking-wider">
          SANGAT PRAKTIS
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-8 border border-slate-200">
          <div 
            className="bg-macaw h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: isActive ? '97.7%' : '0%' }}
          />
        </div>
      </div>
    </div>

    <div className="w-full md:w-3/5 flex flex-col gap-5">
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display">
        Respon Praktikalitas Guru & Siswa
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="font-display font-black text-base text-slate-800">Respon Siswa</span>
            <span className="font-display font-black text-lg text-macaw">96,8%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
            <div className="bg-macaw h-full rounded-full" style={{ width: '96.8%' }} />
          </div>
          <ul className="text-xs md:text-sm text-slate-600 space-y-2">
            <li>✓ Navigasi game sangat mudah dipahami.</li>
            <li>✓ Penjelasan materi interaktif menarik minat.</li>
            <li>✓ LogiChat AI sangat menuntun logika berpikir.</li>
          </ul>
        </div>

        <div className="border-2 border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="font-display font-black text-base text-slate-800">Respon Guru</span>
            <span className="font-display font-black text-lg text-feather">98,5%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
            <div className="bg-feather h-full rounded-full" style={{ width: '98.5%' }} />
          </div>
          <ul className="text-xs md:text-sm text-slate-600 space-y-2">
            <li>✓ Mempermudah monitoring capaian kuis kelas.</li>
            <li>✓ Pengelolaan unit dan soal ajar sangat fleksibel.</li>
            <li>✓ Data analitik siswa tersaji secara informatif.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);