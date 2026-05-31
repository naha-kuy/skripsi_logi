import React from 'react';
import { CountUp } from '../components/CountUp';

export const Slide10: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center">
    <div className="w-full md:w-2/5 text-center">
      <div className="bg-feather/5 border-2 border-feather/20 rounded-3xl p-8 flex flex-col items-center shadow-sm">
        <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Skor Kevalidan Media</span>
        <div className="text-7xl md:text-8xl font-display font-black text-feather mt-2 leading-none">
          <CountUp value={92.0} trigger={isActive} suffix="%" />
        </div>
        <div className="mt-4 px-6 py-2 bg-feather text-white rounded-full font-display font-black text-sm uppercase tracking-wider">
          SANGAT VALID
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-8 border border-slate-200">
          <div 
            className="bg-feather h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: isActive ? '92%' : '0%' }}
          />
        </div>
      </div>
    </div>

    <div className="w-full md:w-3/5">
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display mb-6">
        Hasil Validasi Ahli Materi & Media
      </h2>
      
      <div className="data-table-container">
        <table className="w-full text-left border-collapse text-sm md:text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
              <th className="p-4">Aspek Penilaian</th>
              <th className="p-4 text-center">Persentase</th>
              <th className="p-4">Kategori Kelayakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            <tr>
              <td className="p-4">Aspek Kelayakan Isi (Materi)</td>
              <td className="p-4 text-center font-black text-feather">91,4%</td>
              <td className="p-4"><span className="bg-feather/10 text-feather-dark px-3 py-1 rounded-full text-xs md:text-sm font-bold">Sangat Layak</span></td>
            </tr>
            <tr>
              <td className="p-4">Aspek Penyajian & Gamifikasi</td>
              <td className="p-4 text-center font-black text-feather">93,2%</td>
              <td className="p-4"><span className="bg-feather/10 text-feather-dark px-3 py-1 rounded-full text-xs md:text-sm font-bold">Sangat Layak</span></td>
            </tr>
            <tr>
              <td className="p-4">Aspek Rekayasa Perangkat Lunak</td>
              <td className="p-4 text-center font-black text-feather">92,5%</td>
              <td className="p-4"><span className="bg-feather/10 text-feather-dark px-3 py-1 rounded-full text-xs md:text-sm font-bold">Sangat Layak</span></td>
            </tr>
            <tr>
              <td className="p-4">Aspek Komunikasi Visual & UI/UX</td>
              <td className="p-4 text-center font-black text-feather">90,9%</td>
              <td className="p-4"><span className="bg-feather/10 text-feather-dark px-3 py-1 rounded-full text-xs md:text-sm font-bold">Sangat Layak</span></td>
            </tr>
            <tr className="bg-feather/5 font-bold border-t-2 border-feather">
              <td className="p-4 text-slate-850">RATA-RATA KESELURUHAN</td>
              <td className="p-4 text-center text-feather text-lg">92,0%</td>
              <td className="p-4"><span className="bg-feather text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-black">SANGAT VALID</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);