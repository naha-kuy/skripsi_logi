import React from 'react';
import { Monitor, Gamepad2 } from 'lucide-react';

export const Slide6 = () => (
  <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
    <div className="text-center">
      <span className="text-feather font-black text-base uppercase tracking-wider">Solusi Penelitian</span>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display mt-2">
        Platform Pembelajaran "Logi"
      </h2>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 items-center mt-4">
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-2">
            <Monitor className="text-macaw" />
            Web-Based Platform
          </h3>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            Logi merupakan aplikasi berbasis web responsif yang dirancang untuk pembelajaran geometri ruang 3D. Terintegrasi dengan basis data real-time Supabase.
          </p>
        </div>
        
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-display font-black text-xl text-slate-800 flex items-center gap-2">
            <Gamepad2 className="text-feather" />
            Gamifikasi PBL Terpadu
          </h3>
          <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            Siswa belajar sembari bermain menggunakan mekanik game 3D interaktif yang dipadukan dengan reward sistem berupa Points, Badges, dan Leaderboard.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 border-2 border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-8 shadow-sm relative">
        <Monitor className="w-16 h-16 text-slate-300 mb-3 animate-pulse" />
        <div className="font-bold text-slate-700 text-base">Dashboard Utama Logi</div>
        <p className="text-xs text-slate-500 text-center mt-2 max-w-sm">
          [PLACEHOLDER: Tangkapan layar antarmuka dashboard utama Logi]
        </p>
        <div className="absolute bottom-2 right-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-mono">
          screenshot_dashboard.png
        </div>
      </div>
    </div>
  </div>
);