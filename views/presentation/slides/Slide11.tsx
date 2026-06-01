import React from 'react';
import { ClipboardCheck, ThumbsUp, TrendingUp } from 'lucide-react';
import { CountUp } from '../components/CountUp';
import { BarAnimated } from '../components/BarAnimated';

const items = [
  { icon: ClipboardCheck, title: 'Validitas', numValue: 92.0, suffix: '%', label: 'Sangat Valid', color: 'text-feather-dark', barColor: 'bg-feather', barW: '92%' },
  { icon: ThumbsUp, title: 'Praktikalitas', numValue: 97.7, suffix: '%', label: 'Sangat Praktis', color: 'text-macaw', barColor: 'bg-macaw', barW: '98%' },
  { icon: TrendingUp, title: 'Efektivitas', numValue: 0.75, suffix: '', label: 'N-Gain Tinggi', color: 'text-bee-dark', barColor: 'bg-bee', barW: '75%' },
];

export const Slide11: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-sm font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Evaluasi</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5">Penilaian menyeluruh produk Logi</p>

    <div className="grid sm:grid-cols-3 gap-2 md:gap-3 w-full max-w-4xl">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <Icon size={16} className={item.color} />
              </div>
              <div>
                <p className="font-extrabold text-sm md:text-base text-slate-800">{item.title}</p>
                <p className={`font-black text-lg md:text-xl ${item.color}`}>
                  <CountUp value={item.numValue} trigger={isActive} decimals={item.numValue < 1 ? 2 : 1} suffix={item.suffix} />
                </p>
              </div>
            </div>
            <BarAnimated isActive={isActive} color={item.barColor} width={item.barW} />
            <p className="text-xs md:text-sm font-semibold text-slate-500 mt-1">{item.label}</p>
          </div>
        );
      })}
    </div>
  </div>
);
