import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Tierras Sagradas — Mitología y Leyendas',
  description:
    'Portal enciclopédico de la mitología de Tierras Sagradas. Explora leyendas, biografías, tierras y más.',
  keywords: ['Tierras Sagradas', 'mitología', 'fantasía', 'leyendas', 'lore', 'wiki'],
  icons: {
    icon: '/images/demas/banner.webp',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body className="text-gray-300 font-crimson antialiased" style={{ backgroundColor: '#050505' }}>
        <Header />
        <main className="flex-grow relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
