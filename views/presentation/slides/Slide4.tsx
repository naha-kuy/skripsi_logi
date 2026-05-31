import React from 'react';

export const Slide4 = () => (
  <div className="w-full max-w-5xl mx-auto">
    <div className="text-center max-w-3xl mx-auto mb-8">
      <span className="text-feather font-black text-base uppercase tracking-wider">Pendidikan Matematika Abad 21</span>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display mt-2">
        Urgensi Computational Thinking (CT)
      </h2>
      <p className="text-slate-600 text-base md:text-lg mt-3 leading-relaxed">
        Melatih siswa memecahkan masalah matematika menggunakan pendekatan logis, sistematis, dan komputasional.
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
      {[
        { title: 'Dekomposisi', desc: 'Memecah masalah geometri kompleks menjadi sub-masalah terkontrol.', icon: '🧩' },
        { title: 'Pengenalan Pola', desc: 'Menganalisis pola keserupaan rumus bangun ruang dimensi tiga.', icon: '📊' },
        { title: 'Abstraksi', desc: 'Menyeleksi informasi esensial dan mengabaikan atribut yang tidak relevan.', icon: '🔄' },
        { title: 'Algoritma', desc: 'Menyusun prosedur terstruktur guna penyelesaian hitungan secara efektif.', icon: '⚙️' }
      ].map((pilar, index) => (
        <div key={index} className="card-duo flex flex-col gap-4 p-6 border-2 border-slate-200 rounded-2xl bg-white transition-all duration-200 hover:-translate-y-1">
          <div className="text-4xl">{pilar.icon}</div>
          <h3 className="font-display font-black text-xl text-slate-800">{pilar.title}</h3>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed flex-1">{pilar.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-macaw/5 border-l-4 border-macaw p-4 rounded-r-2xl mt-8 text-center max-w-3xl mx-auto">
      <p className="text-sm md:text-base font-bold text-macaw-dark">
        Kurikulum Merdeka mengintegrasikan CT untuk melatih kemandirian berpikir matematis secara kritis.
      </p>
    </div>
  </div>
);