import React, { useState, useEffect } from 'react';

export const CountUp: React.FC<{ value: number; duration?: number; decimals?: number; suffix?: string; trigger: boolean }> = ({ 
  value, 
  duration = 1000, 
  decimals = 1, 
  suffix = '',
  trigger 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) {
      setCount(0);
      return;
    }
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = progress * (2 - progress);
      setCount(easedProgress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration, trigger]);

  return <span>{count.toFixed(decimals)}{suffix}</span>;
};
