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
<<<<<<< HEAD
      <body className="bg-obsidian text-gray-300 font-crimson antialiased">
        <Header />
        <main>{children}</main>
=======
      <body className="text-gray-300 font-crimson antialiased" style={{ backgroundColor: '#050505' }}>
        <Header />
        <main className="flex-grow relative z-10">{children}</main>
>>>>>>> ee44f1168bbae0bff31c4a1ebe3896f1800f2a84
        <Footer />
      </body>
    </html>
  );
}
