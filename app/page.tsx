import HeroSlider from '@/components/home/HeroSlider';
import CategorySections from '@/components/home/CategorySections';
import { client } from '@/lib/sanity.client';
import { homeErasWithLeyendasQuery } from '@/lib/sanity.queries';

export const revalidate = 60; // Regenerate page every 60s max if data changes

export default async function HomePage() {
  const dynamicEras = await client.fetch(homeErasWithLeyendasQuery);

  return (
    <>
      {/* ── Hero: ocupa toda la pantalla inicial ──────────────── */}
      <HeroSlider />

      {/* ── Botones de categoría + secciones desplegables ─────── */}
      <CategorySections dynamicEras={dynamicEras} />
    </>
  );
}
