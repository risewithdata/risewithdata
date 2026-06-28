import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' };

export default function Button({ children, variant = 'primary', ...rest }: Props) {
  const base = 'px-4 py-2 rounded';
  const variantCls = variant === 'primary' ? 'bg-brand-600 text-white' : 'bg-transparent';
  return (
    <button className={`${base} ${variantCls}`} {...rest}>
      {children}
    </button>
  );
}
