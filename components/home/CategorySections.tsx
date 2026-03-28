'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import MythicButton from '@/components/ui/MythicButton';
import CosmosBackground from '@/components/ui/CosmosBackground';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORÍAS PRINCIPALES — Editá este array para modificar las secciones.
// Cada objeto tiene: id (ancla), label (texto del botón) y content (JSX vacío por ahora).
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'leyendas',
    label: 'Leyendas',
    description: 'Los grandes mitos que dieron forma al mundo.',
  },
  {
    id: 'biografias',
    label: 'Biografías',
    description: 'Las historias de quienes marcaron la eternidad.',
  },
  {
    id: 'museo',
    label: 'Museo',
    description: 'Artefactos, reliquias y objetos de poder.',
  },
  {
    id: 'tierras',
    label: 'Tierras',
    description: 'Los reinos, continentes y lugares sagrados.',
  },
  {
    id: 'videojuegos',
    label: 'Videojuegos',
    description: 'Juegos ambientados en el universo Tierras Sagradas.',
  },
] as const;

export default function CategorySections({ dynamicEras = [] }: { dynamicEras?: any[] }) {
  const [active, setActive] = useState<string | null>('leyendas');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Escuchar cambios de ancla en la URL (desde el Header)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (SECTIONS.some(s => s.id === hash)) {
        setActive(hash);
        // Pequeño delay para asegurar que el DOM cargó el contenido de la sección
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Comprobar on mount por si entró directamente con un link tipo Misitio.com/#museo
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggle = (id: string) => {
    if (active === id) {
      setActive(null);
      // Limpiar el hash sin recargar la página
      window.history.pushState(null, '', window.location.pathname);
    } else {
      setActive(id);
      window.history.pushState(null, '', '#' + id);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <section className="relative" ref={sectionRef} id="categorias">
      {/* ── Línea ornamental superior ──────────────────────────── */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
        }}
      />

      {/* ── Barra de botones de categorías ───────────────────────
          Estos botones usan la misma clase .btn-mythic que el CTA del Hero.
          El diseño es: negro con bordes dorado-metálico gradiente, texto dorado.
      ─────────────────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap justify-center gap-4 px-6 py-10"
        style={{ background: 'var(--obsidian)' }}
      >
        {SECTIONS.map((sec) => {
          const isActive = active === sec.id;
          return (
            <MythicButton
              key={sec.id}
              onClick={() => toggle(sec.id)}
              className="min-w-[160px]"
              style={
                isActive
                  ? {
                      background: 'rgba(201,168,76,0.08)',
                      boxShadow: '0 0 16px rgba(255,215,0,0.2), inset 0 0 12px rgba(255,215,0,0.05)',
                    }
                  : {}
              }
            >
              {sec.label}
            </MythicButton>
          );
        })}
      </div>

      {/* ── Área de contenido desplegable ─────────────────────────
          Por ahora cada sección está vacía. Reemplazá el <p> dentro de
          <SectionContent> con el contenido real cuando esté listo.
      ─────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <SectionContent section={SECTIONS.find((s) => s.id === active)!} dynamicEras={dynamicEras} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── INFO DE ERAS (Mockup) ────────────────────────────────────────────────────
const ERAS_LORE = [
  {
    id: 'era-inicio',
    title: 'Era del Inicio',
    description: 'Los albores de la creación, cuando los dioses primigenios forjaron los cimientos de Tierras Sagradas.',
    imagePath: '/images/leyendas/era-inicio.jpg', // Ruta para que el usuario coloque imagen
    stories: [
      { 
        id: 'creacion', 
        title: 'El inicio de los tiempos', 
        description: 'El surgimiento del mundo a partir del caos primario a manos de la creación.',
        imagePath: '/images/leyendas/historias/creacion.png',
        content: [
          'Antes de que existiera el universo, antes de que exista la existencia misma, lo único que existía, era un ser. Este ser, el cuál fue eventualmente llamado por los mortales como "Binohmo", contenía en sí mismo, un poder inimaginable, un poder que le permitía torcer las reglas de la realidad, a su gusto, un poder que le permitía lo que sea, y Binohmo, decidió usar su poder, para crear el universo.',
          'Sin embargo, Binohmo no se sintió satisfecho solo con el universo, necesitaba como cualquier otro ser a venir, crear vida, y así fue como nació el primer mundo. Este mundo, junto con otros que creó, poseía de vida; los primeros hombres eran seres malévolos, que ejercían la violencia y la guerra entre ellos, peleaban por un poder mayor, sin preocuparse por deidades, ni por un poder mayor al de ellos, eran seres territoriales, primitivos y desconsiderados. Binohmo no podía intervenir, pues ya no era su responsabilidad crear sobre esas tierras.',
          'Pero Binohmo observaba. Aunque no podía moldear nuevamente aquello que ya había sido creado, su conciencia permanecía atada a la existencia misma. Desde más allá del tiempo y del espacio, presenció guerras que consumían continentes enteros, presenció la traición entre hermanos, y la caída de civilizaciones que jamás llegaron a comprender el don que les había sido otorgado. Los seres que creó no apreciaban la vida que él creó para ellos.',
          'Entre la violencia, entre la ambición y la destrucción, comenzaron a surgir excepciones. Seres que protegían a otros sin buscar recompensa. Guerreros que luchaban no por dominio, sino por deber. Líderes que rechazaban el poder absoluto para preservar a su pueblo.',
          'Binohmo no intervino, pero aprendió. Comprendió que la vida no necesitaba ser perfecta para tener valor. Solo necesitaba poder tomar una elección y fue entonces cuando decidió crear un nuevo mundo. Uno donde la voluntad, el honor y la gloria no serían imposiciones divinas, sino caminos que los mortales podrían elegir recorrer.',
          'Así nació el mundo donde una vez yacieron las Tierras Desconocidas.'
        ]
      },
      { 
        id: 'dioses', 
        title: 'El Despertar de los Divinos', 
        description: 'Los primeros seres inmortales que caminaron sobre la nueva tierra en formación.',
        imagePath: '/images/leyendas/historias/dioses.png',
        content: ['La historia de los Divinos todavía yace oculta en los pergaminos perdidos del tiempo...']
      }
    ]
  },
  {
    id: 'era-cisma',
    title: 'Era del Cisma',
    description: 'El gran quiebre. El mundo se dividió, las antiguas alianzas se rompieron y la magia fluyó libremente y sin control.',
    imagePath: '/images/leyendas/era-cisma.jpg',
    stories: [
      { 
        id: 'fractura', 
        title: 'La Gran Fractura', 
        description: 'El evento cataclísmico que destrozó el continente antiguo en mil pedazos de obsidiana.',
        imagePath: '/images/leyendas/historias/fractura.png',
        content: ['Un desastre sin proporciones dividió la tierra...']
      },
      { 
        id: 'caida-titanes', 
        title: 'Caída de los Titanes', 
        description: 'La trágica guerra que terminó con el poderoso linaje de los gigantes elementales.',
        imagePath: '/images/leyendas/historias/caida-titanes.png',
        content: ['Guerra, fuego y cenizas. Los titanes cayeron, dejando atrás montañas que no eran montañas reales, sino sus restos mortales...']
      }
    ]
  }
];

// ─── INFO DE BIOGRAFÍAS (Mockup) ──────────────────────────────────────────────
const BIOGRAFIAS_LORE = [
  {
    id: 'binohmo',
    name: 'Binohmo',
    shortDesc: 'El Creador y Observador',
    imagePath: '/images/biografias/binohmo.webp', // Vertical rectangle shape image
    biography: [
      'Antes de que existiera el universo, o la misma existencia, Binohmo era el único ser. Dotado de un poder inimaginable capaz de moldear la tela de la realidad, fue él quien dio vida a la primera creación y a múltiples mundos.',
      'A pesar de observar cómo sus primeras creaciones se dejaban llevar por el caos y la guerra primitiva sin un aprecio real por el don de la vida, Binohmo nunca intervino físicamente. Comprendió el inmenso valor del libre albedrío y los actos nobles voluntarios.',
      'Su sabiduría lo llevó a forjar un último mundo, las Tierras Desconocidas, basado en la premisa de que honor y gloria deben ser elegidos, jamás impuestos.'
    ],
    characteristics: [
      'Entidad suprema más antigua que el tiempo',
      'Poder omnipotente limitadamente autoimpuesto',
      'Inmortal e imperceptible a voluntad'
    ],
    weapon: {
      name: 'La Chispa Génesis',
      imagePath: '/images/armas/chispa.png', // 1:1 format
      description: 'No es un arma forjada por manos, sino la manifestación pura del poder de creación universal, capaz de encender galaxias.',
      link: '#'
    }
  },
  {
    id: 'lagh',
    name: 'LAGH',
    shortDesc: 'Emperador del Imperio del Lag',
    imagePath: '/images/biografias/LAGH.webp', // Vertical rectangle
    biography: [
      'Primer emperador en gobernar el enigmático Imperio del Lag y uno de sus principales fundadores. Demostrando una personalidad cínica y manipuladora, pero envuelto en un carisma indudable, Lagh lidera con una convicción de control férrea.',
      'Siente un amor absoluto por el orden, ya que considera firmemente que es la base innegociable del bienestar en la vida. Todo debe estar bajo su propio control, pues está absolutamente convencido de que él es el ente más "listo" y capacitado para hacerlo.',
      'Detesta la negativa; no suele aceptar un "No" como respuesta. Si se propone un objetivo, lucha, ingenia y avanza sin fin hasta conseguir lo que quiere, sin importarle en lo absoluto qué civilizaciones o personas deba arrasar por su camino.',
      'Está sumamente obsesionado con dominar la indomable "Magia del Lag". Esta oscura práctica fue bautizada así por él mismo tras descubrirla oculta en una cueva misteriosa. Desde entonces, ha pasado su tiempo estudiándola obsesivamente junto a la cúpula mágica de su ejército para masterizarla.'
    ],
    characteristics: [
      'De estatura muy alta y cuerpo grande. Físicamente posee un aspecto anciano, con larga barba gris y calvicie parcial',
      'No pelea físicamente por elección; prefiere abatir usando su intelecto, astucia y manipulación estratégica',
      'A pesar de su naturaleza estratégica, si debe luchar al frente, es uno de los guerreros más letales y fuertes conocidos en todo su Imperio'
    ],
    weapon: {
      name: 'Bastón Anímico del Lag',
      imagePath: '/images/armas/baston-lagh.webp', // 1:1 format (ruta inferida para tu uso futuro)
      description: 'Concebido por la cúpula mágica de su ejército, este bastón fue forjado y ajustado específicamente para conseguir una sincronización perfecta y letal con el alma, mentalidad y estilo de combate único del Emperador.',
      link: '#museo',
      museoId: 'baston-lagh'
    }
  },
  {
    id: 'mymp',
    name: 'MYMP',
    shortDesc: 'Guerrero de la Búsqueda Constante',
    imagePath: '/images/biografias/MYMP.webp',
    biography: [
      'Mymp es reconocido como uno de los guerreros principales de las Tierras Sagradas, una figura que, con el tiempo, se ha vuelto sinónimo de combate, determinación y búsqueda incesante.',
      'Su historia no se escribe sola; mantiene vínculos cercanos con Augrimm, Ignamund, Utared y Sigtrygrr, con quienes ha compartido enfrentamientos y recorridos a lo largo de las tierras. Su relación con ellos no solo se basa en la batalla, sino en una conexión forjada a través de las letales circunstancias que atravesaron juntos.',
      'Uno de los aspectos más distintivos de Mymp es su vínculo con las dobles espadas míticas del sol y la luna. Todo comenzó a partir de una visión inexplicable. A partir de ese momento, desarrolló una obsesión implacable que lo llevó a recorrer mares y territorios donde la magia misma alteraba las reglas de la realidad.',
      'A pesar de los combates en soledad y las extremas condiciones, jamás abandonó su objetivo. Aunque no está documentado cómo consiguió finalmente las espadas, el abrumador poder dual —solar y lunar— que libera cada uno de sus golpes es evidente para todo aquel que presencie su destreza en batalla.',
      'Fuera del combate, su personalidad se inclina puramente hacia la exploración, el viaje y el descubrimiento de nuevos horizontes, cazando monstruos con suprema precisión a su paso e impulsado por un destino aún en construcción.'
    ],
    characteristics: [
      'Cabello rubio oscuro, rostro sin barba y complexión atlética',
      'Porta una majestuosa armadura de tonos negros y dorados, fiel representante de la dualidad en la que combate',
      'Actitud exploradora constante guiada por misteriosas visiones divinas'
    ],
    weapon: {
      name: 'Espadas del Sol y la Luna',
      imagePath: '/images/armas/espadas-sol-luna.webp',
      description: 'Armas duales legendarias de la creación. Al ser empuñadas, cada golpe entrelaza energías místicas, quemando con el poder de una estrella y cortando ilusiones con la pureza lunar.',
      link: '#museo',
      museoId: 'espadas-sol-luna'
    },
    additionalArtifacts: [
      {
        name: 'Anillos Skefl',
        imagePath: '/images/armas/anillos-skefl.webp',
        description: 'Dos oscuros anillos místicamente ligados a las armas de Mymp. Permiten canalizar el lamento y comunicarse con las almas atrapadas (condenadas a eterno dolor) dentro de sus espadas duales.',
        link: '#museo',
        museoId: 'anillos-skefl'
      }
    ]
  }
];

// ─── INFO DEL MUSEO (Mockup) ──────────────────────────────────────────────────
const MUSEO_CATEGORIAS = [
  { id: 'armas', label: 'Armamento Sagrado' },
  { id: 'reliquias', label: 'Reliquias Arcanas' },
  { id: 'textos', label: 'Trazos Perdidos' },
  { id: 'gemas', label: 'Catalizadores' }
];

const MUSEO_LORE = [
  {
    id: 'baston-lagh',
    categoryId: 'armas',
    name: 'Bastón Anímico del Lag',
    imagePath: '/images/armas/baston-lagh.webp',
    description: [
      'Un bastón mágico excepcional, concebido y forjado específicamente por la cúpula mágica militar del Emperador Lagh. Su construcción requirió el sacrificio de incontables recursos y cristales de estabilidad espacial.',
      'A diferencia de las armas comunes, este bastón no emite magia por sí solo, sino que actúa como un conducto resonador extremo. Sincroniza la voluntad corrupta y dominante de su portador con las anomalías latentes del universo, permitiendo desatar la incomprensible "Magia del Lag".',
      'Las grabaciones arcanas antiguas advierten que quien intente empuñarlo sin la convicción inquebrantable y la sed de control absoluto que posee su dueño original, verá su propia mente y alma fracturadas instantáneamente por las enormes paradojas temporales que el arma emite de manera pasiva.'
    ],
    stats: [
      { label: 'Origen', value: 'Imperio del Lag' },
      { label: 'Rango', value: 'Artefacto Mítico' },
      { label: 'Estado', value: 'En posesión del Emperador' }
    ]
  },
  {
    id: 'espadas-sol-luna',
    categoryId: 'armas',
    name: 'Espadas del Sol y la Luna',
    imagePath: '/images/armas/espadas-sol-luna.webp',
    description: [
      'Poderosas hojas forjadas metafísicamente a través del choque de energías opuestas de la creación antigua. Según las leyendas ocultas, quien las porte se convierte en el avatar mismo de la dualidad cósmica.',
      'Cuando son empuñadas al unísono, son capaces de refractar y consumir cualquier tipo de energía elemental, devolviendo golpes potenciados formados por luz cegadora y sombras afiladas.'
    ],
    stats: [
      { label: 'Origen', value: 'Reinos del Eclipse' },
      { label: 'Rango', value: 'Armamento Divino' },
      { label: 'Estado', value: 'Empuñadas por Mymp' }
    ]
  },
  {
    id: 'anillos-skefl',
    categoryId: 'reliquias',
    name: 'Anillos Skefl',
    imagePath: '/images/armas/anillos-skefl.webp',
    description: [
      'Dos extraños anillos compuestos de un material oscuro. Son cálidos al tacto pero transmiten un sutil lamento directo al subconsciente de quien los ponga en sus dedos.',
      'Múltiples teóricos especulan que estos anillos son en realidad canales milenarios, diseñados originalmente no para portar magia, sino para encapsular almas condenadas al sufrimiento forzoso en sintonía con las armas del portador.'
    ],
    stats: [
      { label: 'Origen', value: 'Desconocido' },
      { label: 'Peligrosidad', value: 'Extrema (Condena Mental)' },
      { label: 'Estado', value: 'Uso Activo' }
    ]
  }
];

// ─── Placeholder de sección ───────────────────────────────────────────────────
function SectionContent({
  section,
  dynamicEras,
}: {
  section: (typeof SECTIONS)[number];
  dynamicEras: any[];
}) {
  const [openEra, setOpenEra] = useState<string | null>(null);
  // activeStory modal only used now if there's any fallback, but for Sanity articles we navigate using Link
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [activeBio, setActiveBio] = useState<typeof BIOGRAFIAS_LORE[0] | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<typeof MUSEO_LORE[0] | null>(null);
  const [museoActiveCategory, setMuseoActiveCategory] = useState<string>('armas');

  const toggleEra = (eraId: string) => {
    setOpenEra(prev => (prev === eraId ? null : eraId));
  };

  const handleOpenArtifact = (museoId: string) => {
    const artifact = MUSEO_LORE.find(a => a.id === museoId);
    if (artifact) {
      setActiveBio(null); // Cerrar la bio si estaba abierta
      setActiveArtifact(artifact);
    }
  };

  // Prevenir scroll cuando cualquier modal está abierto
  useEffect(() => {
    if (activeStory || activeBio || activeArtifact) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeStory, activeBio, activeArtifact]);

  return (
    <div
      id={section.id}
      className="relative px-6 md:px-16 lg:px-24 py-20 overflow-hidden"
      style={{
        background: 'var(--obsidian-surface)',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <CosmosBackground />

      {/* Decoración de esquinas */}
      <Corner pos="top-0 left-0 z-10 relative" />
      <Corner pos="top-0 right-0 z-10 relative" mirror />
      <Corner pos="bottom-0 left-0 z-10 relative" flipV />
      <Corner pos="bottom-0 right-0 z-10 relative" mirror flipV />

      <div className="max-w-[1600px] w-full mx-auto text-center relative z-10">
        {/* Título de la sección */}
        <h2
          className="font-cinzel text-3xl md:text-4xl font-bold mb-4 text-gold-gradient"
          style={{
            background: 'var(--gradient-gold)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {section.label}
        </h2>

        {/* Separador ornamental */}
        <div className="ornament-divider mb-8">
          <span style={{ color: 'var(--gold-dark)', fontSize: '0.7rem' }}>✦</span>
        </div>

        <p className="font-crimson text-lg mb-10 max-w-3xl mx-auto" style={{ color: 'rgba(208,200,180,0.6)' }}>
          {section.description}
        </p>

        {/* Contenido condicional: Leyendas (Dinámico), Videojuegos o Placeholder */}
        {section.id === 'leyendas' ? (
          <div className="flex flex-col gap-8 mt-12 w-full text-left">
            {dynamicEras.length > 0 ? dynamicEras.map((era: any) => {
              const isOpen = openEra === era._id;
              // Imagen de la categoría
              const eraBgUrl = era.coverImage ? urlForImage(era.coverImage)?.url() : '/images/ui/texture-dark.png';

              return (
                <div key={era._id} className="border border-[rgba(201,168,76,0.2)] rounded-sm overflow-hidden" style={{ background: 'rgba(5,5,5,0.6)', backdropFilter: 'blur(10px)' }}>
                  {/* Botón / Encabezado de la Era */}
                  <button 
                    onClick={() => toggleEra(era._id)}
                    className="w-full relative group cursor-pointer overflow-hidden min-h-[160px] flex items-center p-6 md:p-10 border-0 outline-none text-left"
                  >
                    {/* Imagen de fondo de la Era */}
                    <img src={eraBgUrl} alt={era.title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }}></div>
                    
                    <div className="relative z-10 flex flex-col items-start text-left w-full pr-16 md:w-2/3">
                      <span className="font-cinzel text-xs tracking-widest text-gold border border-gold-dark/30 px-2 py-1 mb-3 bg-black/50">ERA HISTÓRICA</span>
                      <h3 className="font-cinzel text-3xl md:text-5xl font-bold text-gold-light mb-3 drop-shadow-md">{era.title}</h3>
                      <p className="font-crimson text-gray-300 max-w-3xl text-lg opacity-90 leading-relaxed">{era.description || 'Sin descripción disponible.'}</p>
                    </div>

                    <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center border-2 border-gold-dark/40 rounded-full w-12 h-12 group-hover:border-gold-light group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all bg-black/60">
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="text-gold-light w-6 h-6" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Panel expansible de historias cronológicas */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="border-t border-[rgba(201,168,76,0.3)] bg-[#030303]/90"
                      >
                        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                          {/* Línea de tiempo decorativa (visual simple) */}
                          <div className="hidden md:block absolute left-4 md:left-8 top-10 bottom-10 w-px bg-gold-dark/20"></div>

                          {era.articles && era.articles.length > 0 ? era.articles.map((story: any) => {
                            const storyBgUrl = story.coverImage ? urlForImage(story.coverImage)?.url() : '/images/ui/texture-dark.png';
                            return (
                              <div key={story._id} className="border border-gold-dark/20 p-5 flex flex-col group hover:border-gold-dark/70 transition-colors relative bg-[#0a0a0a]/80">
                                {/* Imagen 1:1 de la historia */}
                                <div className="w-[65%] mx-auto aspect-square relative mb-6 overflow-hidden border border-gold-dark/20 bg-black/60 flex items-center justify-center rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
                                  <img 
                                    src={storyBgUrl} 
                                    alt={story.title} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                </div>

                                <h4 className="font-cinzel text-xl text-gold-light mb-3 group-hover:text-gold-bright transition-colors">{story.title}</h4>
                                <p className="font-crimson text-sm text-gray-400 mb-6 flex-grow">{story.excerpt || 'Haz clic para leer el relato de la historia.'}</p>
                                
                                <div className="mt-auto">
                                  <Link 
                                    href={`/articulos/${story.slug.current}`}
                                    className="inline-flex items-center gap-2 font-cinzel text-xs tracking-widest text-gold-muted group-hover:text-amber-400 hover:underline uppercase transition-colors"
                                  >
                                    <span>Leer Historia Completa</span>
                                    <span className="text-xl leading-none">→</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          }) : (
                            <div className="col-span-full border border-dashed border-gold-dark/20 p-6 opacity-60 text-center bg-black/40">
                              <span className="text-gold-dark text-3xl mb-2 inline-block">✦</span>
                              <p className="font-cinzel tracking-widest text-gold-muted uppercase text-sm mt-3 leading-relaxed">
                                Sin crónicas disponibles<br/>Nuevos descubrimientos esperan
                              </p>
                            </div>
                          )}
                          
                          {/* Tarjeta de "Placeholder" visual para más eras/historias */}
                          <div className="border border-dashed border-gold-dark/20 p-6 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-default bg-black/40">
                            <span className="text-gold-dark text-3xl mb-2">✦</span>
                            <p className="font-cinzel text-xs tracking-widest text-gold-muted uppercase text-center mt-2 leading-relaxed">
                              Nuevos pergaminos<br/>serán revelados<br/>pronto
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <div className="py-24 border border-dashed border-gold-dark/20 bg-black/40 flex flex-col items-center justify-center text-center">
                 <span className="text-gold-dark/50 text-5xl mb-4 inline-block drop-shadow-lg">✧</span>
                 <h3 className="font-cinzel text-2xl text-gold-muted uppercase tracking-widest mb-3">No hay eras descubiertas</h3>
                 <p className="font-crimson text-lg text-gray-500 max-w-lg">
                   Visita el panel de Sanity y añade "Categorías" para que aparezcan aquí como Eras Históricas.
                 </p>
              </div>
            )}
          </div>
        ) : section.id === 'videojuegos' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 text-left mt-10 max-w-[1500px] mx-auto px-4 md:px-0">
            {/* Juego 1 */}
            <div className="border-gold-gradient p-8 flex flex-col items-center" style={{ background: 'rgba(5, 5, 5, 0.4)', backdropFilter: 'blur(4px)' }}>
              <div 
                className="w-full relative flex items-center justify-center overflow-hidden mb-6"
                style={{ aspectRatio: '630/500', background: 'rgba(10, 10, 10, 0.5)', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                {/* La etiqueta img está lista, fallará silenciosamente si la imagen no existe pero es válido */}
                <img src="/images/videojuegos/el-senor-del-reino.png" alt="El Señor Del Reino" className="absolute inset-0 w-full h-full object-cover z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>

              <h3 className="font-cinzel text-2xl font-bold mb-3 text-center" style={{ color: 'var(--gold-light)' }}>
                Tierras Sagradas: El Señor Del Reino
              </h3>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Decisiones', 'Elige tu camino', 'Mejoras', 'Narrativo'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-cinzel tracking-widest uppercase" style={{ border: '1px solid rgba(139, 105, 20, 0.3)', color: 'var(--gold-muted)', background: 'rgba(0,0,0,0.5)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-crimson flex-grow text-gray-400 text-center mb-8 max-w-[600px] text-lg">
                Toma el control y forja el destino de tu propio reino. Tus decisiones alterarán el curso de la historia en las Tierras Sagradas.
              </p>

              <div className="mt-auto">
                <MythicButton href="/videojuegos/el-senor-del-reino">
                  Visitar página
                </MythicButton>
              </div>
            </div>

            {/* Juego 2 */}
            <div className="border-gold-gradient p-8 flex flex-col items-center" style={{ background: 'rgba(5, 5, 5, 0.4)', backdropFilter: 'blur(4px)' }}>
              <div 
                className="w-full relative flex items-center justify-center overflow-hidden mb-6"
                style={{ aspectRatio: '630/500', background: 'rgba(10, 10, 10, 0.5)', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                <img src="/images/videojuegos/peak-of-binohmo-sword.png" alt="Peak of Binohmo Sword" className="absolute inset-0 w-full h-full object-cover z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>

              <h3 className="font-cinzel text-2xl font-bold mb-3 text-center" style={{ color: 'var(--gold-light)' }}>
                Peak of Binohmo Sword
              </h3>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Clicker', 'Incremental', 'Forja', 'Minerales'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-cinzel tracking-widest uppercase" style={{ border: '1px solid rgba(139, 105, 20, 0.3)', color: 'var(--gold-muted)', background: 'rgba(0,0,0,0.5)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-crimson flex-grow text-gray-400 text-center mb-8 max-w-[600px] text-lg">
                Forja la espada legendaria definitiva. Recolecta minerales raros, mejora tu yunque y asciende al pico del poder.
              </p>

              <div className="mt-auto">
                <MythicButton href="/videojuegos/peak-of-binohmo-sword">
                  Visitar página
                </MythicButton>
              </div>
            </div>
          </div>
        ) : section.id === 'biografias' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10 w-full max-w-[1500px] mx-auto text-left">
            {BIOGRAFIAS_LORE.map((bio) => (
              <button 
                key={bio.id} 
                onClick={() => setActiveBio(bio)}
                className="group relative flex flex-col items-center border border-[rgba(201,168,76,0.2)] rounded-sm overflow-hidden text-center hover:border-gold-dark/60 transition-all duration-300 w-full hover:-translate-y-1 shadow-[0_5px_15px_rgba(0,0,0,0.5)] outline-none"
                style={{ background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(5px)' }}
              >
                {/* Imagen vertical portrait del personaje */}
                <div className="w-full relative aspect-[3/4] overflow-hidden bg-black/80 flex items-center justify-center border-b border-[rgba(201,168,76,0.15)]">
                  <img 
                    src={bio.imagePath} 
                    alt={bio.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  />
                  {/* Icono de backup */}
                  <span className="text-gold-dark/20 text-6xl absolute z-[-1]">✧</span>
                  
                  {/* Vignette interior oscurecido en los bordes */}
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] z-10 pointer-events-none"></div>
                </div>
                
                {/* Decoración inferior */}
                <div className="w-full pt-6 pb-8 px-4 flex flex-col items-center flex-grow relative z-20">
                  <span className="font-crimson text-xs italic text-gray-400 mb-2 tracking-widest uppercase">{bio.shortDesc}</span>
                  
                  {/* Nombre con efecto dorado animado igual que el logo */}
                  <h3 
                    className="font-cinzel text-xl md:text-2xl font-bold tracking-[0.1em] uppercase text-gold-gradient group-hover:scale-105 transition-transform"
                    style={{
                      background: 'var(--gradient-gold)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 20px rgba(201,168,76,0.3)'
                    }}
                  >
                    {bio.name}
                  </h3>
                  
                  <div className="mt-5 text-gold-dark text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block border-b border-gold-dark pb-1 text-gold-light tracking-widest font-cinzel">Examinar Registro</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : section.id === 'museo' ? (
          <div className="flex flex-col mt-10 w-full max-w-[1500px] mx-auto text-left relative z-20">
            {/* Categorías del Museo en Navbar Fachera (Diseño Premium Mitológico) */}
            <div className="flex justify-center mb-14 relative w-full">
              {/* Línea decorativa de fondo cruzando todo el menú */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-dark/30 to-transparent -translate-y-1/2 z-0"></div>
              
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 relative z-10 px-4">
                {MUSEO_CATEGORIAS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setMuseoActiveCategory(cat.id)}
                    className={`relative group px-6 py-3 border overflow-hidden transition-all duration-300 ${
                      museoActiveCategory === cat.id 
                        ? 'border-gold-light bg-gold-dark/10 shadow-[0_0_15px_rgba(201,168,76,0.3)]' 
                        : 'border-[rgba(201,168,76,0.2)] bg-black/80 hover:border-gold-dark/60'
                    }`}
                  >
                    {/* Brillo dinámico de fondo cuando está activo */}
                    {museoActiveCategory === cat.id && (
                      <motion.div 
                        layoutId="museoNavPremiumGlow" 
                        className="absolute inset-0 bg-gradient-radial from-gold-light/20 to-transparent opacity-70"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Efecto hover */}
                    <div className="absolute inset-0 bg-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Texto del botón */}
                    <span className={`relative z-10 font-cinzel text-xs md:text-sm tracking-[0.25em] font-bold uppercase transition-colors ${
                      museoActiveCategory === cat.id ? 'text-gold-light drop-shadow-md' : 'text-gray-400 group-hover:text-gold-muted'
                    }`}>
                      {cat.label}
                    </span>
                    
                    {/* Adornos en esquinas */}
                    <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gold-dark/40 opacity-50"></span>
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gold-dark/40 opacity-50"></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cuadricula de artefactos 1:1 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={museoActiveCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10 pb-10"
              >
                {MUSEO_LORE.filter(a => a.categoryId === museoActiveCategory).length > 0 ? (
                  MUSEO_LORE.filter(a => a.categoryId === museoActiveCategory).map(artifact => (
                    <button
                      key={artifact.id}
                      onClick={() => setActiveArtifact(artifact)}
                      className="group relative flex flex-col items-center bg-[#070707] border border-[rgba(201,168,76,0.15)] hover:border-gold-light/60 rounded-sm overflow-hidden text-center transition-all duration-300 w-full hover:-translate-y-2 shadow-[0_8px_20px_rgba(0,0,0,0.8)] outline-none"
                    >
                      {/* Contenedor de Imagen 1:1 Perfecto */}
                      <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center p-6 bg-black">
                        {/* Glow de fondo reacciona al hover */}
                        <div className="absolute inset-0 bg-gradient-radial from-gold-dark/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <img 
                          src={artifact.imagePath} 
                          alt={artifact.name} 
                          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(201,168,76,0.1)] group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all duration-500"
                          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML += '<span class="text-gold-dark/40 text-5xl absolute z-0 mb-4">✦</span>'; }}
                        />
                        
                        {/* Pequeña textura estática por encima para simular cristal gastado */}
                        <div className="absolute inset-0 bg-[url('/images/ui/texture-dark.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                      </div>
                      
                      {/* Name tag */}
                      <div className="w-full p-4 relative h-20 flex flex-col items-center justify-center border-t border-[rgba(201,168,76,0.2)]">
                        <span className="font-cinzel text-xs md:text-sm font-bold text-gold-muted group-hover:text-gold-light transition-colors uppercase tracking-widest text-balance drop-shadow-md">
                          {artifact.name}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-gold-dark/20 bg-black/40">
                    <span className="text-gold-dark/50 text-5xl mb-4 text-shadow-md">✧</span>
                    <p className="font-cinzel text-sm tracking-widest text-gold-muted/80 uppercase text-center max-w-md leading-relaxed">
                      El pasillo de esta categoría<br/>aún yace vacío...
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 gap-3"
            style={{
              border: '1px dashed rgba(201,168,76,0.15)',
              borderRadius: '2px',
            }}
          >
            <span style={{ color: 'var(--gold-dark)', fontSize: '2rem' }}>✦</span>
            <p className="font-cinzel text-sm tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.3)' }}>
              Contenido próximamente
            </p>
          </div>
        )}
      </div>

      {/* ─── MODAL DE HISTORIA EPICA ─── */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 md:p-10 pt-[90px] md:pt-[100px] lg:p-16 lg:pt-[110px] bg-black/80 backdrop-blur-sm"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl h-auto max-h-[90vh] md:max-h-[85vh] flex flex-col border border-gold-dark/40 rounded-sm overflow-hidden bg-obsidian shadow-2xl"
              style={{ boxShadow: '0 0 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(201,168,76,0.05)' }}
            >
              {/* Gold gradient Line top */}
              <div className="h-1 w-full flex-shrink-0 bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

              {/* Botón Cerrar Flotante */}
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-gold-muted hover:text-gold-light p-2 rounded-full border border-gold-dark/30 transition-all cursor-pointer group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Encabezado fijo */}
              <div className="p-8 md:p-12 pb-6 flex flex-col border-b border-gold-dark/20 relative overflow-hidden shrink-0 bg-[#0a0a0a]">
                {/* Imagen/Textura difuminada de fondo del header */}
                <div 
                  className="absolute inset-0 opacity-10 blur-xl scale-125 z-0" 
                  style={{ backgroundImage: `url(${activeStory.era.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
                />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="font-cinzel text-xs tracking-widest text-gold-muted uppercase mb-3 px-3 py-1 border border-gold-dark/20 bg-black/40">
                    {activeStory.era.title}
                  </span>
                  <h2 className="font-cinzel text-2xl md:text-5xl font-bold text-gold-light tracking-wide text-balance drop-shadow-md">
                    {activeStory.story.title}
                  </h2>
                </div>
              </div>

              {/* Área de texto scrolleable */}
              <div className="p-6 sm:p-8 md:p-12 md:px-16 overflow-y-auto overflow-x-hidden flex-grow scrollbar-thin scrollbar-thumb-gold-dark/30 scrollbar-track-transparent h-auto max-h-full">
                <div className="max-w-3xl mx-auto space-y-6 pb-6">
                  {/* Letra Capitular (drop cap) automatizada en el primer párrafo si hay contenido */}
                  {activeStory.story.content.length > 0 && (
                    <div className="font-crimson text-lg md:text-xl text-gray-300 leading-relaxed drop-shadow-sm text-justify">
                      <span className="float-left font-cinzel text-6xl md:text-7xl font-bold text-gold-light -mt-2 mr-3 pr-1 pt-2 h-[1em]" style={{ textShadow: '0 0 15px rgba(201,168,76,0.3)', lineHeight: '0.8' }}>
                        {activeStory.story.content[0].charAt(0)}
                      </span>
                      {activeStory.story.content[0].slice(1)}
                    </div>
                  )}

                  {/* Resto de párrafos */}
                  {activeStory.story.content.slice(1).map((paragraph: string, idx: number) => (
                    <p key={idx} className="font-crimson text-lg md:text-xl text-gray-300 leading-relaxed drop-shadow-sm text-justify">
                      {paragraph}
                    </p>
                  ))}

                  <div className="pt-12 pb-4 flex justify-center">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent opacity-60" />
                    <span className="text-gold-dark text-lg px-4 leading-[0]">❖</span>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent opacity-60" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL DE BIOGRAFÍAS (PANEL HORIZONTAL DOBLE) ─── */}
      <AnimatePresence>
        {activeBio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-[90px] md:pt-[100px] lg:p-12 lg:pt-[110px] bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[1200px] h-auto max-h-[90vh] md:h-[85vh] flex flex-col md:flex-row border border-gold-dark/40 rounded-sm overflow-hidden bg-[#050505] shadow-[0_0_80px_rgba(0,0,0,0.9)]"
            >
              {/* Botón Cerrar Flotante */}
              <button
                onClick={() => setActiveBio(null)}
                className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black/90 text-gold-muted hover:text-gold-light p-2 rounded-full border border-gold-dark/30 transition-all cursor-pointer group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* IZQUIERDA: Imágen gigante del personaje */}
              <div className="w-full h-64 md:w-[40%] lg:w-[45%] md:h-full relative overflow-hidden bg-black/80 flex-shrink-0 border-b md:border-b-0 md:border-r border-[rgba(201,168,76,0.15)] flex items-center justify-center">
                <img 
                  src={activeBio.imagePath} 
                  alt={activeBio.name} 
                  className="absolute inset-0 w-full h-full object-cover lg:object-top opacity-80" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                />
                {/* Degradados oscuros sobre la imagen para fundir */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-r" />
                <span className="text-gold-dark/10 text-9xl absolute z-[-1]">✧</span>
              </div>

              {/* DERECHA: Contenido (Biografía completa dividida en subsecciones) */}
              <div className="w-full md:w-[60%] lg:w-[55%] h-auto md:h-full max-h-[60vh] md:max-h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gold-dark/30 scrollbar-track-transparent">
                <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col items-start text-left min-h-full pb-10 md:pb-16">
                  
                  {/* Título Principal */}
                  <span className="font-crimson italic text-gray-400 mb-1 lg:text-lg tracking-widest uppercase">{activeBio.shortDesc}</span>
                  <h2 
                    className="font-cinzel text-4xl lg:text-6xl font-bold tracking-[0.1em] uppercase text-gold-gradient mb-10 pb-6 border-b border-gold-dark/20 w-full"
                    style={{
                      background: 'var(--gradient-gold)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {activeBio.name}
                  </h2>

                  {/* Sección: Biografía */}
                  <h4 className="font-cinzel text-xl text-gold-light mb-4 flex items-center gap-3">
                    <span className="text-gold-dark text-sm">✦</span> Biografía
                  </h4>
                  <div className="space-y-4 mb-10 text-gray-300 font-crimson text-lg leading-relaxed text-justify opacity-90">
                    {activeBio.biography.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Sección: Características */}
                  <h4 className="font-cinzel text-xl text-gold-light mb-4 flex items-center gap-3">
                    <span className="text-gold-dark text-sm">✦</span> Características
                  </h4>
                  <ul className="mb-12 font-crimson text-gray-300 text-lg space-y-3 pl-4 opacity-90">
                    {activeBio.characteristics.map((char, idx) => (
                      <li key={idx} className="relative">
                        <span className="absolute -left-4 text-gold-dark">·</span> {char}
                      </li>
                    ))}
                  </ul>

                  {/* Sección especial: Armamento y Artefactos */}
                  <div className="mt-4 pt-8 w-full border-t border-gold-dark/20">
                    <h4 className="font-cinzel text-xl text-gold-light mb-6 flex items-center gap-3">
                      <span className="text-gold-dark text-sm">✦</span> Armamento y Artefactos Ligados
                    </h4>

                    <div className="flex flex-col gap-6 w-full">
                      {[activeBio.weapon, ...((activeBio as any).additionalArtifacts || [])].filter(Boolean).map((artItem, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-6 items-start bg-black/40 border border-[rgba(201,168,76,0.1)] p-6 rounded-sm w-full">
                          {/* Imágen del arma 1:1 */}
                          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 aspect-square border border-gold-dark/20 rounded shadow-md overflow-hidden flex items-center justify-center bg-black/60">
                            <img 
                              src={artItem.imagePath} 
                              alt={artItem.name} 
                              className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-110"
                              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML += '<span class="text-gold-dark/40 text-sm font-cinzel text-center leading-tight absolute">Mito<br/>Perdido</span>'; }}
                            />
                          </div>

                          {/* Textos del arma */}
                          <div className="flex flex-col flex-grow items-start h-full">
                            <h5 className="font-cinzel text-lg text-gold-light mb-2">{artItem.name}</h5>
                            <p className="font-crimson text-sm text-gray-400 mb-4">{artItem.description}</p>
                            
                            {/* Enlace o Botón para abrir Artefacto */}
                            {artItem.museoId ? (
                               <button
                                 onClick={() => handleOpenArtifact(artItem.museoId)}
                                 className="inline-flex mt-auto border-b border-gold-dark/40 text-gold-muted hover:text-gold-light hover:border-gold-light pb-0.5 font-cinzel text-[11px] font-bold tracking-[0.2em] uppercase transition-all"
                               >
                                 Investigar artefacto →
                               </button>
                            ) : (
                               <a 
                                 href={artItem.link}
                                 className="inline-flex mt-auto border-b border-gold-dark/40 text-gold-muted hover:text-gold-light hover:border-gold-light pb-0.5 font-cinzel text-[11px] font-bold tracking-[0.2em] uppercase transition-all"
                               >
                                 Investigar artefacto →
                               </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MODAL DE MUSEO (ARTEFACTOS) ─── */}
      <AnimatePresence>
        {activeArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 md:p-8 pt-[90px] md:pt-[100px] lg:p-12 lg:pt-[110px] bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[1100px] h-auto max-h-[90vh] md:h-[80vh] flex flex-col md:flex-row border border-gold-light/20 rounded-sm overflow-hidden bg-[#070707] shadow-[0_0_120px_rgba(201,168,76,0.15)] ring-1 ring-gold-dark/30 mt-16 md:mt-0"
            >
              {/* Línea dorada superior */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-light to-transparent opacity-80 z-20" />

              {/* Botón Cerrar Flotante */}
              <button
                onClick={() => setActiveArtifact(null)}
                className="absolute top-4 right-4 z-50 bg-black/80 hover:bg-black text-gold-muted hover:text-gold-light p-2 rounded-full border border-gold-dark/30 transition-all cursor-pointer group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* IZQUIERDA: Imágen 1:1 del artefacto (Con manejo correcto de flex para no romper el layout) */}
              <div className="w-full h-56 md:w-[45%] md:h-full relative overflow-hidden bg-[#030303] flex-shrink-0 border-b md:border-b-0 md:border-r border-[rgba(201,168,76,0.1)] flex items-center justify-center p-6 md:p-14">
                <div className="absolute inset-0 bg-gradient-radial from-gold-dark/15 to-transparent"></div>
                <img 
                  src={activeArtifact.imagePath} 
                  alt={activeArtifact.name} 
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(201,168,76,0.3)] animate-pulse-slow" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML += '<span class="text-gold-dark/30 text-[6rem] md:text-[10rem] absolute drop-shadow-2xl">✦</span>'; }} 
                />
              </div>

              {/* DERECHA: Datos del artefacto (Con barra de scroll forzada) */}
              <div className="w-full md:w-[55%] h-auto md:h-full max-h-[60vh] md:max-h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gold-light/20 scrollbar-track-transparent">
                <div className="p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col items-start text-left relative min-h-full">
                  
                  {/* Etiqueta Categoría */}
                  <span className="font-cinzel text-xs tracking-widest text-gold-light px-3 py-1 bg-gold-dark/20 border border-gold-dark/40 uppercase mb-4 shadow-[0_0_10px_rgba(201,168,76,0.2)]">
                    {MUSEO_CATEGORIAS.find(c => c.id === activeArtifact.categoryId)?.label || 'Artefacto'}
                  </span>
                  
                  <h2 className="font-cinzel text-2xl lg:text-4xl xl:text-5xl font-bold tracking-wider text-gold-light mb-6 drop-shadow-md leading-tight">
                    {activeArtifact.name}
                  </h2>

                  {/* Estadísticas */}
                  {activeArtifact.stats && activeArtifact.stats.length > 0 && (
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 mb-8 bg-black/50 p-6 border border-gold-dark/20 rounded-sm">
                      {activeArtifact.stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="font-cinzel text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</span>
                          <span className="font-crimson text-gold-muted text-base sm:text-lg">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Descripción / Registros */}
                  <h4 className="font-cinzel text-lg text-gold-dark mb-4 flex items-center gap-3">
                    <span className="text-gold-dark/50 text-sm">✦</span> Registros del Artefacto
                  </h4>
                  <div className="space-y-4 mb-8 text-gray-300 font-crimson text-base md:text-lg leading-relaxed text-justify opacity-90 pb-8">
                    {activeArtifact.description.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>

                  {/* Footer del texto (empujado hacia abajo usando mt-auto si la pantalla es alta) */}
                  <div className="mt-auto pt-6 flex justify-center w-full opacity-60 border-t border-gold-dark/10">
                    <span className="text-gold-dark text-xs sm:text-sm tracking-[0.5em]">✧ ✦ ✧</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Decoración de esquinas ────────────────────────────────────────────────────
function Corner({
  pos,
  mirror = false,
  flipV = false,
}: {
  pos: string;
  mirror?: boolean;
  flipV?: boolean;
}) {
  return (
    <span
      className={`absolute ${pos} w-8 h-8`}
      style={{
        borderTop: flipV ? 'none' : '1px solid var(--gold-dark)',
        borderBottom: flipV ? '1px solid var(--gold-dark)' : 'none',
        borderLeft: mirror ? 'none' : '1px solid var(--gold-dark)',
        borderRight: mirror ? '1px solid var(--gold-dark)' : 'none',
        opacity: 0.6,
      }}
    />
  );
}
