import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Monitor, 
  BookOpen, 
  Award, 
  Bot, 
  Gamepad2, 
  CheckCircle, 
  TrendingUp, 
  BarChart2, 
  List, 
  ArrowRight, 
  Compass, 
  Users, 
  Check, 
  HelpCircle, 
  Activity, 
  FileText, 
  X, 
  Layers, 
  Home, 
  Target,
  Menu,
  BookOpenCheck,
  User2
} from 'lucide-react';

import { Slide1 } from './slides/Slide1';
import { Slide2 } from './slides/Slide2';
import { Slide3 } from './slides/Slide3';
import { Slide4 } from './slides/Slide4';
import { Slide5 } from './slides/Slide5';
import { Slide6 } from './slides/Slide6';
import { Slide7 } from './slides/Slide7';
import { Slide8 } from './slides/Slide8';
import { Slide9 } from './slides/Slide9';
import { Slide10 } from './slides/Slide10';
import { Slide11 } from './slides/Slide11';
import { Slide12 } from './slides/Slide12';
import { Slide13 } from './slides/Slide13';
import { Slide14 } from './slides/Slide14';
import { Slide15 } from './slides/Slide15';

export const Presentation: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 15;

  // Slide list titles for sidebar
  const slideTitles = [
    "Cover / Judul Skripsi",
    "Outline Presentasi",
    "Latar Belakang Masalah",
    "Urgensi Computational Thinking",
    "Rumusan Masalah & Tujuan",
    "Platform Logi — Overview",
    "Fitur Gamifikasi PBL",
    "AI Generatif & Human-in-the-Loop",
    "Metode Pengembangan ADDIE",
    "Hasil Validitas Media",
    "Hasil Praktikalitas Pengguna",
    "Hasil Efektivitas Kuis",
    "Kesimpulan & Saran",
    "Daftar Pustaka",
    "Penutup & Tanya Jawab"
  ];

  // Track slide hash on load & slide change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#slide-')) {
        const slideNum = parseInt(hash.replace('#slide-', ''), 10);
        if (slideNum >= 1 && slideNum <= totalSlides) {
          setCurrentSlide(slideNum);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.history.replaceState(null, '', `#slide-${currentSlide}`);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isFullscreen]);

  // Touch/Swipe navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Synchronize internal state with browser fullscreen event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isCurrent = (slideNum: number) => currentSlide === slideNum;

  // Slide content render mapping
    const renderSlideContent = () => {
    switch (currentSlide) {
      case 1: return <Slide1 />;
      case 2: return <Slide2 setCurrentSlide={setCurrentSlide} />;
      case 3: return <Slide3 />;
      case 4: return <Slide4 />;
      case 5: return <Slide5 />;
      case 6: return <Slide6 />;
      case 7: return <Slide7 />;
      case 8: return <Slide8 />;
      case 9: return <Slide9 />;
      case 10: return <Slide10 isActive={isCurrent(10)} />;
      case 11: return <Slide11 isActive={isCurrent(11)} />;
      case 12: return <Slide12 isActive={isCurrent(12)} />;
      case 13: return <Slide13 />;
      case 14: return <Slide14 />;
      case 15: return <Slide15 />;
      default: return null;
    }
  };

  const isCoverOrClosing = currentSlide === 1 || currentSlide === 15;

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`w-full flex font-sans transition-colors duration-500 relative ${
        isCoverOrClosing 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white h-screen overflow-hidden' 
          : `bg-slate-50 text-slate-700 ${isFullscreen ? 'h-screen overflow-y-auto' : 'min-h-screen'} flex-col`
      }`}
    >
      {/* Sidebar Outline Navigation (Show/Hide Panel) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-80 md:w-96 bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-display font-black text-slate-800 text-base md:text-lg flex items-center gap-2">
                <List className="text-feather" /> Daftar Slide
              </span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              {slideTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentSlide(idx + 1);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium text-xs md:text-sm transition-all flex items-center gap-3 ${
                    currentSlide === idx + 1 
                      ? 'bg-feather text-white font-bold shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    currentSlide === idx + 1 ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="truncate">{title}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-400 font-mono text-center">
              Tekan 'O' untuk toggle daftar slide
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Top Slide Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200/20 z-50">
        <div 
          className="h-full bg-gradient-to-r from-feather to-feather-light rounded-r-full transition-all duration-300 ease-out"
          style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
        />
      </div>

      {/* Main Column Wrapper */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Floating Header */}
        <header className={`p-4 flex items-center justify-between border-b transition-all duration-300 ${
          isCoverOrClosing ? 'border-white/5 bg-transparent' : 'border-slate-200 bg-white/80 backdrop-blur-md'
        } sticky top-0 z-40`}>
          <div className="flex items-center gap-3 select-none">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-xl border transition-colors ${
                isCoverOrClosing 
                  ? 'border-white/10 hover:bg-white/10 text-white' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Daftar Slide (O)"
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-feather flex items-center justify-center font-display font-black text-white text-base shadow-sm">L</span>
              <span className={`font-display font-black text-sm md:text-base tracking-wide ${isCoverOrClosing ? 'text-white' : 'text-slate-800'}`}>
                Logi Sidang Skripsi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Slide Dropdown */}
            <div className="relative">
              <select
                value={currentSlide}
                onChange={(e) => setCurrentSlide(Number(e.target.value))}
                className={`text-xs font-black rounded-xl px-3 py-1.5 appearance-none border transition-colors outline-none cursor-pointer pr-6 ${
                  isCoverOrClosing 
                    ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' 
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='${isCoverOrClosing ? 'white' : 'currentColor'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1rem 1rem',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {Array.from({ length: totalSlides }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="text-slate-900">
                    Slide {i + 1} of {totalSlides}
                  </option>
                ))}
              </select>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
              className={`p-2 rounded-xl border transition-all ${
                isCoverOrClosing 
                  ? 'border-white/10 hover:bg-white/10 text-white' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </header>

        {/* Main Slide Content Workspace */}
        <main className={`flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 select-none relative ${
          isCoverOrClosing ? 'h-full overflow-hidden' : ''
        }`}>
          <div className="w-full h-full max-w-6xl mx-auto flex items-center justify-center py-4">
            {renderSlideContent()}
          </div>
        </main>

        {/* Footer Navigation Bar */}
        <footer className={`p-4 md:p-6 border-t flex items-center justify-between sticky bottom-0 z-40 transition-all duration-300 ${
          isCoverOrClosing ? 'border-white/5 bg-transparent' : 'border-slate-200 bg-white/95 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 1}
              className="btn-outline flex items-center gap-1 text-xs md:text-sm font-bold uppercase tracking-wider py-2.5 px-4 disabled:opacity-30 disabled:pointer-events-none rounded-xl shadow-sm"
            >
              <ChevronLeft size={16} /> Prev
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="hidden md:flex items-center gap-2 max-w-md overflow-x-auto px-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx + 1 
                    ? 'bg-feather scale-125 ring-4 ring-feather/20' 
                    : isCoverOrClosing ? 'bg-white/20 hover:bg-white/40' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Slide ${idx + 1}: ${slideTitles[idx]}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentSlide === totalSlides ? (
              <button
                onClick={() => setCurrentSlide(1)}
                className="btn-primary flex items-center gap-1.5 text-xs md:text-sm font-black uppercase tracking-widest py-2.5 px-5 rounded-xl shadow-md"
              >
                <Home size={16} /> Cover
              </button>
            ) : (
              <button
                onClick={nextSlide}
                className="btn-primary flex items-center gap-1.5 text-xs md:text-sm font-black uppercase tracking-widest py-2.5 px-5 rounded-xl shadow-md"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Presentation;
