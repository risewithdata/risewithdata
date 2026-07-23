import './globals.css';
import { ToastProvider } from '@shared/ui/ToastProvider';
import { SupportWidget } from '@shared/ui/SupportWidget';
import Script from 'next/script';

export const metadata = {
  title: 'RiseWithData',
  description: 'Online education platform',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-S6B9DZRLTY" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S6B9DZRLTY');
        `}</Script>
      </head>
      <body>
        <ToastProvider>
          {children}
          <SupportWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
