import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  as?: 'button' | 'a';
  href?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({ variant = 'primary', className = '', children, as = 'button', href, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:text-slate-900'
  };
  if (as === 'a') {
    return (
      <a href={href} className={`${base} ${variants[variant]} ${className}`} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
