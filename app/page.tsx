import HeroSlider from '@/components/home/HeroSlider';
import CategorySections from '@/components/home/CategorySections';
import { client } from '@/lib/sanity.client';
import { homeErasWithLeyendasQuery, allBiographiesQuery, allMuseumItemsQuery, allLandsQuery } from '@/lib/sanity.queries';

export const revalidate = 60;

export default async function HomePage() {
  const [dynamicEras, biographies, museumItems, lands] = await Promise.all([
    client.fetch(homeErasWithLeyendasQuery),
    client.fetch(allBiographiesQuery),
    client.fetch(allMuseumItemsQuery),
    client.fetch(allLandsQuery),
  ]);

  return (
    <>
      {/* ── Hero: ocupa toda la pantalla inicial ──────────────── */}
      <HeroSlider />

      {/* ── Botones de categoría + secciones desplegables ─────── */}
      <CategorySections
        dynamicEras={dynamicEras}
        biographies={biographies}
        museumItems={museumItems}
        lands={lands}
      />
    </>
  );
}
