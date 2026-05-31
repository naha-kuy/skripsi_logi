import React from 'react';

export const Slide9 = () => (
  <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
    <div className="text-center">
      <span className="text-feather font-black text-base uppercase tracking-wider">Prosedur Riset R&D</span>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display mt-2">
        Model Pengembangan ADDIE
      </h2>
    </div>

    <div className="grid grid-cols-5 gap-2 md:gap-4 mt-6 bg-slate-50 p-6 rounded-3xl border-2 border-slate-200">
      {[
        { letter: 'A', name: 'Analysis', desc: 'Kebutuhan & CT', color: 'bg-cardinal text-white' },
        { letter: 'D', name: 'Design', desc: 'Mockup UI & DB', color: 'bg-macaw text-white' },
        { letter: 'D', name: 'Develop', desc: 'Pemrograman React', color: 'bg-bee text-slate-900' },
        { letter: 'I', name: 'Implement', desc: 'Uji Coba Kelas VIII', color: 'bg-feather text-white' },
        { letter: 'E', name: 'Evaluate', desc: 'Analisis Dampak CT', color: 'bg-slate-900 text-white' }
      ].map((step, idx) => (
        <div key={idx} className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center font-display font-black text-xl md:text-4xl ${step.color} shadow-md`}>
            {step.letter}
          </div>
          <div className="font-display font-black text-xs md:text-lg mt-3 text-slate-800">{step.name}</div>
          <div className="text-[10px] md:text-sm text-slate-500 mt-1 hidden sm:block">{step.desc}</div>
        </div>
      ))}
    </div>

    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:text-base text-slate-600">
      <div>
        <h4 className="font-display font-bold text-slate-800 mb-2">📋 Tahap Desain & Pembuatan (Analysis-Design-Develop)</h4>
        <p className="leading-relaxed text-sm md:text-base">
          Menganalisis kesulitan visualisasi spasial 3D, merancang aset media gamifikasi, dan membuat aplikasi utuh menggunakan <strong>React, Tailwind, Supabase,</strong> dan <strong>Gemini AI API</strong>.
        </p>
      </div>
      <div className="border-l border-slate-200 hidden md:block" />
      <div>
        <h4 className="font-display font-bold text-slate-800 mb-2">🚀 Tahap Penerapan & Penilaian (Implement-Evaluate)</h4>
        <p className="leading-relaxed text-sm md:text-base">
          Menguji kepraktisan platform Logi kepada siswa kelas VIII di kelas matematika, serta mengevaluasi validitas media serta efektivitas dampak berpikir komputasional.
        </p>
      </div>
    </div>
  </div>
);