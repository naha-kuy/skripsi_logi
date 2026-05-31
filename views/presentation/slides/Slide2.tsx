import React from 'react';
import { BookOpen, Puzzle, Layout, Bot, BarChart3, CheckCircle } from 'lucide-react';

const items = [
  { num: '01', icon: BookOpen, title: 'Pendahuluan', desc: 'Latar belakang & rumusan masalah', target: 3, color: 'text-cardinal', bg: 'bg-cardinal/5', border: 'border-cardinal/10', iconBg: 'bg-cardinal/10', iconBorder: 'border-cardinal/10' },
  { num: '02', icon: Puzzle, title: 'Metode ADDIE', desc: 'Analisis, desain, pengembangan, implementasi, evaluasi', target: 4, color: 'text-macaw', bg: 'bg-macaw/5', border: 'border-macaw/10', iconBg: 'bg-macaw/10', iconBorder: 'border-macaw/10' },
  { num: '03', icon: Layout, title: 'Platform Logi', desc: 'Fitur gamifikasi & arsitektur', target: 7, color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10', iconBg: 'bg-feather/10', iconBorder: 'border-feather/10' },
  { num: '04', icon: Bot, title: 'AI Generatif', desc: 'Human-in-the-Loop & prompting', target: 9, color: 'text-bee-dark', bg: 'bg-bee/5', border: 'border-bee/10', iconBg: 'bg-bee/10', iconBorder: 'border-bee/10' },
  { num: '05', icon: BarChart3, title: 'Hasil Penelitian', desc: 'Validitas, praktikalitas, efektivitas', target: 13, color: 'text-fox', bg: 'bg-fox/5', border: 'border-fox/10', iconBg: 'bg-fox/10', iconBorder: 'border-fox/10' },
  { num: '06', icon: CheckCircle, title: 'Kesimpulan', desc: 'Simpulan & saran', target: 16, color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10', iconBg: 'bg-feather/10', iconBorder: 'border-feather/10' },
];

const NumBadge: React.FC<{ num: string; color: string }> = ({ num, color }) => (
  <span className={`text-xl md:text-2xl lg:text-3xl font-black ${color} leading-none`}>{num}</span>
);

const IconBox: React.FC<{ children: React.ReactNode; color: string }> = ({ children, color }) => (
  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${color.replace('text', 'bg')}/10 border ${color.replace('text', 'border')}/10 flex items-center justify-center group-hover:bg-white/20 transition-colors`}>
    {children}
  </div>
);

export const Slide2: React.FC<{ goSlide: (n: number) => void }> = ({ goSlide }) => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Navigasi</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-4">Outline Presentasi</h2>

    {/* Top bento: 01 wide, 02 tall, 03 + 04 normal */}
    <div className="grid grid-cols-3 grid-rows-[auto_auto] gap-4 md:gap-5 w-full max-w-5xl">
      {/* ── 01 Pendahuluan (col-span-2) bento internal 5×5 ── */}
      <button onClick={() => goSlide(items[0].target)}
        className="group col-span-2 bg-white border-2 border-slate-200 hover:border-cardinal rounded-2xl p-3 md:p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-cardinal/10 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1 items-center">
          <div className="row-span-2 flex items-center justify-center h-full py-1">
            <NumBadge num={items[0].num} color="text-cardinal" />
          </div>
          <div className="col-start-2 row-start-1">
            <h3 className="font-extrabold text-lg md:text-xl text-slate-800">{items[0].title}</h3>
          </div>
          <div className="col-start-2 row-start-2">
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{items[0].desc}</p>
          </div>
          <div className="row-span-2 flex items-center justify-center h-full">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-cardinal/10 border border-cardinal/10 flex items-center justify-center group-hover:bg-cardinal/20 transition-colors">
              <BookOpen size={24} className="text-cardinal" />
            </div>
          </div>
        </div>
      </button>

      {/* ── 02 Metode ADDIE (col-span-1, row-span-2) ── */}
      <button onClick={() => goSlide(items[1].target)}
        className="group col-span-1 row-span-2 bg-white border-2 border-slate-200 hover:border-macaw rounded-2xl p-3 md:p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-macaw/10 hover:-translate-y-0.5 flex flex-col justify-between"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between">
            <NumBadge num={items[1].num} color="text-macaw" />
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-macaw/10 border border-macaw/10 flex items-center justify-center group-hover:bg-macaw/20 transition-colors shrink-0">
              <Puzzle size={20} className="text-macaw" />
            </div>
          </div>
          <h3 className="font-extrabold text-sm md:text-base text-slate-800">{items[1].title}</h3>
          <ul className="text-xs md:text-sm text-slate-500 leading-snug space-y-0 list-disc list-inside">
            <li>Analysis</li>
            <li>Design</li>
            <li>Development</li>
            <li>Implementation</li>
            <li>Evaluation</li>
          </ul>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-macaw mt-1">
          <span>5 tahap</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </button>

      {/* ── 03 Platform Logi ── */}
      <button onClick={() => goSlide(items[2].target)}
        className="group col-span-1 bg-white border-2 border-slate-200 hover:border-feather rounded-2xl p-3 md:p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-feather/10 hover:-translate-y-0.5"
      >
        <div className="grid gap-y-1.5">
          <div className="flex items-center justify-between">
            <NumBadge num={items[2].num} color="text-feather-dark" />
            <IconBox color="text-feather-dark"><Layout size={22} className="text-feather-dark" /></IconBox>
          </div>
          <h3 className="font-extrabold text-sm md:text-base text-slate-800">{items[2].title}</h3>
          <p className="text-xs md:text-sm text-slate-500">{items[2].desc}</p>
        </div>
      </button>

      {/* ── 04 AI Generatif ── */}
      <button onClick={() => goSlide(items[3].target)}
        className="group col-span-1 bg-white border-2 border-slate-200 hover:border-bee rounded-2xl p-3 md:p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-bee/10 hover:-translate-y-0.5"
      >
        <div className="grid gap-y-1.5">
          <div className="flex items-center justify-between">
            <NumBadge num={items[3].num} color="text-bee-dark" />
            <IconBox color="text-bee-dark"><Bot size={22} className="text-bee-dark" /></IconBox>
          </div>
          <h3 className="font-extrabold text-sm md:text-base text-slate-800">{items[3].title}</h3>
          <p className="text-xs md:text-sm text-slate-500">{items[3].desc}</p>
        </div>
      </button>
    </div>

    {/* Bottom row: 05 + 06 in 2-column grid */}
    <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-5xl mt-4 md:mt-5">
      {/* ── 05 Hasil Penelitian ── */}
      <button onClick={() => goSlide(items[4].target)}
        className="group bg-white border-2 border-slate-200 hover:border-fox rounded-2xl p-3 md:p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-fox/10 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 items-center">
          <div className="row-span-2 flex items-center justify-center h-full py-1">
            <NumBadge num={items[4].num} color="text-fox" />
          </div>
          <div className="col-start-2 row-start-1">
            <h3 className="font-extrabold text-sm md:text-base text-slate-800">{items[4].title}</h3>
          </div>
          <div className="col-start-2 row-start-2">
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{items[4].desc}</p>
          </div>
          <div className="row-span-2 flex items-center justify-center h-full">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-fox/10 border border-fox/10 flex items-center justify-center group-hover:bg-fox/20 transition-colors">
              <BarChart3 size={18} className="text-fox" />
            </div>
          </div>
        </div>
      </button>

      {/* ── 06 Kesimpulan ── */}
      <button onClick={() => goSlide(items[5].target)}
        className="group bg-white border-2 border-slate-200 hover:border-feather rounded-2xl p-3 md:p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-feather/10 hover:-translate-y-0.5"
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 items-center">
          <div className="row-span-2 flex items-center justify-center h-full py-1">
            <NumBadge num={items[5].num} color="text-feather-dark" />
          </div>
          <div className="col-start-2 row-start-1">
            <h3 className="font-extrabold text-sm md:text-base text-slate-800">{items[5].title}</h3>
          </div>
          <div className="col-start-2 row-start-2">
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{items[5].desc}</p>
          </div>
          <div className="row-span-2 flex items-center justify-center h-full">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-feather/10 border border-feather/10 flex items-center justify-center group-hover:bg-feather/20 transition-colors">
              <CheckCircle size={18} className="text-feather-dark" />
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
);
