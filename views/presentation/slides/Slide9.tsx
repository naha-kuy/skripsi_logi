import React from 'react';
import { User, Bot, Database, GraduationCap, Edit3, Sparkles, CheckCircle } from 'lucide-react';

const steps = [
  { number: '1', icon: User, title: 'Guru', desc: 'Menentukan KD & topik konteks soal', color: 'text-macaw', bg: 'bg-macaw/5', border: 'border-macaw/10' },
  { number: '2', icon: Bot, title: 'AI Generatif', desc: 'Membuat pertanyaan dengan few-shot prompting dari hardcoded', color: 'text-feather-dark', bg: 'bg-feather/5', border: 'border-feather/10' },
  { number: '3', icon: Edit3, title: 'Kurasi Guru', desc: 'Review, edit manual jika perlu, lalu setujui', color: 'text-bee-dark', bg: 'bg-bee/5', border: 'border-bee/10' },
  { number: '4', icon: Database, title: 'Database', desc: 'Soal tersimpan & siap digunakan', color: 'text-fox', bg: 'bg-fox/5', border: 'border-fox/10' },
  { number: '5', icon: GraduationCap, title: 'Siswa', desc: 'Mengerjakan soal di platform Logi', color: 'text-cardinal', bg: 'bg-cardinal/5', border: 'border-cardinal/10' },
];

export const Slide9 = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-sm font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Inovasi</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">AI Generatif & Human-in-the-Loop</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2.5 max-w-2xl">Alur pembuatan soal berbantuan AI dengan kurasi guru</p>

    <div className="w-full max-w-5xl relative">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-1.5 md:gap-1.5 w-full relative z-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.number} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
              <div className={`${s.bg} ${s.border} border-2 rounded-2xl p-2.5 md:p-3.5 flex-1 md:w-full transition-all hover:shadow-lg hover:-translate-y-0.5`}>
                <span className="text-xs md:text-sm font-black text-slate-400 mb-0.5 block">{String(i + 1).padStart(2, '0')}</span>
                <div className={`w-9 h-9 md:w-11 md:h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mx-auto mb-1`}>
                  <Icon size={16} className={s.color} />
                </div>
                <p className={`font-extrabold text-xs md:text-sm ${s.color} mb-0.5`}>{s.title}</p>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="w-full max-w-5xl mt-3 bg-white border-2 border-slate-200 rounded-2xl p-3 md:p-4">
      <div className="grid md:grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-xl bg-feather/10 border border-feather/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={14} className="text-feather-dark" />
          </div>
          <div className="text-left">
            <p className="font-extrabold text-xs md:text-sm text-slate-800 mb-0.5">Few-Shot Prompting</p>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">Prompt hardcoded berisi skema jawaban dan 2&ndash;3 contoh soal bergradasi sebagai acuan AI.</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-xl bg-bee/10 border border-bee/10 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle size={14} className="text-bee-dark" />
          </div>
          <div className="text-left">
            <p className="font-extrabold text-xs md:text-sm text-slate-800 mb-0.5">Kurasi &amp; Edit Manual</p>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">Guru meninjau, menyunting, dan menyetujui tiap soal sebelum ditayangkan ke siswa.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
