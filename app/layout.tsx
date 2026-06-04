import './globals.css';

export const metadata = {
  title: 'RiseWithData',
  description: 'Online education platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
