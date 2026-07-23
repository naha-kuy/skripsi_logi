import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Menu, X, Home } from 'lucide-react';

import { YSlide1 } from './slides/YSlide1';
import { YSlide2 } from './slides/YSlide2';
import { YSlide3 } from './slides/YSlide3';
import { YSlide4 } from './slides/YSlide4';
import { YSlide5 } from './slides/YSlide5';
import { YSlide6 } from './slides/YSlide6';
import { YSlide7 } from './slides/YSlide7';
import { YSlide8 } from './slides/YSlide8';
import { YSlide9 } from './slides/YSlide9';
import { YSlide10 } from './slides/YSlide10';
import { YSlide11 } from './slides/YSlide11';
import { YSlide12 } from './slides/YSlide12';

const TOTAL_SLIDES = 12;

const slideTitles = [
  "Cover",
  "Latar Belakang",
  "Rumusan Masalah & Tujuan",
  "Metode Penelitian",
  "Produk yang Dikembangkan",
  "Hasil Validasi Media",
  "Hasil Implementasi",
  "Hasil Analisis N-Gain",
  "Pembahasan",
  "Kesimpulan",
  "Saran",
  "Penutup"
];

export const YPresentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isCoverOrClosing = currentSlide === 1 || currentSlide === TOTAL_SLIDES;

  useEffect(() => {
    const match = window.location.pathname.match(/\/presentasi\/slide-(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n >= 1 && n <= TOTAL_SLIDES) setCurrentSlide(n);
    } else if (window.location.pathname !== '/presentasi') {
      window.history.replaceState(null, '', '/presentasi/slide-1');
    }
  }, []);

  useEffect(() => {
    const expected = `/presentasi/slide-${currentSlide}`;
    if (window.location.pathname !== expected) {
      window.history.replaceState(null, '', expected);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handlePop = () => {
      const match = window.location.pathname.match(/\/presentasi\/slide-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n >= 1 && n <= TOTAL_SLIDES) setCurrentSlide(n);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); nextSlide(); }
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') { e.preventDefault(); prevSlide(); }
      else if (e.key === 'Home') { e.preventDefault(); goSlide(1); }
      else if (e.key === 'End') { e.preventDefault(); goSlide(TOTAL_SLIDES); }
      else if (e.key.toLowerCase() === 'f') { e.preventDefault(); toggleFullscreen(); }
      else if (e.key.toLowerCase() === 'o' && !isCoverOrClosing) { e.preventDefault(); setIsSidebarOpen(p => !p); }
      else if (e.key === 'Escape' && document.fullscreenElement) { document.exitFullscreen(); setIsFullscreen(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSlide, isFullscreen]);

  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; touchY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || touchY.current === null) return;
    const dx = touchX.current - e.changedTouches[0].clientX;
    const dy = touchY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) nextSlide(); else prevSlide();
    }
    touchX.current = null; touchY.current = null;
  };

  const nextSlide = () => { if (currentSlide < TOTAL_SLIDES) { setCurrentSlide(p => p + 1); } };
  const prevSlide = () => { if (currentSlide > 1) { setCurrentSlide(p => p - 1); } };
  const goSlide = (n: number) => { setCurrentSlide(n); };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { containerRef.current?.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  };
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const renderSlide = () => {
    switch (currentSlide) {
      case 1: return <YSlide1 />;
      case 2: return <YSlide2 />;
      case 3: return <YSlide3 />;
      case 4: return <YSlide4 />;
      case 5: return <YSlide5 />;
      case 6: return <YSlide6 isActive={currentSlide === 6} />;
      case 7: return <YSlide7 isActive={currentSlide === 7} />;
      case 8: return <YSlide8 isActive={currentSlide === 8} />;
      case 9: return <YSlide9 />;
      case 10: return <YSlide10 isActive={currentSlide === 10} />;
      case 11: return <YSlide11 />;
      case 12: return <YSlide12 />;
      default: return null;
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`w-full font-sans flex flex-col relative ${
        isCoverOrClosing
          ? 'bg-slate-950 text-white h-screen overflow-hidden'
          : 'bg-white text-slate-800 min-h-screen'
      } ${isFullscreen && !isCoverOrClosing ? 'h-screen overflow-y-auto' : ''}`}
    >
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm">
          <div className="w-80 bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 animate-[slideInLeft_0.3s_ease-out]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <span className="font-display font-black text-xl text-slate-800">Daftar Slide</span>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {slideTitles.map((t, i) => (
                <button key={i} onClick={() => { goSlide(i + 1); setIsSidebarOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-all ${
                    currentSlide === i + 1 ? 'bg-fox text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    currentSlide === i + 1 ? 'bg-white/20' : 'bg-slate-200 text-slate-600'
                  }`}>{i + 1}</span>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {!isCoverOrClosing && (
      <header className="flex items-center justify-between px-6 py-2 sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
          ><Menu size={22} /></button>
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-base shadow-sm bg-fox text-white">Y</span>
            <span className="font-display font-black text-base hidden sm:inline text-slate-700">Presentasi</span>
          </div>
        </div>
        <button onClick={toggleFullscreen}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
          title={isFullscreen ? 'Keluar (F)' : 'Fullscreen (F)'}
        >{isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}</button>
      </header>
      )}

      <main className={`flex-1 select-none ${
        isCoverOrClosing ? 'overflow-hidden p-0' : 'overflow-y-auto px-3 sm:px-6 py-4'
      }`}>
        <div key={currentSlide} className={`flex-1 w-full ${isCoverOrClosing ? '' : 'max-w-7xl'} mx-auto animate-[fadeIn_0.35s_ease-out]`}>
          {renderSlide()}
        </div>
      </main>

      {!isCoverOrClosing && (
      <footer className="sticky bottom-0 z-30 bg-white/90 backdrop-blur-md border-t border-slate-200">
        <div className="h-1.5 w-full bg-slate-100">
          <div className="h-full bg-fox transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${(currentSlide / TOTAL_SLIDES) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-6 py-2">
          <button onClick={prevSlide} disabled={currentSlide === 1}
            className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider py-2.5 px-5 disabled:opacity-30 disabled:pointer-events-none rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
          ><ChevronLeft size={18} /> Prev</button>

          <div className="hidden md:flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button key={i} onClick={() => goSlide(i + 1)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === i + 1
                    ? 'bg-fox scale-125 ring-2 ring-fox/30'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Slide ${i + 1}: ${slideTitles[i]}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tabular-nums mr-1 text-slate-400">
              {currentSlide}/{TOTAL_SLIDES}
            </span>
            {currentSlide === TOTAL_SLIDES ? (
              <button onClick={() => goSlide(1)}
                className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest py-2.5 px-6 rounded-xl bg-fox text-white shadow-md"
              ><Home size={18} /> Cover</button>
            ) : (
              <button onClick={nextSlide}
                className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest py-2.5 px-6 rounded-xl bg-fox text-white shadow-md"
              >Next <ChevronRight size={18} /></button>
            )}
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default YPresentation;
