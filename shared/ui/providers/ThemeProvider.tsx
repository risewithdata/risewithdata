import React from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div data-theme="default">{children}</div>;
}
