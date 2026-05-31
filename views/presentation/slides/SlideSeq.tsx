import React from 'react';
import { SlideImage } from '../components/SlideImage';

export const SlideSeq: React.FC = () => (
  <div className="flex flex-col items-center text-center px-4 md:px-6 pt-2 md:pt-3 pb-3 md:pb-4 select-none">
    <p className="text-xs font-bold text-feather-dark uppercase tracking-[0.2em] mb-1">Arsitektur Sistem</p>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 font-display mb-1">Sequence Diagram</h2>
    <p className="text-sm md:text-base text-slate-500 mb-2">Interaksi komponen sistem pembuatan soal</p>

    <div className="w-full max-w-5xl">
      <SlideImage
        imageName="sequence_diagram.png"
        alt="Sequence Diagram Interaksi Komponen"
        aspect="3002/2620"
        className="w-full"
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-bold text-slate-400">Sequence Diagram Interaksi Komponen</p>
          <p className="text-[10px] text-slate-400">3002 x 2620 px</p>
        </div>
      </SlideImage>
    </div>
  </div>
);
