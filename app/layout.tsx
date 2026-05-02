import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semiárido Vivo — Curadoria de Notícias',
  description: 'Dashboard de curadoria de notícias do Semiárido brasileiro.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/rjs6bjw.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
