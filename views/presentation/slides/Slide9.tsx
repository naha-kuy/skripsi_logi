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
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">AI Generatif & Human-in-the-Loop</h2>

    <div className="w-full max-w-6xl relative">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 w-full relative z-10">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.number} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
              <div className={`${s.bg} ${s.border} border-2 rounded-2xl p-3 flex-1 md:w-full transition-all hover:shadow-lg hover:-translate-y-0.5`}>
                <span className="text-sm md:text-base font-black text-slate-400 mb-1 block">{String(i + 1).padStart(2, '0')}</span>
                <div className={`w-12 h-12 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center mx-auto mb-1`}>
                  <Icon size={22} className={s.color} />
                </div>
                <p className={`font-extrabold text-lg md:text-xl ${s.color} mb-1`}>{s.title}</p>
                <p className="text-base md:text-lg text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="w-full max-w-6xl mt-5 bg-white border-2 border-slate-200 rounded-2xl p-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-feather/10 border border-feather/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={18} className="text-feather-dark" />
          </div>
          <div className="text-left">
            <p className="font-extrabold text-lg md:text-xl text-slate-800 mb-0.5">Few-Shot Prompting</p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">Prompt hardcoded berisi skema jawaban dan 2&ndash;3 contoh soal bergradasi sebagai acuan AI.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-bee/10 border border-bee/10 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle size={18} className="text-bee-dark" />
          </div>
          <div className="text-left">
            <p className="font-extrabold text-lg md:text-xl text-slate-800 mb-0.5">Kurasi &amp; Edit Manual</p>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">Guru meninjau, menyunting, dan menyetujui tiap soal sebelum ditayangkan ke siswa.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
