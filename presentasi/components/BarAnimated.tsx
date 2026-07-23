import React, { useState, useEffect } from 'react';

export const BarAnimated: React.FC<{
  isActive: boolean;
  color?: string;
  width: string;
  delay?: number;
  trackBg?: string;
  className?: string;
}> = ({
  isActive,
  color = 'bg-fox',
  width,
  delay = 0,
  trackBg = 'bg-slate-100',
  className = ''
}) => {
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setAnim(true), 50 + delay);
      return () => clearTimeout(t);
    } else {
      setAnim(false);
    }
  }, [isActive, delay]);

  return (
    <div className={`h-2.5 ${trackBg} rounded-full overflow-hidden ${className}`}>
      <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: anim ? width : '0%' }} />
    </div>
  );
};
