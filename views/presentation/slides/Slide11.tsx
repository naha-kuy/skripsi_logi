import React from 'react';
import { ClipboardCheck, ThumbsUp, TrendingUp } from 'lucide-react';

const items = [
  { icon: ClipboardCheck, title: 'Validitas', value: '92,0%', label: 'Sangat Valid', color: 'text-feather-dark', barColor: 'bg-feather', barW: '92%' },
  { icon: ThumbsUp, title: 'Praktikalitas', value: '97,7%', label: 'Sangat Praktis', color: 'text-macaw', barColor: 'bg-macaw', barW: '98%' },
  { icon: TrendingUp, title: 'Efektivitas', value: '0,75', label: 'N-Gain Tinggi', color: 'text-bee-dark', barColor: 'bg-bee', barW: '75%' },
];

export const Slide11 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Tahap ADDIE</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Evaluasi</h2>
    <p className="text-sm md:text-base text-slate-500 mb-4">Penilaian menyeluruh produk Logi</p>

    <div className="grid sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-4xl">
      {items.map(item => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="bg-white border-2 border-slate-200 rounded-2xl p-4 md:p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Icon size={20} className={item.color} />
              </div>
              <div>
                <p className="font-extrabold text-sm md:text-base text-slate-800">{item.title}</p>
                <p className={`font-black text-lg md:text-xl ${item.color}`}>{item.value}</p>
              </div>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.barColor} rounded-full transition-all duration-1000`} style={{ width: item.barW }} />
            </div>
            <p className="text-[11px] md:text-xs font-semibold text-slate-500 mt-1.5">{item.label}</p>
          </div>
        );
      })}
    </div>
  </div>
);
