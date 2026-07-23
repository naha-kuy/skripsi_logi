import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { CountUp } from '../components/CountUp';

const studentData = [
  { no: 1, pre: 53, post: 82 },
  { no: 2, pre: 43, post: 75 },
  { no: 3, pre: 79, post: 97 },
  { no: 4, pre: 65, post: 85 },
  { no: 5, pre: 64, post: 72 },
  { no: 6, pre: 65, post: 80 },
  { no: 7, pre: 65, post: 75 },
  { no: 8, pre: 73, post: 90 },
  { no: 9, pre: 65, post: 100 },
  { no: 10, pre: 66, post: 67 },
  { no: 11, pre: 67, post: 75 },
  { no: 12, pre: 73, post: 77 },
  { no: 13, pre: 54, post: 72 },
  { no: 14, pre: 75, post: 72 },
  { no: 15, pre: 54, post: 85 },
  { no: 16, pre: 57, post: 100 },
  { no: 17, pre: 68, post: 100 },
  { no: 18, pre: 67, post: 100 },
  { no: 19, pre: 64, post: 100 },
  { no: 20, pre: 45, post: 85 },
  { no: 21, pre: 50, post: 70 },
  { no: 22, pre: 50, post: 82 },
  { no: 23, pre: 68, post: 72 },
];

const preMean = 62.17;
const postMean = 83.17;

export const YSlide7: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [chartAnim, setChartAnim] = useState(false);
  useEffect(() => { if (isActive) { const t = setTimeout(() => setChartAnim(true), 50); return () => clearTimeout(t); } else setChartAnim(false); }, [isActive]);

  return (
    <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full min-h-[calc(100vh-10rem)]">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Hasil Implementasi</h2>

      <div className="grid md:grid-cols-5 gap-4 w-full max-w-6xl flex-1">
        <div className="md:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col">
          <p className="font-extrabold text-lg md:text-xl text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-fox" /> Rata-rata Nilai
          </p>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-end justify-center gap-14 h-48 border-b-2 border-slate-200 relative px-4">
              <div className="flex flex-col items-center w-20 h-full justify-end">
                <div className="bg-cardinal w-16 rounded-t-xl transition-all duration-1000 ease-out shadow-[0_4px_10px_rgba(255,75,75,0.25)]"
                  style={{ height: chartAnim ? '62.17%' : '0%' }}
                />
              </div>
              <div className="flex flex-col items-center w-20 h-full justify-end">
                <div className="bg-fox w-16 rounded-t-xl transition-all duration-1000 ease-out delay-300 shadow-[0_4px_10px_rgba(255,150,0,0.25)]"
                  style={{ height: chartAnim ? '83.17%' : '0%' }}
                />
              </div>
            </div>
            <div className="flex gap-14 justify-center pt-4">
              <div className="w-24 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cardinal" />
                  <span className="font-extrabold text-lg text-slate-600">Pretest</span>
                </div>
                <p className="font-black text-2xl text-cardinal">
                  <CountUp value={preMean} trigger={isActive} decimals={2} suffix="" />
                </p>
              </div>
              <div className="w-24 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-fox" />
                  <span className="font-extrabold text-lg text-slate-600">Posttest</span>
                </div>
                <p className="font-black text-2xl text-fox">
                  <CountUp value={postMean} trigger={isActive} decimals={2} suffix="" />
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white border-2 border-slate-200 rounded-2xl p-5 flex flex-col">
          <p className="font-extrabold text-base md:text-lg text-slate-800 mb-3">Skor Individual (Pretest → Posttest)</p>
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0 max-h-[calc(100vh-20rem)]">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left font-bold text-slate-500 pb-1.5 pr-2">#</th>
                  <th className="text-left font-bold text-slate-500 pb-1.5 pr-2">Pretest</th>
                  <th className="text-left font-bold text-slate-500 pb-1.5">Posttest</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map(s => (
                  <tr key={s.no} className="border-b border-slate-100 last:border-0">
                    <td className="py-1.5 pr-2 font-bold text-slate-400">{String(s.no).padStart(2, '0')}</td>
                    <td className="py-1.5 pr-2 font-semibold text-cardinal">{s.pre}</td>
                    <td className="py-1.5 font-semibold text-fox">{s.post}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
