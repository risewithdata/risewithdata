import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function Badge({ children }: Props) {
  return (
    <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
      {children}
    </span>
  );
}
