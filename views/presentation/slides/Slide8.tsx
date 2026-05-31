import React from 'react';
import { Bot } from 'lucide-react';

export const Slide8 = () => (
  <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
    <div className="text-center">
      <span className="text-feather font-black text-base uppercase tracking-wider">Asisten Pembelajaran Terkendali</span>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display mt-2">
        AI Generatif & Human-in-the-Loop (HITL)
      </h2>
    </div>

    <div className="flex flex-col lg:flex-row gap-8 items-center mt-4">
      <div className="w-full lg:w-1/2 bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 shadow-inner flex flex-col gap-6">
        <h3 className="font-display font-black text-slate-800 text-center text-sm uppercase tracking-wide">Alur Human-in-the-Loop</h3>
        
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm z-10">
            <div className="w-8 h-8 rounded-full bg-macaw flex items-center justify-center text-white font-black text-sm shrink-0">1</div>
            <div className="flex-1">
              <h4 className="font-bold text-xs md:text-sm text-slate-800">Siswa (Prompting)</h4>
              <p className="text-[10px] md:text-xs text-slate-500">Meminta bantuan atau scaffold dalam memecahkan soal geometri.</p>
            </div>
          </div>
          
          <div className="absolute left-8 top-12 w-0.5 h-10 bg-slate-300" />
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm z-10 mt-2">
            <div className="w-8 h-8 rounded-full bg-feather flex items-center justify-center text-white font-black text-sm shrink-0">2</div>
            <div className="flex-1">
              <h4 className="font-bold text-xs md:text-sm text-slate-800">LogiChat AI (Generative Scaffold)</h4>
              <p className="text-[10px] md:text-xs text-slate-500">Membantu memberikan tahapan berpikir (berpikir komputasional) logis.</p>
            </div>
          </div>

          <div className="absolute left-8 top-32 w-0.5 h-10 bg-slate-300" />

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm z-10 mt-2">
            <div className="w-8 h-8 rounded-full bg-bee flex items-center justify-center text-white font-black text-sm shrink-0">3</div>
            <div className="flex-1">
              <h4 className="font-bold text-xs md:text-sm text-slate-800">Guru (Monitoring & Control)</h4>
              <p className="text-[10px] md:text-xs text-slate-500">Memantau percakapan kuis siswa serta mengontrol setelan System Prompt.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="border-2 border-slate-200 rounded-3xl aspect-[4/3] bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-8 relative shadow-sm">
          <Bot className="w-16 h-16 text-slate-300 mb-3 animate-bounce-slow" />
          <div className="font-bold text-slate-700 text-base">Antarmuka Chatbot AI "LogiChat"</div>
          <p className="text-xs text-slate-500 text-center mt-2 max-w-sm">
            [PLACEHOLDER: Screenshot chatbot AI yang menuntun pemahaman geometri ruang siswa]
          </p>
          <div className="absolute bottom-2 right-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-mono">
            screenshot_logichat.png
          </div>
        </div>
      </div>
    </div>
  </div>
);