import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface SlideImageProps {
  imageName: string;
  alt: string;
  aspect?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SlideImage: React.FC<SlideImageProps> = ({ imageName, alt, aspect, className, children }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [imageName]);

  return (
    <div className={`relative overflow-hidden ${aspect ? `aspect-[${aspect}]` : ''} ${className || ''}`}>
      <img
        src={`/images/presentation/${imageName}`}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => { setFailed(true); setLoaded(false); }}
        className={`w-full h-full object-contain ${loaded ? 'block' : 'hidden'}`}
      />
      {(!loaded || failed) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl">
          {children || (
            <div className="flex flex-col items-center gap-2 p-4">
              <Image size={32} className="text-slate-400 shrink-0" />
              <p className="text-xs font-bold text-slate-400 text-center">{alt}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
