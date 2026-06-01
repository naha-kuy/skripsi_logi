import React from 'react';
import { BookOpen, Puzzle, Layout, Bot, BarChart3, CheckCircle } from 'lucide-react';

const items = [
  { num: '01', icon: BookOpen, title: 'Pendahuluan', desc: 'Latar belakang & rumusan masalah', target: 3, color: 'text-cardinal', bg: 'bg-cardinal/5', border: 'border-cardinal/10' },
  { num: '02', icon: Puzzle, title: 'Metode ADDIE', desc: 'Analisis, desain, pengembangan, implementasi, evaluasi', target: 4, color: 'text-macaw', bg: 'bg-macaw/5', border: 'border-macaw/10' },
  { num: '03', icon: Layout, title: 'Platform Logi', desc: 'Fitur gamifikasi & arsitektur', target: 7, color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10' },
  { num: '04', icon: Bot, title: 'AI Generatif', desc: 'Human-in-the-Loop & prompting', target: 9, color: 'text-bee-dark', bg: 'bg-bee/5', border: 'border-bee/10' },
  { num: '05', icon: BarChart3, title: 'Hasil Penelitian', desc: 'Validitas, praktikalitas, efektivitas', target: 13, color: 'text-fox', bg: 'bg-fox/5', border: 'border-fox/10' },
  { num: '06', icon: CheckCircle, title: 'Kesimpulan', desc: 'Simpulan & saran', target: 16, color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10' },
];

const NumBadge: React.FC<{ num: string; color: string }> = ({ num, color }) => (
  <span className={`text-3xl md:text-4xl font-black ${color} leading-none`}>{num}</span>
);

export const Slide2: React.FC<{ goSlide: (n: number) => void }> = ({ goSlide }) => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-6">Outline Presentasi</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_auto] gap-5 w-full max-w-6xl">
      <button onClick={() => goSlide(items[0].target)}
        className="group md:col-span-2 bg-white border-2 border-slate-200 hover:border-cardinal rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-cardinal/10 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-5 gap-y-2 items-center">
          <div className="row-span-2 flex items-center justify-center h-full py-1">
            <NumBadge num={items[0].num} color="text-cardinal" />
          </div>
          <div className="col-start-2 row-start-1">
            <h3 className="font-extrabold text-xl md:text-2xl text-slate-800">{items[0].title}</h3>
          </div>
          <div className="col-start-2 row-start-2">
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed">{items[0].desc}</p>
          </div>
          <div className="row-span-2 flex items-center justify-center h-full">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-cardinal/10 border border-cardinal/10 flex items-center justify-center group-hover:bg-cardinal/20 transition-colors">
              <BookOpen size={28} className="text-cardinal" />
            </div>
          </div>
        </div>
      </button>

      <button onClick={() => goSlide(items[1].target)}
        className="group md:col-span-1 md:row-span-2 bg-white border-2 border-slate-200 hover:border-macaw rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-macaw/10 hover:-translate-y-0.5 flex flex-col justify-between"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between">
            <NumBadge num={items[1].num} color="text-macaw" />
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-macaw/10 border border-macaw/10 flex items-center justify-center group-hover:bg-macaw/20 transition-colors shrink-0">
              <Puzzle size={26} className="text-macaw" />
            </div>
          </div>
          <h3 className="font-extrabold text-lg md:text-xl text-slate-800">{items[1].title}</h3>
          <ul className="text-lg md:text-xl text-slate-500 leading-snug space-y-0 list-disc list-inside">
            <li>Analysis</li>
            <li>Design</li>
            <li>Development</li>
            <li>Implementation</li>
            <li>Evaluation</li>
          </ul>
        </div>
        <div className="flex items-center gap-1.5 text-base font-bold text-macaw mt-2">
          <span>5 tahap</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </button>

      <button onClick={() => goSlide(items[2].target)}
        className="group md:col-span-1 bg-white border-2 border-slate-200 hover:border-feather rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-feather/10 hover:-translate-y-0.5"
      >
        <div className="grid gap-y-2">
          <div className="flex items-center justify-between">
            <NumBadge num={items[2].num} color="text-feather-dark" />
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-feather/10 border border-feather/10 flex items-center justify-center group-hover:bg-feather/20 transition-colors">
              <Layout size={26} className="text-feather-dark" />
            </div>
          </div>
          <h3 className="font-extrabold text-lg md:text-xl text-slate-800">{items[2].title}</h3>
          <p className="text-lg md:text-xl text-slate-500">{items[2].desc}</p>
        </div>
      </button>

      <button onClick={() => goSlide(items[3].target)}
        className="group md:col-span-1 bg-white border-2 border-slate-200 hover:border-bee rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-bee/10 hover:-translate-y-0.5"
      >
        <div className="grid gap-y-2">
          <div className="flex items-center justify-between">
            <NumBadge num={items[3].num} color="text-bee-dark" />
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-bee/10 border border-bee/10 flex items-center justify-center group-hover:bg-bee/20 transition-colors">
              <Bot size={26} className="text-bee-dark" />
            </div>
          </div>
          <h3 className="font-extrabold text-lg md:text-xl text-slate-800">{items[3].title}</h3>
          <p className="text-lg md:text-xl text-slate-500">{items[3].desc}</p>
        </div>
      </button>
    </div>

    <div className="grid grid-cols-2 gap-5 w-full max-w-6xl mt-5">
      <button onClick={() => goSlide(items[4].target)}
        className="group bg-white border-2 border-slate-200 hover:border-fox rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-fox/10 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-5 gap-y-2 items-center">
          <div className="row-span-2 flex items-center justify-center h-full py-1">
            <NumBadge num={items[4].num} color="text-fox" />
          </div>
          <div className="col-start-2 row-start-1">
            <h3 className="font-extrabold text-lg md:text-xl text-slate-800">{items[4].title}</h3>
          </div>
          <div className="col-start-2 row-start-2">
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed">{items[4].desc}</p>
          </div>
          <div className="row-span-2 flex items-center justify-center h-full">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-fox/10 border border-fox/10 flex items-center justify-center group-hover:bg-fox/20 transition-colors">
              <BarChart3 size={24} className="text-fox" />
            </div>
          </div>
        </div>
      </button>

      <button onClick={() => goSlide(items[5].target)}
        className="group bg-white border-2 border-slate-200 hover:border-feather rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-feather/10 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-5 gap-y-2 items-center">
          <div className="row-span-2 flex items-center justify-center h-full py-1">
            <NumBadge num={items[5].num} color="text-feather-dark" />
          </div>
          <div className="col-start-2 row-start-1">
            <h3 className="font-extrabold text-lg md:text-xl text-slate-800">{items[5].title}</h3>
          </div>
          <div className="col-start-2 row-start-2">
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed">{items[5].desc}</p>
          </div>
          <div className="row-span-2 flex items-center justify-center h-full">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-feather/10 border border-feather/10 flex items-center justify-center group-hover:bg-feather/20 transition-colors">
              <CheckCircle size={24} className="text-feather-dark" />
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
);
