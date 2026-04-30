import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Komponen tombol yang dapat digunakan kembali dengan berbagai varian dan ukuran.
 * 
 * @param {ButtonProps} props - Properti komponen tombol.
 * @param {React.ReactNode} props.children - Konten yang akan ditampilkan di dalam tombol.
 * @param {'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'} [props.variant='primary'] - Varian gaya tombol.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Ukuran tombol.
 * @param {string} [props.className=''] - Kelas CSS tambahan.
 * @param {React.ReactNode} [props.icon] - Ikon opsional yang ditampilkan sebelum teks.
 * @returns {JSX.Element} Elemen tombol yang dirender.
 */
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-extrabold rounded-2xl transition-all duration-150 active:translate-y-1 active:scale-[0.97] focus-visible:ring-4 focus-visible:ring-macaw-light/50 focus:outline-none uppercase tracking-wider";
  
  const variants = {
    primary: "bg-feather text-white border-b-4 border-feather-dark active:border-b-0 hover:brightness-110 shadow-[0_4px_14px_rgba(88,204,2,0.3)]",
    secondary: "bg-macaw text-white border-b-4 border-macaw-dark active:border-b-0 hover:brightness-110 shadow-[0_4px_14px_rgba(28,176,246,0.3)]",
    danger: "bg-cardinal text-white border-b-4 border-cardinal-dark active:border-b-0 hover:brightness-110 shadow-[0_4px_14px_rgba(255,75,75,0.3)]",
    outline: "bg-white text-slate-700 border-2 border-b-4 border-slate-200 active:border-b-2 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100 border-b-4 border-transparent active:border-b-0",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-12 px-6 text-sm",
    lg: "h-14 px-8 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};