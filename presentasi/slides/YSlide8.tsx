import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';

const statRows = [
  { label: 'N', value: '23', pct: '23', pctLabel: '' },
  { label: 'N-Gain', value: '0,56', pct: '56%', pctLabel: '' },
  { label: 'Standar Deviasi', value: '0,35', pct: '35,1%', pctLabel: '' },
  { label: 'Kriteria', value: 'Sedang', pct: 'Sedang', pctLabel: '' },
];

export const YSlide8: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Hasil Analisis N-Gain</h2>

    <div className="w-full max-w-4xl">
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden mb-4">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200">
              <th className="font-extrabold text-base md:text-lg text-slate-700 px-5 py-3">Statistik</th>
              <th className="font-extrabold text-base md:text-lg text-slate-700 px-5 py-3 text-center">Score</th>
              <th className="font-extrabold text-base md:text-lg text-slate-700 px-5 py-3 text-center">Persen</th>
            </tr>
          </thead>
          <tbody>
            {statRows.map((row, i) => (
              <tr key={row.label} className="border-b border-slate-100 last:border-0">
                <td className="font-bold text-lg md:text-xl text-slate-700 px-5 py-3">{row.label}</td>
                <td className="font-black text-lg md:text-xl text-center px-5 py-3 text-slate-900">
                  {row.label === 'N' ? row.value : (
                    row.label === 'Kriteria' ? (
                      <span className="text-bee-dark">Sedang</span>
                    ) : (
                      <CountUp value={parseFloat(row.value.replace(',', '.'))} trigger={isActive} decimals={2} />
                    )
                  )}
                </td>
                <td className="font-black text-lg md:text-xl text-center px-5 py-3 text-fox">
                  {row.label === 'Kriteria' ? (
                    <span className="text-feather-dark">Sedang</span>
                  ) : (
                    row.pct
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-br from-fox/10 to-fox/5 border-2 border-fox/20 rounded-2xl p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp size={24} className="text-fox" />
          <p className="font-extrabold text-xl md:text-2xl text-slate-800">N-Gain = 0,56 — Sedang</p>
        </div>
        <BarAnimated isActive={isActive} color="bg-gradient-to-r from-fox to-fox-dark" width="56%" trackBg="bg-white/60" className="max-w-md mx-auto" />
        <p className="text-base md:text-lg font-semibold text-slate-500 mt-2">Peningkatan pemahaman siswa berada pada kategori sedang</p>
      </div>
    </div>
  </div>
);
