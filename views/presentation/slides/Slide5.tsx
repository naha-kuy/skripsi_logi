import React from 'react';

export const Slide5 = () => (
  <div className="w-full max-w-5xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display text-center mb-8">
      Fokus Penelitian & Tujuan
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="border-2 border-slate-200 rounded-3xl p-8 bg-white shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100 text-cardinal">
          <div className="w-3.5 h-3.5 rounded-full bg-cardinal" />
          <span className="font-display font-black text-base uppercase tracking-wider text-slate-800">Rumusan Masalah</span>
        </div>
        <ul className="space-y-4 flex-1">
          {[
            'Bagaimana validitas platform pembelajaran matematika "Logi" terintegrasi AI Generatif?',
            'Bagaimana praktikalitas platform pembelajaran "Logi" menurut respon guru dan siswa?',
            'Bagaimana efektivitas platform "Logi" dalam meningkatkan berpikir komputasional (CT) siswa?'
          ].map((q, idx) => (
            <li key={idx} className="flex gap-3 items-start text-sm md:text-base text-slate-700">
              <span className="font-display font-black text-cardinal text-lg">{idx + 1}.</span>
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-2 border-slate-200 rounded-3xl p-8 bg-white shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-100 text-feather">
          <div className="w-3.5 h-3.5 rounded-full bg-feather" />
          <span className="font-display font-black text-base uppercase tracking-wider text-slate-800">Tujuan Penelitian</span>
        </div>
        <ul className="space-y-4 flex-1">
          {[
            'Menghasilkan media pembelajaran interaktif "Logi" yang Valid untuk materi geometri ruang.',
            'Mewujudkan platform yang Praktis dan aplikatif digunakan dalam kegiatan belajar mengajar.',
            'Membuktikan peningkatan keterampilan berpikir komputasional secara Efektif melalui data empiris.'
          ].map((aim, idx) => (
            <li key={idx} className="flex gap-3 items-start text-sm md:text-base text-slate-700">
              <span className="font-display font-black text-feather text-lg">✓</span>
              <span className="leading-relaxed">{aim}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);