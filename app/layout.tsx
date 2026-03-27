import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Tierras Sagradas — Mitología y Leyendas',
  description:
    'Portal enciclopédico de la mitología de Tierras Sagradas. Explora leyendas, biografías, tierras y más.',
  keywords: ['Tierras Sagradas', 'mitología', 'fantasía', 'leyendas', 'lore', 'wiki'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head />
      <body className="bg-obsidian text-gray-300 font-crimson antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
