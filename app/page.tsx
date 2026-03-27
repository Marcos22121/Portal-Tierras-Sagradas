import HeroSlider from '@/components/home/HeroSlider';
import CategorySections from '@/components/home/CategorySections';

export default function HomePage() {
  return (
    <>
      {/* ── Hero: ocupa toda la pantalla inicial ──────────────── */}
      <HeroSlider />

      {/* ── Botones de categoría + secciones desplegables ─────── */}
      <CategorySections />
    </>
  );
}
