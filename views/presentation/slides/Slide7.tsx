import React from 'react';

export const Slide7 = () => (
  <div className="w-full max-w-5xl mx-auto">
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display text-center mb-8">
      Mekanika Gamifikasi PBL (Points, Badges, Leaderboard)
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'Points (XP System)', desc: 'Skor XP didapat dari penyelesaian topik kuis, tantangan logika harian, dan petualangan game.', icon: '⭐', label: 'screenshot_xp_popup.png' },
        { title: 'Badges (Achieve)', desc: 'Lencana eksklusif yang memotivasi kompetensi diri (misal: "Pemberantas Kubus", "Logi Master").', icon: '🏅', label: 'screenshot_badge.png' },
        { title: 'Leaderboard (Papan)', desc: 'Pemeringkatan real-time kelas untuk merangsang jiwa kompetisi akademis yang suportif.', icon: '🏆', label: 'screenshot_leaderboard.png' }
      ].map((item, idx) => (
        <div key={idx} className="border-2 border-slate-200 rounded-3xl p-6 bg-white shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{item.icon}</span>
            <h3 className="font-display font-black text-xl text-slate-800">{item.title}</h3>
          </div>
          <p className="text-xs md:text-sm text-slate-500 leading-relaxed flex-1">{item.desc}</p>
          
          <div className="border border-slate-200 rounded-xl aspect-[2/1] bg-slate-50 flex flex-col items-center justify-center text-[10px] text-slate-400 p-2 text-center relative">
            <span>[PLACEHOLDER: Visual {item.title}]</span>
            <span className="absolute bottom-1 right-1 font-mono text-[9px] bg-slate-800 text-white px-1 rounded">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);