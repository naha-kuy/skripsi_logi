import React from 'react';
import { SlideImage } from '../components/SlideImage';

export const SlideSeq: React.FC = () => (
  <div className="flex flex-col items-center px-4 md:px-6 pt-2 pb-3 select-none w-full">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 font-display mb-5">Sequence Diagram</h2>

    <div className="w-full max-w-6xl">
      <SlideImage
        imageName="sequence_diagram.png"
        alt="Sequence Diagram Interaksi Komponen"
        aspect="3002/2620"
        className="w-full"
      />
    </div>
  </div>
);
