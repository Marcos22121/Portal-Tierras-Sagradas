'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── TIPOS ──────────────────────────────────────────────────────────────────────
type MainSectionId = 'descubre' | 'wiki' | 'trascendencias' | 'condensadora' | 'detras';
type WikiSubId =
  | 'minerales' | 'minerales-miticos'
  | 'armas-t1' | 'armas-t2' | 'armas-t3' | 'armas-miticas'
  | 'upgrades' | 'habilidades' | 'gemas' | 'pergaminos';

interface WikiLevel { level: number; dmg: number; cost: string; }
interface WikiItem { id: string; name: string; imagePath: string; rarity: string; description: string; stat?: string; unlock?: string; levels?: WikiLevel[]; }
interface WikiSub { id: WikiSubId; label: string; icon: string; items: WikiItem[]; }

// ─── DATOS DE NAVEGACIÓN PRINCIPAL ──────────────────────────────────────────────
const MAIN_SECTIONS: { id: MainSectionId; label: string; rune: string; subtitle: string }[] = [
  { id: 'descubre', label: 'Descubre', rune: '◉', subtitle: 'El Juego' },
  { id: 'wiki', label: 'Wiki', rune: '✦', subtitle: 'Compendio' },
  { id: 'trascendencias', label: 'Trascendencias', rune: '◈', subtitle: 'El Sistema' },
  { id: 'condensadora', label: 'Condensadora', rune: '◎', subtitle: 'Mecánica' },
  { id: 'detras', label: 'Detrás de la Forja', rune: '⚒', subtitle: 'Dev' },
];

// ─── DATOS WIKI ──────────────────────────────────────────────────────────────────
const WIKI_SUBSECTIONS: WikiSub[] = [
  {
    id: 'minerales', label: 'Minerales', icon: '◈', items: [
      // ─ Tier 1 ─
      { id: 'piedra', name: 'Piedra', imagePath: '/images/pobs/Piedra.webp', rarity: 'Tier 1', description: 'La roca más primitiva de las Tierras. El primer mineral que todo forjador aprende a romper.', stat: 'Vida: 12 | Valor: 60 | Peso: 400' },
      { id: 'cobre', name: 'Cobre', imagePath: '/images/pobs/Cobre.webp', rarity: 'Tier 1', description: 'Conductor natural de energía mineral. Abunda en los estratos superficiales de las Minas Doradas.', stat: 'Vida: 22 | Valor: 55 | Peso: 200' },
      { id: 'estano', name: 'Estaño', imagePath: '/images/pobs/Estano.webp', rarity: 'Tier 1', description: 'Mineral dúctil que se funde con facilidad. Esencial para avanzar del Pico Oxidado al Pico Reforzado.', stat: 'Vida: 35 | Valor: 50 | Peso: 100' },
      { id: 'hierro', name: 'Hierro', imagePath: '/images/pobs/Hierro.webp', rarity: 'Tier 1', description: 'Pilar de toda forja. Se requiere en cantidades masivas para las armas más avanzadas.', stat: 'Vida: 60 | Valor: 20 | Peso: 300' },
      { id: 'plata', name: 'Plata', imagePath: '/images/pobs/Plata.webp', rarity: 'Tier 1', description: 'Mineral de mayor brillo que el hierro. Se desbloquea al alcanzar el Martillo Reforzado.', stat: 'Vida: 110 | Valor: 16 | Peso: 150' },
      { id: 'oro', name: 'Oro', imagePath: '/images/pobs/Oro.webp', rarity: 'Tier 1', description: 'El mineral más preciado del Tier 1. Se desbloquea al dominar el Geólogo Reforzado.', stat: 'Vida: 170 | Valor: 9 | Peso: 115' },
      // ─ Tier 2 ─
      { id: 'esmeralda', name: 'Esmeralda', imagePath: '/images/pobs/Esmeralda.webp', rarity: 'Tier 2', description: 'Cristal verde de las profundidades de La Costa de las Almas.', stat: 'Vida: 300 | Valor: 2 | Peso: 60' },
      { id: 'diamante', name: 'Diamante', imagePath: '/images/pobs/Diamante.webp', rarity: 'Tier 2', description: 'El mineral más duro entre los comunes. Su extracción requiere armas Tier 2.', stat: 'Vida: 450 | Valor: 1 | Peso: 30' },
      { id: 'stellar-saphirus', name: 'Stellar Saphirus', imagePath: '/images/pobs/Saphirus.webp', rarity: 'Tier 2', description: 'Zafiro estelar que emite una tenue luz azulada. Clave para las mazas encantadas.', stat: 'Vida: 650 | Valor: 0.5 | Peso: 20' },
      { id: 'crimson-obsidian', name: 'Crimson Obsidian', imagePath: '/images/pobs/Crimson_Obsidian.webp', rarity: 'Tier 2', description: 'Obsidiana carmesí de temperatura extrema. Se usa en guanteletes y mazas de sangre.', stat: 'Vida: 1000 | Valor: 0.25 | Peso: 10' },
      { id: 'mithrill', name: 'Mithrill', imagePath: '/images/pobs/Mithrill.webp', rarity: 'Tier 2', description: 'Metal plateado de ligereza mágica. Su extracción marca el punto de no retorno en el Tier 2.', stat: 'Vida: 1700 | Valor: 0.15 | Peso: 5' },
      { id: 'blood-corundom', name: 'Blood Corundom', imagePath: '/images/pobs/Blood_Corundom.webp', rarity: 'Tier 2', description: 'El mineral más temido del Tier 2. Sus vetas parecen latir con sangre.', stat: 'Vida: 4000 | Valor: 0.05 | Peso: 3.5' },
      // ─ Tier 3 ─
      { id: 'adamantio', name: 'Adamantio', imagePath: '/images/pobs/Adamantio.webp', rarity: 'Tier 3', description: 'El primer mineral de Volkagh. Resistencia inigualable a cualquier forma de daño.', stat: 'Vida: 8K | Valor: 0.02 | Peso: 80' },
      { id: 'oricalco', name: 'Oricalco', imagePath: '/images/pobs/Oricalco.webp', rarity: 'Tier 3', description: 'Mineral legendario vinculado a la magia élfica. Exige armas de Tier 3 iniciales.', stat: 'Vida: 15K | Valor: 0.01 | Peso: 40' },
      { id: 'paladio', name: 'Paladio', imagePath: '/images/pobs/Paladio.webp', rarity: 'Tier 3', description: 'Mineral brillante y resistente. Base de las lanzas y guadañas del alto Tier 3.', stat: 'Vida: 25K | Valor: 0.0075 | Peso: 20' },
      { id: 'titanio', name: 'Titanio', imagePath: '/images/pobs/Titanio.webp', rarity: 'Tier 3', description: 'Ligereza extrema unida a una dureza devastadora. Forja guadañas y báculos.', stat: 'Vida: 40K | Valor: 0.005 | Peso: 10' },
      { id: 'ferrolumbre-min', name: 'Ferrolumbre', imagePath: '/images/pobs/Ferrolumbre.webp', rarity: 'Tier 3', description: 'El mineral bisagra del Tier 3. Su sola presencia altera campos magnéticos.', stat: 'Vida: 70K | Valor: 0.0025 | Peso: 5' },
      { id: 'neodimio', name: 'Neodimio', imagePath: '/images/pobs/Neodimio.webp', rarity: 'Tier 3', description: 'Mineral de origen estelar con propiedades magnéticas únicas.', stat: 'Vida: 120K | Valor: 0.0025 | Peso: 5' },
      { id: 'iridio', name: 'Iridio', imagePath: '/images/pobs/Iridio.webp', rarity: 'Tier 3', description: 'Casi indestructible. Su extracción requiere dominar la mitad del Tier 3.', stat: 'Vida: 200K | Valor: 0.0015 | Peso: 5' },
      { id: 'neutronio', name: 'Neutronio', imagePath: '/images/pobs/Neutronio.webp', rarity: 'Tier 3', description: 'Un mineral que desafía la física. Solo los forjadores de nivel máximo pueden usarlo.', stat: 'Vida: 350K | Valor: 0.00075 | Peso: 3.5' },
      { id: 'fragmento-infinito', name: 'Fragmento del Infinito', imagePath: '/images/pobs/FragInf.webp', rarity: 'Tier 3', description: 'El mineral más raro de toda la creación. Un fragmento del origen del universo hecho materia.', stat: 'Vida: 600K | Valor: 0.000375 | Peso: 3' },
    ]
  },
  {
    id: 'minerales-miticos', label: 'Minerales Míticos', icon: '❋', items: [
      { id: 'aethergald', name: 'Aethergald', imagePath: '/images/pobs/Aethergald.webp', rarity: 'Mineral Mítico', description: 'El mineral del alba eterna. Requerido para forjar Luz de Eos en la Forja Divina. Surge al desbloquear el Arma 27.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'draconium', name: 'Draconium', imagePath: '/images/pobs/Draconium.webp', rarity: 'Mineral Mítico', description: 'Escama cristalizada de un dragón cósmico antiguo. Necesario para el Slayer de Draconio.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'ethercrystal', name: 'EtherCrystal', imagePath: '/images/pobs/EtherCrystal.webp', rarity: 'Mineral Mítico', description: 'Cristal de éter puro nacido del vacío. Componente clave del Abismo de Zoth.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'historycrystal', name: 'HistoryCrystal', imagePath: '/images/pobs/HistoryCrystal.webp', rarity: 'Mineral Mítico', description: 'Un mineral que contiene la memoria de todos los tiempos. Requerido por Ecos del Tiempo.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'kingstone', name: 'KingStone', imagePath: '/images/pobs/KingStone.webp', rarity: 'Mineral Mítico', description: 'Piedra del trono del último rey caído. Componente de la Soberanía del Rey Caído.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'magnamite', name: 'Magnamite', imagePath: '/images/pobs/Magnamite.webp', rarity: 'Mineral Mítico', description: 'Fragmento de la primera fractura tectónica del mundo. Necesario para el Cisma Tectónico.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'orionite', name: 'Orionite', imagePath: '/images/pobs/Orionite.webp', rarity: 'Mineral Mítico', description: 'Roca interestelar caída de la constelación de Orión. Forja el caza-constelaciones.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'quasarite', name: 'Quasarite', imagePath: '/images/pobs/Quasarite.webp', rarity: 'Mineral Mítico', description: 'Residuo sólido de un cuasar colapsado. Componente de Fisión del Sol Negro.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'stellarobsidian', name: 'StellarObsidian', imagePath: '/images/pobs/StellarObsidian.webp', rarity: 'Mineral Mítico', description: 'Obsidiana nacida en el corazón de una estrella muerta. Requisito del Eclipse Final.', stat: 'Vida: 33.5M | Valor: 0.0001 | Peso: 0' },
      { id: 'binohmo', name: 'Binohmo', imagePath: '/images/pobs/Binohmo.webp', rarity: 'Mineral Mítico', description: 'El mineral definitivo. Solo se obtiene al romper al propio Binohmo en el combate final del origen. Con él se forja la Espada Legendaria.', stat: 'Vida: 55M | Valor: 0 | Peso: 0' },
    ]
  },
  {
    id: 'armas-t1', label: 'Armas · Tier 1', icon: '⚔', items: [
      {
        id: 'pico-oxidado', name: 'Pico Oxidado', imagePath: '/images/pobs/tier1_arma1.webp', rarity: 'Tier 1', description: 'Tu vieja herramienta confiable.',
        levels: [
          { level: 1, dmg: 1, cost: '—' },
          { level: 2, dmg: 2, cost: 'Piedra 80' },
          { level: 3, dmg: 3, cost: 'Piedra 200' },
          { level: 4, dmg: 4, cost: 'Piedra 450, Cobre 15' },
          { level: 5, dmg: 5, cost: 'Piedra 800, Cobre 40' },
        ]
      },
      {
        id: 'martillo-piedra', name: 'Martillo de Piedra', imagePath: '/images/pobs/tier1_arma2.webp', rarity: 'Tier 1', description: 'Más pesado que el pico, ideal para fracturar rocas.',
        levels: [
          { level: 1, dmg: 8, cost: 'Piedra 1000, Cobre 200' },
          { level: 2, dmg: 10, cost: 'Piedra 300, Cobre 50' },
          { level: 3, dmg: 12, cost: 'Piedra 400, Cobre 100' },
          { level: 4, dmg: 15, cost: 'Piedra 500, Cobre 150' },
          { level: 5, dmg: 20, cost: 'Piedra 600, Cobre 200' },
        ]
      },
      {
        id: 'pico-reforzado', name: 'Pico Reforzado', imagePath: '/images/pobs/tier1_arma3.webp', rarity: 'Tier 1', description: 'Un pico con puntas pulidas para mayor penetración.', unlock: '¡Desbloquea ESTAÑO!',
        levels: [
          { level: 1, dmg: 20, cost: 'Piedra 4000, Cobre 2000' },
          { level: 2, dmg: 28, cost: 'Piedra 1500, Cobre 500' },
          { level: 3, dmg: 35, cost: 'Piedra 2000, Cobre 1500, Estaño 150' },
          { level: 4, dmg: 50, cost: 'Piedra 2500, Cobre 2500, Estaño 400' },
          { level: 5, dmg: 70, cost: 'Piedra 3000, Cobre 3000, Estaño 800' },
        ]
      },
      {
        id: 'martillo-reforzado', name: 'Martillo Reforzado', imagePath: '/images/pobs/tier1_arma4.webp', rarity: 'Tier 1', description: 'Un mazo contundente capaz de astillar minerales.', unlock: '¡Desbloquea HIERRO y PLATA!',
        levels: [
          { level: 1, dmg: 50, cost: 'Piedra 8000, Cobre 3000, Estaño 2000' },
          { level: 2, dmg: 65, cost: 'Piedra 1500, Cobre 500' },
          { level: 3, dmg: 75, cost: 'Piedra 3000, Cobre 1200' },
          { level: 4, dmg: 105, cost: 'Piedra 4000, Cobre 2000, Estaño 300' },
          { level: 5, dmg: 115, cost: 'Piedra 5000, Cobre 3200, Estaño 600' },
        ]
      },
      {
        id: 'martillo-geologo', name: 'Martillo de Geólogo', imagePath: '/images/pobs/tier1_arma5.webp', rarity: 'Tier 1', description: 'Especialista en vetas raras.',
        levels: [
          { level: 1, dmg: 110, cost: 'Hierro 1500, Piedra 6000' },
          { level: 2, dmg: 130, cost: 'Hierro 750, Piedra 3000' },
          { level: 3, dmg: 140, cost: 'Hierro 1500, Piedra 4500' },
          { level: 4, dmg: 150, cost: 'Hierro 2250, Piedra 6000' },
          { level: 5, dmg: 160, cost: 'Hierro 3000, Piedra 7000' },
        ]
      },
      {
        id: 'geologo-reforzado', name: 'Geólogo Reforzado', imagePath: '/images/pobs/tier1_arma6.webp', rarity: 'Tier 1', description: 'Versión mejorada con núcleo de cobre.', unlock: '¡Desbloquea ORO!',
        levels: [
          { level: 1, dmg: 210, cost: 'Hierro 3500, Plata 2500' },
          { level: 2, dmg: 250, cost: 'Hierro 800, Plata 500' },
          { level: 3, dmg: 275, cost: 'Hierro 1100, Plata 600' },
          { level: 4, dmg: 300, cost: 'Hierro 1400, Plata 700' },
          { level: 5, dmg: 320, cost: 'Hierro 1600, Plata 800' },
        ]
      },
      {
        id: 'sledgehammer', name: 'Sledgehammer', imagePath: '/images/pobs/tier1_arma7.webp', rarity: 'Tier 1', description: 'Pura fuerza bruta. No hay roca que se resista.',
        levels: [
          { level: 1, dmg: 420, cost: 'Hierro 10000, Plata 5000, Oro 1600' },
          { level: 2, dmg: 500, cost: 'Hierro 5000, Plata 1000, Oro 900' },
          { level: 3, dmg: 525, cost: 'Hierro 5500, Plata 2000, Oro 1150' },
          { level: 4, dmg: 550, cost: 'Hierro 6500, Plata 2500, Oro 1300' },
          { level: 5, dmg: 600, cost: 'Hierro 7000, Plata 3000, Oro 1450' },
        ]
      },
      {
        id: 'hacha-cobre', name: 'Hacha de Cobre', imagePath: '/images/pobs/tier1_arma8.webp', rarity: 'Tier 1', description: 'Filosa y pesada para vetas profundas.',
        levels: [
          { level: 1, dmg: 600, cost: 'Hierro 20000, Plata 7500, Oro 2000' },
          { level: 2, dmg: 625, cost: 'Hierro 3000, Plata 1000' },
          { level: 3, dmg: 650, cost: 'Hierro 4000, Plata 1500' },
          { level: 4, dmg: 710, cost: 'Hierro 5000, Plata 2000' },
          { level: 5, dmg: 720, cost: 'Hierro 6000, Plata 2500, Oro 1500' },
        ]
      },
      {
        id: 'pico-real', name: 'Pico Real', imagePath: '/images/pobs/tier1_arma9.webp', rarity: 'Tier 1', description: 'La obra maestra del Tier 1.',
        levels: [
          { level: 1, dmg: 750, cost: 'Hierro 30000, Plata 10000, Oro 4000' },
          { level: 2, dmg: 1400, cost: 'Hierro 5000, Plata 3000' },
          { level: 3, dmg: 1700, cost: 'Hierro 6000, Plata 4000' },
          { level: 4, dmg: 2000, cost: 'Hierro 8000, Plata 5000' },
          { level: 5, dmg: 2500, cost: 'Hierro 10000, Plata 6000, Oro 1500' },
        ]
      },
    ]
  },
  {
    id: 'armas-t2', label: 'Armas · Tier 2', icon: '⚔', items: [
      {
        id: 'hipermartillo-esmeralda', name: 'Hipermartillo Esmeralda', imagePath: '/images/pobs/tier2_arma1.webp', rarity: 'Tier 2', description: 'Forjado con las vetas más puras del Reino 2.',
        levels: [
          { level: 1, dmg: 3000, cost: 'Hierro 30K, Esmeralda 1K' },
          { level: 2, dmg: 3200, cost: 'Hierro 10K, Esmeralda 220' },
          { level: 3, dmg: 3400, cost: 'Hierro 20K, Esmeralda 300' },
          { level: 4, dmg: 3600, cost: 'Hierro 25K, Esmeralda 400' },
          { level: 5, dmg: 4000, cost: 'Hierro 30K, Esmeralda 550, Diamante 1.2K' },
        ]
      },
      {
        id: 'taladro-diamantino', name: 'Taladro Diamantino', imagePath: '/images/pobs/tier2_arma2.webp', rarity: 'Tier 2', description: 'Una broca giratoria de diamante puro.',
        levels: [
          { level: 1, dmg: 8000, cost: 'Hierro 20K, Esmeralda 1.5K, Diamante 1.2K' },
          { level: 2, dmg: 8300, cost: 'Hierro 10K, Diamante 100' },
          { level: 3, dmg: 8600, cost: 'Hierro 20K, Diamante 200' },
          { level: 4, dmg: 8900, cost: 'Hierro 25K, Diamante 300' },
          { level: 5, dmg: 9200, cost: 'Hierro 30K, Diamante 500, Stellar Saphirus 100' },
        ]
      },
      {
        id: 'macuahuitl-guerra', name: 'Macuahuitl de Guerra', imagePath: '/images/pobs/tier2_arma3.webp', rarity: 'Tier 2', description: 'Hoja de hierro carmesí incrustada en esmeraldas eternas.',
        levels: [
          { level: 1, dmg: 15000, cost: 'Hierro 30K, Diamante 1K, Stellar Saphirus 500' },
          { level: 2, dmg: 15500, cost: 'Hierro 10K, Stellar Saphirus 150' },
          { level: 3, dmg: 16000, cost: 'Hierro 20K, Stellar Saphirus 200' },
          { level: 4, dmg: 16500, cost: 'Hierro 25K, Stellar Saphirus 250' },
          { level: 5, dmg: 17000, cost: 'Hierro 30K, Stellar Saphirus 300' },
        ]
      },
      {
        id: 'maza-elfica-zafiro', name: 'Maza Élfica de Zafiro', imagePath: '/images/pobs/tier2_arma4.webp', rarity: 'Tier 2', description: 'Maza encantada imbuida con cristales de zafiro estelar.',
        levels: [
          { level: 1, dmg: 25500, cost: 'Stellar Saphirus 1K, Crimson Obsidian 150' },
          { level: 2, dmg: 26000, cost: 'Crimson Obsidian 25' },
          { level: 3, dmg: 27000, cost: 'Crimson Obsidian 80' },
          { level: 4, dmg: 28000, cost: 'Crimson Obsidian 120' },
          { level: 5, dmg: 30000, cost: 'Crimson Obsidian 160' },
        ]
      },
      {
        id: 'guantelete-sangre', name: 'Guantelete de Sangre', imagePath: '/images/pobs/tier2_arma5.webp', rarity: 'Tier 2', description: 'Guantelete forjado con obsidiana carmesí.',
        levels: [
          { level: 1, dmg: 40000, cost: 'Crimson Obsidian 500, Mithrill 100' },
          { level: 2, dmg: 41000, cost: 'Mithrill 25' },
          { level: 3, dmg: 42000, cost: 'Mithrill 50' },
          { level: 4, dmg: 43000, cost: 'Mithrill 75' },
          { level: 5, dmg: 44000, cost: 'Mithrill 100' },
        ]
      },
      {
        id: 'hacha-sonica-estrellas', name: 'Hacha Sónica de Estrellas', imagePath: '/images/pobs/tier2_arma6.webp', rarity: 'Tier 2', description: 'Genera ondas de choque al impactar.',
        levels: [
          { level: 1, dmg: 65000, cost: 'Hierro 100K, Stellar Saphirus 3.25K, Blood Corundom 15' },
          { level: 2, dmg: 66000, cost: 'Hierro 9K, Blood Corundom 6' },
          { level: 3, dmg: 66500, cost: 'Hierro 10K, Blood Corundom 9' },
          { level: 4, dmg: 67250, cost: 'Hierro 12K, Blood Corundom 13' },
          { level: 5, dmg: 68300, cost: 'Hierro 14K, Blood Corundom 18, Mithrill 50' },
        ]
      },
      {
        id: 'mega-martillo-mithrill', name: 'Mega Martillo de Mithrill', imagePath: '/images/pobs/tier2_arma7.webp', rarity: 'Tier 2', description: 'Colosal mazo de mithrill puro.',
        levels: [
          { level: 1, dmg: 100000, cost: 'Hierro 130K, Mithrill 750, Blood Corundom 100' },
          { level: 2, dmg: 110000, cost: 'Hierro 15K, Blood Corundom 25' },
          { level: 3, dmg: 120000, cost: 'Hierro 30K, Blood Corundom 32' },
          { level: 4, dmg: 125000, cost: 'Hierro 40K, Blood Corundom 42' },
          { level: 5, dmg: 135000, cost: 'Hierro 50K, Blood Corundom 55, Mithrill 80' },
        ]
      },
      {
        id: 'guadana-volcanica', name: 'Guadaña Volcánica de Infierno', imagePath: '/images/pobs/tier2_arma8.webp', rarity: 'Tier 2', description: 'Templada en lava del Reino 2.',
        levels: [
          { level: 1, dmg: 175000, cost: 'Hierro 150K, Blood Corundom 250, Mithrill 250' },
          { level: 2, dmg: 194000, cost: 'Hierro 14K, Blood Corundom 70' },
          { level: 3, dmg: 215000, cost: 'Hierro 16K, Blood Corundom 85' },
          { level: 4, dmg: 240000, cost: 'Hierro 18K, Blood Corundom 105' },
          { level: 5, dmg: 270000, cost: 'Hierro 20K, Blood Corundom 130, Mithrill 120' },
        ]
      },
      {
        id: 'baculo-sangre-purificada', name: 'Báculo de Sangre Purificada', imagePath: '/images/pobs/tier2_arma9.webp', rarity: 'Tier 2', description: 'La obra maestra del Tier 2.',
        levels: [
          { level: 1, dmg: 285000, cost: 'Hierro 1M, Blood Corundom 1.1K, Mithrill 5K' },
          { level: 2, dmg: 380000, cost: 'Hierro 25K, Blood Corundom 1K' },
          { level: 3, dmg: 500000, cost: 'Hierro 30K, Blood Corundom 1.2K' },
          { level: 4, dmg: 650000, cost: 'Hierro 38K, Blood Corundom 1.5K' },
          { level: 5, dmg: 850000, cost: 'Hierro 45K, Blood Corundom 1.8K, Mithrill 200' },
        ]
      },
    ]
  },
  {
    id: 'armas-t3', label: 'Armas · Tier 3', icon: '⚔', items: [
      {
        id: 'martillo-elfico-oro', name: 'Martillo Élfico de Oro', imagePath: '/images/pobs/tier3_arma1.webp', rarity: 'Tier 3', description: 'Forjado con oro puro y magia élfica.',
        levels: [
          { level: 1, dmg: 1700000, cost: 'Blood Corundom 600, Adamantio 150, Oro 500K' },
          { level: 2, dmg: 2100000, cost: 'Blood Corundom 250, Adamantio 50, Oro 100K' },
          { level: 3, dmg: 2600000, cost: 'Blood Corundom 350, Adamantio 80, Oro 200K' },
          { level: 4, dmg: 3200000, cost: 'Blood Corundom 450, Adamantio 110, Oro 300K' },
          { level: 5, dmg: 4000000, cost: 'Blood Corundom 600, Adamantio 150, Oricalco 40, Oro 400K' },
        ]
      },
      {
        id: 'martillo-historico-cobre', name: 'Martillo Histórico de Cobre Ancestral', imagePath: '/images/pobs/tier3_arma2.webp', rarity: 'Tier 3', description: 'Forjado con cobre antiguo y magia ancestral.',
        levels: [
          { level: 1, dmg: 7500000, cost: 'Adamantio 800, Oricalco 250, Paladio 30' },
          { level: 2, dmg: 9000000, cost: 'Adamantio 300, Oricalco 120' },
          { level: 3, dmg: 11000000, cost: 'Adamantio 450, Oricalco 180' },
          { level: 4, dmg: 13000000, cost: 'Adamantio 600, Oricalco 240' },
          { level: 5, dmg: 15500000, cost: 'Adamantio 800, Oricalco 350, Paladio 120' },
        ]
      },
      {
        id: 'lanza-paladin', name: 'Lanza de Paladín', imagePath: '/images/pobs/tier3_arma3.webp', rarity: 'Tier 3', description: 'Una fuerza imparable que destroza gemas.',
        levels: [
          { level: 1, dmg: 17000000, cost: 'Oricalco 900, Paladio 350, Titanio 80, Adamantio 1K' },
          { level: 2, dmg: 21000000, cost: 'Oricalco 400, Paladio 180' },
          { level: 3, dmg: 26000000, cost: 'Oricalco 550, Paladio 240' },
          { level: 4, dmg: 32500000, cost: 'Oricalco 750, Paladio 320' },
          { level: 5, dmg: 40000000, cost: 'Oricalco 1K, Paladio 450, Titanio 150' },
        ]
      },
      {
        id: 'guadana-titanio', name: 'Guadaña de Titanio', imagePath: '/images/pobs/tier3_arma4.webp', rarity: 'Tier 3', description: 'Hoja de titanio forjada para segar montañas enteras.',
        levels: [
          { level: 1, dmg: 55000000, cost: 'Paladio 1.2K, Titanio 450, Ferrolumbre 90, Adamantio 2.5K' },
          { level: 2, dmg: 68000000, cost: 'Paladio 500, Titanio 220' },
          { level: 3, dmg: 85000000, cost: 'Paladio 700, Titanio 350' },
          { level: 4, dmg: 105000000, cost: 'Paladio 900, Titanio 450' },
          { level: 5, dmg: 125000000, cost: 'Paladio 1.1K, Titanio 550, Ferrolumbre 180' },
        ]
      },
      {
        id: 'baculo-eryndel', name: 'Báculo de Eryndel', imagePath: '/images/pobs/tier3_arma5.webp', rarity: 'Tier 3', description: 'Artefacto de magia arcana capaz de fracturar el espacio.',
        levels: [
          { level: 1, dmg: 175000000, cost: 'Titanio 1.5K, Ferrolumbre 600, Neodimio 100, Adamantio 3.5K' },
          { level: 2, dmg: 225000000, cost: 'Titanio 800, Ferrolumbre 300, Neodimio 140' },
          { level: 3, dmg: 285000000, cost: 'Titanio 1K, Ferrolumbre 450, Neodimio 170' },
          { level: 4, dmg: 345000000, cost: 'Titanio 1.2K, Ferrolumbre 580, Neodimio 200' },
          { level: 5, dmg: 410000000, cost: 'Titanio 1.4K, Ferrolumbre 700, Neodimio 220' },
        ]
      },
      {
        id: 'maza-magnetica-ferrolumbre', name: 'Maza Magnética de Ferrolumbre', imagePath: '/images/pobs/tier3_arma6.webp', rarity: 'Tier 3', description: 'Su campo magnético desintegra cualquier mineral al contacto.',
        levels: [
          { level: 1, dmg: 580000000, cost: 'Ferrolumbre 1.3K, Neodimio 750, Iridio 120' },
          { level: 2, dmg: 750000000, cost: 'Ferrolumbre 1K, Neodimio 400, Iridio 160' },
          { level: 3, dmg: 950000000, cost: 'Ferrolumbre 1.2K, Neodimio 600, Iridio 200' },
          { level: 4, dmg: 1150000000, cost: 'Ferrolumbre 1.5K, Neodimio 750, Iridio 240' },
          { level: 5, dmg: 1400000000, cost: 'Ferrolumbre 1.8K, Neodimio 900, Iridio 280' },
        ]
      },
      {
        id: 'tridente-iridio', name: 'Tridente de Iridio', imagePath: '/images/pobs/tier3_arma7.webp', rarity: 'Tier 3', description: 'Tres puntas de iridio que perforan hasta la roca más dura del cosmos.',
        levels: [
          { level: 1, dmg: 2000000000, cost: 'Neodimio 2.2K, Iridio 950, Neutronio 150' },
          { level: 2, dmg: 2600000000, cost: 'Neodimio 1.2K, Iridio 600, Neutronio 200' },
          { level: 3, dmg: 3300000000, cost: 'Neodimio 1.6K, Iridio 800, Neutronio 250' },
          { level: 4, dmg: 4100000000, cost: 'Neodimio 2K, Iridio 1K, Neutronio 300' },
          { level: 5, dmg: 5000000000, cost: 'Neodimio 2.4K, Iridio 1.2K, Neutronio 350' },
        ]
      },
      {
        id: 'devastadora-neutronio', name: 'Devastadora de Neutronio', imagePath: '/images/pobs/tier3_arma8.webp', rarity: 'Tier 3', description: 'El penúltimo escalón. Un arma que colapsa el espacio-tiempo al impactar.',
        levels: [
          { level: 1, dmg: 3500000000, cost: 'Iridio 3K, Neutronio 1.2K, Fragmento del Infinito 180' },
          { level: 2, dmg: 4300000000, cost: 'Iridio 1.5K, Neutronio 800, Fragmento 250' },
          { level: 3, dmg: 5200000000, cost: 'Iridio 2K, Neutronio 1.2K, Fragmento 320' },
          { level: 4, dmg: 6100000000, cost: 'Iridio 2.5K, Neutronio 1.5K, Fragmento 390' },
          { level: 5, dmg: 7000000000, cost: 'Iridio 3.5K, Neutronio 1.8K, Fragmento del Infinito 450' },
        ]
      },
      {
        id: 'filo-infinito', name: 'Filo del Infinito', imagePath: '/images/pobs/tier3_arma9.webp', rarity: 'Tier 3', description: 'La obra maestra del Tier 3. La llave que abre el camino al origen.',
        levels: [
          { level: 1, dmg: 5000000000, cost: 'Neutronio 4.5K, Fragmento del Infinito 1.5K' },
          { level: 2, dmg: 6300000000, cost: 'Neutronio 2K, Fragmento del Infinito 700' },
          { level: 3, dmg: 7700000000, cost: 'Neutronio 3K, Fragmento del Infinito 1K' },
          { level: 4, dmg: 9000000000, cost: 'Neutronio 4K, Fragmento del Infinito 1.5K' },
          { level: 5, dmg: 10000000000, cost: 'Neutronio 6.5K, Fragmento del Infinito 2.5K' },
        ]
      },
    ]
  },
  {
    id: 'armas-miticas', label: 'Armas Míticas', icon: '✸', items: [
      { id: 'orion', name: 'Orion, el Susurro del Cosmos', imagePath: '/images/pobs/OrionCazadorDeConstelaciones.webp', rarity: 'Arma Mítica', description: 'Arma mítica forjada con el corazón de una constelación muerta. Resuena con el cosmos.', stat: 'Daño: 12.5B • Requisito: Orionite • Sockets: 5' },
      { id: 'luz-eos', name: 'Luz de Eos', imagePath: '/images/pobs/LuzDeEos.webp', rarity: 'Arma Mítica', description: 'La primera luz del amanecer cristalizada en acero Aethergald. Irradia calor divino.', stat: 'Daño: 12.5B • Requisito: Aethergald • Sockets: 5' },
      { id: 'eclipse-final', name: 'Eclipse Final', imagePath: '/images/pobs/DevoradoraDeVacío.webp', rarity: 'Arma Mítica', description: 'Nacida del vacío absoluto. Absorbe la luz y la convierte en devastación.', stat: 'Daño: 12.5B • Requisito: StellarObsidian • Sockets: 5' },
      { id: 'slayer-draconio', name: 'Slayer de Draconio', imagePath: '/images/pobs/SableDelDraconio.webp', rarity: 'Arma Mítica', description: 'Forjada para cazar dragones cósmicos. Su filo corta entre dimensiones.', stat: 'Daño: 12.5B • Requisito: Draconium • Sockets: 5' },
      { id: 'abismo-zoth', name: 'Abismo de Zoth', imagePath: '/images/pobs/AbismoDeZoth.webp', rarity: 'Arma Mítica', description: 'Emergió de las profundidades más oscuras. Ningún mineral puede resistirse a su influencia.', stat: 'Daño: 12.5B • Requisito: EtherCrystal • Sockets: 5' },
      { id: 'ecos-tiempo', name: 'Ecos del Tiempo', imagePath: '/images/pobs/EcosDelTiempo.webp', rarity: 'Arma Mítica', description: 'Registra cada golpe desde el primer instante de la creación. El tiempo mismo tiembla.', stat: 'Daño: 12.5B • Requisito: HistoryCrystal • Sockets: 5' },
      { id: 'soberania-rey-caido', name: 'Soberanía del Rey Caído', imagePath: '/images/pobs/SoberaníaDelReyCaído.webp', rarity: 'Arma Mítica', description: 'El poder del último rey del mundo anterior, sellado en piedra de rey.', stat: 'Daño: 12.5B • Requisito: KingStone • Sockets: 5' },
      { id: 'cisma-tectonico', name: 'Cisma Tectónico', imagePath: '/images/pobs/CismaTectónico.webp', rarity: 'Arma Mítica', description: 'Creado en el instante en que la tierra se partió. Cada golpe replica ese evento.', stat: 'Daño: 12.5B • Requisito: Magnamite • Sockets: 5' },
      { id: 'fision-sol-negro', name: 'Fisión del Sol Negro', imagePath: '/images/pobs/FisióndelSolNegro.webp', rarity: 'Arma Mítica', description: 'Condensa la energía de una estrella colapsada en un filo imposible de contener.', stat: 'Daño: 12.5B • Requisito: Quasarite • Sockets: 5' },
      { id: 'llave-creacion', name: 'Llave de la Creación Binohmana', imagePath: '/images/pobs/LlaveInfinito.webp', rarity: 'Arma Mítica', description: 'La recompensa suprema. Sacrificar las 9 armas míticas en el altar otorga esta llave que abre el portal al inicio de la creación.', stat: 'Requisito: 9 Armas Míticas sacrificadas' },
      { id: 'espada-binohmo', name: 'Espada de Binohmo', imagePath: '/images/pobs/EspadaBinohmo.webp', rarity: 'Arma Mítica', description: 'La cima absoluta. Forjada con el mineral que emergió al romper a Binohmo en el combate final. El pico. La leyenda máxima.', stat: 'Daño: ∞ • Requisito: Binohmo (Génesis)' },
    ]
  },
  {
    id: 'upgrades', label: 'Upgrades', icon: '▲', items: [
      { id: 'upg-arma-filosa', name: 'Arma Filosa', imagePath: '/images/pobs/Upgrade1.webp', rarity: 'Mejora', description: 'Cada click potencia el daño base. Cuantos más compres, mayor es el porcentaje de bonificación acumulado.', stat: 'Efecto: +X% Daño Base por click' },
      { id: 'upg-instinto-salvaje', name: 'Instinto Salvaje', imagePath: '/images/pobs/Upgrade2.webp', rarity: 'Mejora', description: 'Despierta el instinto de cazador en el forjador. Aumenta la Chance Crítica base del personaje.', stat: 'Efecto: +Chance Crítica base' },
      { id: 'upg-golpe-contundente', name: 'Golpe Contundente', imagePath: '/images/pobs/Upgrade3.webp', rarity: 'Mejora', description: 'Cada golpe crítico se vuelve más devastador. Aumenta el Multiplicador de daño Crítico base.', stat: 'Efecto: +Multiplicador Daño Crítico base' },
      { id: 'upg-buscador-raros', name: 'Buscador de Raros', imagePath: '/images/pobs/Upgrade4.png', rarity: 'Mejora', description: 'Afinidad especial con las vetas ocultas. Aumenta la probabilidad de obtener minerales raros al romper.', stat: 'Efecto: +Prob. Minerales RAROS' },
      { id: 'upg-minero-auto-i', name: 'Minero Autónomo I', imagePath: '/images/pobs/UpgradeAutoI.webp', rarity: 'Mejora', description: 'Invoca un minero espectral que extrae automáticamente minerales de Tier 1 mientras estás ausente.', stat: 'Efecto: Auto-genera Piedra, Cobre, Hierro /seg' },
      { id: 'upg-minero-auto-ii', name: 'Minero Autónomo II', imagePath: '/images/pobs/UpgradeAutoII.webp', rarity: 'Mejora', description: 'Versión avanzada del minero espectral. Extrae minerales de Tier 2 de forma automática con alta eficiencia.', stat: 'Efecto: Auto-genera Esmeralda, Diamante, Saphirus /seg' },
      { id: 'upg-bonif-mineral', name: 'Bonificación Mineral', imagePath: '/images/pobs/Upgrade7.png', rarity: 'Mejora', description: 'Aplica un multiplicador porcentual a todos los drops de minerales del mapa. Beneficia todos los Tiers.', stat: 'Efecto: +% Multiplicador Drop GLOBAL' },
      { id: 'upg-debilidad', name: 'Debilidad Estructural', imagePath: '/images/pobs/Upgrade8.png', rarity: 'Mejora', description: 'Debilita la estructura interna de los minerales, reduciendo su vida total y acelerando su extracción.', stat: 'Efecto: -% Vida total de minerales' },
      { id: 'upg-maestria-guerrero', name: 'Maestría Guerrero', imagePath: '/images/pobs/UpgEsp.webp', rarity: 'Mejora', description: 'Potencia la onda de choque del Guerrero. Cada nivel aumenta el daño del Shockwave desbloqueado.', stat: 'Efecto: +Daño de Onda de Choque' },
      { id: 'upg-maestria-arquero', name: 'Maestría Arquero', imagePath: '/images/pobs/Upgrade9_A.png', rarity: 'Mejora', description: 'Aumenta la probabilidad de activar el combo infinito de críticos del Arquero, encadenando ejecuciones.', stat: 'Efecto: +Chance Combo Crítico Infinito' },
      { id: 'upg-maestria-conjurador', name: 'Maestría Conjurador', imagePath: '/images/pobs/Upgrade9_C.png', rarity: 'Mejora', description: 'Amplifica el poder del autoclicker de la vara mágica, aumentando su daño en cada pulso automático.', stat: 'Efecto: +Daño Autoclicker de Vara' },
    ]
  },
  {
    id: 'habilidades', label: 'Habilidades', icon: '◎', items: [
      { id: 'skill-mundo2', name: 'Viaje al Mundo 2', imagePath: '/images/pobs/Portal2.webp', rarity: 'Habilidad', description: 'Desbloquea el acceso al Segundo Reino. Costo 1 SP. Un portal permanente hacia La Costa de las Almas.', stat: 'Coste: 1 SP | Efecto: Desbloquea Reino 2' },
      { id: 'skill-mundo3', name: 'Los Últimos Pasos', imagePath: '/images/pobs/portTR3.webp', rarity: 'Habilidad', description: 'La magia del LAGH abre la brecha hacia el Tercer Reino. Costo 1 SP. Solo para los más decididos.', stat: 'Coste: 1 SP | Efecto: Desbloquea Reino 3' },
      { id: 'skill-brazo-hierro', name: 'Brazo de Hierro', imagePath: '/images/pobs/BrazoHierro.webp', rarity: 'Habilidad', description: 'Fortalece el brazo de golpe para impactos más potentes. +15% DPC base permanente.', stat: 'Coste: 1 SP | +15% DPC base' },
      { id: 'skill-filo-ambicioso', name: 'Filo Ambicioso', imagePath: '/images/pobs/FiloAmb.webp', rarity: 'Habilidad', description: '+5% Probabilidad Crítica. Cada crítico potencia el siguiente golpe en la cadena.', stat: 'Coste: 1 SP | +5% Prob. Crítico' },
      { id: 'skill-impacto-sismico', name: 'Impacto Sísmico', imagePath: '/images/pobs/ImpactoSis.webp', rarity: 'Habilidad', description: '+10% DPC. Activa Shockwave (Daño ×3) automáticamente cada 100 clicks.', stat: 'Coste: 1 SP | +10% DPC • Shockwave x3 c/100 clicks' },
      { id: 'skill-grietas', name: 'Buscador de Grietas', imagePath: '/images/pobs/MagicCrack.webp', rarity: 'Habilidad', description: 'Detecta las grietas ocultas del mineral. +20% al Multiplicador de Daño Crítico.', stat: 'Coste: 1 SP | +20% Mult. Crítico' },
      { id: 'skill-inercia-herrero', name: 'Inercia del Herrero', imagePath: '/images/pobs/BlacksmithEssence.webp', rarity: 'Habilidad', description: 'Clicks rápidos acumulan +2% DPC por cach extra (máx. +20% acumulado).', stat: 'Coste: 2 SP | Clicks rápidos → +2% DPC (máx +20%)' },
      { id: 'skill-peso-leyenda', name: 'Peso de Leyenda', imagePath: '/images/pobs/PesoLeyenda.webp', rarity: 'Habilidad', description: '+25% DPC. El nivel del arma equipada añade ese % extra de daño directamente.', stat: 'Coste: 2 SP | +25% DPC + % nivel arma' },
      { id: 'skill-hambre-sangre', name: 'Hambre de Sangre', imagePath: '/images/pobs/BloodHunger.webp', rarity: 'Habilidad', description: 'La sed de minerales multiplica el botín. Drops multiplicados ×1.5 en todo momento.', stat: 'Coste: 2 SP | Drops ×1.5' },
      { id: 'skill-golpe-desgaste', name: 'Golpe de Desgaste', imagePath: '/images/pobs/GolpeDesgaste.webp', rarity: 'Habilidad', description: '5 críticos consecutivos reducen un 15% la vida total del mineral activo.', stat: 'Coste: 2 SP | 5 críticos → -15% vida mineral' },
      { id: 'skill-ojo-halcon', name: 'Ojo de Halcón', imagePath: '/images/pobs/OjoAguila.webp', rarity: 'Habilidad', description: 'Precisión élfica. +20% Probabilidad Crítica global para todos los golpes.', stat: 'Coste: 1 SP | +20% Prob. Crítico global' },
      { id: 'skill-flecha-perf', name: 'Flecha Perforante', imagePath: '/images/pobs/FlechaPerf.webp', rarity: 'Habilidad', description: 'Las flechas perforan la coraza interna. +15% al Multiplicador de Daño Crítico.', stat: 'Coste: 1 SP | +15% Mult. Daño Crítico' },
      { id: 'skill-cadencia', name: 'Cadencia de Disparo', imagePath: '/images/pobs/Cadencia.webp', rarity: 'Habilidad', description: 'El cuarto crítico consecutivo desencadena un golpe doble devastador (×2 daño).', stat: 'Coste: 1 SP | 4to crítico seguido → ×2 daño' },
      { id: 'skill-punteria', name: 'Puntería Quirúrgica', imagePath: '/images/pobs/Certero.webp', rarity: 'Habilidad', description: 'Tras un crítico, la concentración eleva un 25% la chance de conseguir otro crítico de inmediato.', stat: 'Coste: 2 SP | Post-crítico +25% chance otro crítico' },
      { id: 'skill-lluvia-astillas', name: 'Lluvia de Astillas', imagePath: '/images/pobs/LluviaFlecha.webp', rarity: 'Habilidad', description: 'Los críticos tienen un 20% de posibilidades de generar drops de forma instantánea.', stat: 'Coste: 2 SP | Críticos: 20% → drop instantáneo' },
      { id: 'skill-punta-envenenada', name: 'Punta Envenenada', imagePath: '/images/pobs/PuntaEnv.webp', rarity: 'Habilidad', description: 'El veneno en la punta ignora un 20% del blindaje o la vida máxima del mineral objetivo.', stat: 'Coste: 2 SP | Crítico ignora 20% vida/blindaje' },
      { id: 'skill-cazador-sombras', name: 'Cazador de Sombras', imagePath: '/images/pobs/ShadowHunter.webp', rarity: 'Habilidad', description: 'Cuando el excedente de daño crítico supera el 50%, el extra se convierte en daño puro sin reducción.', stat: 'Coste: 1 SP | Excedente crítico >50% → daño puro' },
      { id: 'skill-orion', name: 'Concentración de Orión', imagePath: '/images/pobs/Orion.webp', rarity: 'Habilidad', description: 'Tras 2 segundos sin clickear, el siguiente golpe es un instacrit con ×5 de daño.', stat: 'Coste: 2 SP | 2s sin click → instacrit ×5' },
      { id: 'skill-mano-destino', name: 'Mano del Destino', imagePath: '/images/pobs/Mano.webp', rarity: 'Habilidad', description: 'Invoca un auto-clicker mágico que golpea 1 vez/segundo con el 50% de tu daño base.', stat: 'Coste: 1 SP | Auto-clicker 1/s al 50% daño' },
      { id: 'skill-alquimia', name: 'Alquimia de Transmutación', imagePath: '/images/pobs/Alchemy.webp', rarity: 'Habilidad', description: '2.5% de probabilidad de que un mineral común suelte uno superior al romperse.', stat: 'Coste: 1 SP | 2.5% común → superior' },
      { id: 'skill-bendicion', name: 'Bendición del Clérigo', imagePath: '/images/pobs/Blessed.webp', rarity: 'Habilidad', description: '7.5% de que el nuevo mineral aparezca ya debilitado al 50% de su vida máxima.', stat: 'Coste: 1 SP | 7.5% → mineral nuevo aparece al 50% vida' },
      { id: 'skill-replica', name: 'Réplica Etérea', imagePath: '/images/pobs/Ethereal.webp', rarity: 'Habilidad', description: '15% de probabilidad de duplicar el mineral roto, obteniendo el doble del drop.', stat: 'Coste: 2 SP | 15% → duplica mineral roto' },
      { id: 'skill-invocacion', name: 'Invocación de Pico Ancestral', imagePath: '/images/pobs/Conjuration.webp', rarity: 'Habilidad', description: 'Potencia el auto-clicker mágico, elevando su cadencia a 3 clicks por segundo.', stat: 'Coste: 2 SP | Auto-clicker → 3 clicks/s' },
      { id: 'skill-sabiduria', name: 'Sabiduría del Sabio', imagePath: '/images/pobs/Wise.webp', rarity: 'Habilidad', description: 'Profundo conocimiento alquímico. +25% de Polvo Mineral al condensar en el condensador.', stat: 'Coste: 2 SP | +25% Polvo Mineral en condensación' },
      { id: 'skill-destilacion', name: 'Destilación de Gemas', imagePath: '/images/pobs/GemD.webp', rarity: 'Habilidad', description: 'Refina el proceso de extracción de gemas. +75% chance de obtener Gemas Raras y Super Raras.', stat: 'Coste: 1 SP | +75% chance Gemas Raras' },
      { id: 'skill-aura-abundancia', name: 'Aura de Abundancia', imagePath: '/images/pobs/Aura.webp', rarity: 'Habilidad', description: 'Un aura mágica genera +1 unidad del mineral actual por segundo mientras estás AFK.', stat: 'Coste: 2 SP | +1 mineral actual/seg AFK' },
    ]
  },
  {
    id: 'gemas', label: 'Gemas', icon: '◆', items: [
      // ─ Comunes ─
      { id: 'gem-guijarro', name: 'Guijarro Pulido', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+5% Probabilidad de doble mineral común al romperlo.', stat: '+5% Doble mineral común' },
      { id: 'gem-esquirla-hierro', name: 'Esquirla de Hierro', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+5% DPC. −5% Chance Crítico.', stat: '+5% DPC | −5% Chance Crítico' },
      { id: 'gem-residuo-opaco', name: 'Residuo Opaco', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+25% Chance de obtener +10 Polvo Mineral por mineral roto.', stat: '+25% Chance +10 Polvo/mineral' },
      { id: 'gem-veta-simple', name: 'Veta Simple', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+4% Probabilidad de encontrar Mithrill/Blood Corundom (Tier 2).', stat: '+4% Prob. Mithrill/Blood Corundom' },
      { id: 'gem-punta-reforzada', name: 'Punta Reforzada', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+10% Multiplicador de Crítico. −5% Chance Crítico.', stat: '+10% Mult. Crítico | −5% Chance Crítico' },
      { id: 'gem-polvo-compacto', name: 'Polvo Compacto', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+5% Cantidad de Polvo Mineral al picar ores raros.', stat: '+5% Polvo en ores raros' },
      { id: 'gem-frag-opaco', name: 'Fragmento Opaco', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+5% Frecuencia de aparición de Yunque Dorado.', stat: '+5% Frecuencia Yunque Dorado' },
      { id: 'gem-cuarzo-debil', name: 'Cuarzo Débil', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+4% Probabilidad de Shockwave.', stat: '+4% Prob. Shockwave' },
      { id: 'gem-gravilla', name: 'Gravilla Pesada', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+1% Daño total por cada 1.000.000 de minerales en inventario.', stat: '+1% Daño por cada 1M minerales' },
      { id: 'gem-laja-cueva', name: 'Laja de Cueva', imagePath: '/images/pobs/GemaComun.webp', rarity: 'Gema Común', description: '+2% Chance de Crítico.', stat: '+2% Chance Crítico' },
      // ─ Poco Comunes ─
      { id: 'gem-esm-bruta', name: 'Esmeralda Bruta', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+10% Probabilidad de doble mineral común al romper (Tier 1).', stat: '+10% Doble mineral T1' },
      { id: 'gem-musgo', name: 'Musgo Petrificado', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+15% Probabilidad de obtener +20 Polvo Mineral por mineral roto.', stat: '+15% Chance +20 Polvo/mineral' },
      { id: 'gem-ojo-selva', name: 'Ojo de Selva', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+8% Probabilidad de encontrar Oro/Plata (Tier 1 raros).', stat: '+8% Prob. Oro/Plata' },
      { id: 'gem-escama-cobre', name: 'Escama de Cobre', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+7% Probabilidad de Shockwave.', stat: '+7% Prob. Shockwave' },
      { id: 'gem-clorofila', name: 'Clorofila Sólida', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+10% DPC si el mineral actual es de Tier 1.', stat: '+10% DPC en mineral T1' },
      { id: 'gem-filtro-esm', name: 'Filtro de Esmeralda', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+15% Cantidad de Polvo Mineral al picar Esmeralda.', stat: '+15% Polvo en Esmeralda' },
      { id: 'gem-resina', name: 'Resina Antigua', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+9% Frecuencia de aparición de Yunque Dorado.', stat: '+9% Frecuencia Yunque Dorado' },
      { id: 'gem-pua-bronce', name: 'Púa de Bronce', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+12% Multiplicador de Crítico. −8% Chance Crítico.', stat: '+12% Mult. Crítico | −8% Chance Crítico' },
      { id: 'gem-eco-bosque', name: 'Eco del Bosque', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+5% Chance de que el mineral raro suelte el doble de material.', stat: '+5% Doble drop mineral raro' },
      { id: 'gem-liquen', name: 'Líquen Energético', imagePath: '/images/pobs/GemaPocoComun.webp', rarity: 'Gema Poco Común', description: '+15% de multiplicación de daño de Shockwave.', stat: '+15% Daño Shockwave' },
      // ─ Raras ─
      { id: 'gem-zafiro-abismo', name: 'Zafiro del Abismo', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+15% Polvo al picar Esmeralda, Diamante y Saphirus.', stat: '+15% Polvo en T2 (Esm/Dia/Saph)' },
      { id: 'gem-cristal-cob', name: 'Cristal de Cobalto', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+20% Probabilidad de obtener +40 Polvo Mineral por golpe.', stat: '+20% Chance +40 Polvo/golpe' },
      { id: 'gem-lagrima-marina', name: 'Lágrima Marina', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+13% Frecuencia de aparición de Yunque Dorado.', stat: '+13% Frecuencia Yunque Dorado' },
      { id: 'gem-rayo-eterno', name: 'Rayo Eterno', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+15% Probabilidad de Shockwave.', stat: '+15% Prob. Shockwave' },
      { id: 'gem-espejo-celeste', name: 'Espejo Celeste', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+10% Chance de encontrar Blood Corundom/Mithrill (Tier 2 raros).', stat: '+10% Prob. Blood Corundom/Mithrill' },
      { id: 'gem-runa-agua', name: 'Runa de Agua', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+20% Mult. Crítico. −15% Chance Crítico.', stat: '+20% Mult. Crítico | −15% Chance Crítico' },
      { id: 'gem-geoda', name: 'Geoda Azulada', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+15% Probabilidad de doble mineral común (Tier 1).', stat: '+15% Doble mineral T1' },
      { id: 'gem-frag-cielo', name: 'Fragmento de Cielo', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+15% DPC. −8% Chance Crítico.', stat: '+15% DPC | −8% Chance Crítico' },
      { id: 'gem-nucleo-saph', name: 'Núcleo de Saphirus', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: 'Cada Yunque Dorado usado da +1% de daño permanente (máx. 20%).', stat: 'Yunque Dorado → +1% daño perm. (máx 20%)' },
      { id: 'gem-corriente-fria', name: 'Corriente Fría', imagePath: '/images/pobs/GemaRara.webp', rarity: 'Gema Rara', description: '+4% Chance Crítico por cada 100k de DPC base del jugador.', stat: '+4% Crit por cada 100K DPC base' },
      // ─ Impresionantes ─
      { id: 'gem-amatista', name: 'Amatista Real', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+20% Prob. Shockwave. −10% DPC y −10% Chance Crítico.', stat: '+20% Shockwave | −10% DPC, −10% Crítico' },
      { id: 'gem-nebulosa', name: 'Nebulosa de Vacío', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+40% Polvo al picar Saphirus/Crimson Obsidian.', stat: '+40% Polvo en Saph/Crimson' },
      { id: 'gem-pico-trama', name: 'Pico de Trama', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+12% Probabilidad de obtener +1 Polvo Mineral por golpe.', stat: '+12% Chance +1 Polvo/golpe' },
      { id: 'gem-ojo-oraculo', name: 'Ojo de Oráculo', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+15% Chance de encontrar minerales raros Tier 2.', stat: '+15% Prob. minerales raros T2' },
      { id: 'gem-relampago', name: 'Relámpago Púrpura', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: 'El Shockwave hace un 50% de daño extra del golpe original.', stat: 'Shockwave +50% daño extra' },
      { id: 'gem-espejismo', name: 'Espejismo', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+18% Frecuencia de aparición de Yunque Dorado.', stat: '+18% Frecuencia Yunque Dorado' },
      { id: 'gem-corazon-bin', name: 'Corazón de Binohmo', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+25% DPC. −15% Chance Crítico. −5% Mult. Crítico.', stat: '+25% DPC | −15% Crítico, −5% Mult.' },
      { id: 'gem-frag-energia', name: 'Fragmento de Energía', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: 'Cada 30 clicks, el siguiente golpe es Crítico Garantizado.', stat: 'Cada 30 clicks → Crítico Garantizado' },
      { id: 'gem-obsidiana', name: 'Obsidiana Pulida', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+30% Mult. Crítico. −15% Chance Crítico.', stat: '+30% Mult. Crítico | −15% Chance Crítico' },
      { id: 'gem-sello-caos', name: 'Sello del Caos', imagePath: '/images/pobs/GemaImpresionante.webp', rarity: 'Gema Impresionante', description: '+10% Prob. de que aparezca un Yunque Dorado al romper un Ore Tier 2.', stat: '+10% Yunque Dorado al romper T2' },
      // ─ Legendarias ─
      { id: 'gem-nucleo-solar', name: 'Núcleo Solar', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+40% Mult. Crítico. −35% Chance Crítico.', stat: '+40% Mult. Crítico | −35% Chance Crítico' },
      { id: 'gem-llama-eterna', name: 'Llama Eterna', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+30% DPC. −15% Chance Crítico.', stat: '+30% DPC | −15% Chance Crítico' },
      { id: 'gem-ojo-dragon', name: 'Ojo del Dragón', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+20% Chance de encontrar Blood Corundom/Mithrill.', stat: '+20% Prob. Blood Corundom/Mithrill' },
      { id: 'gem-midas', name: 'Midas Bendecido', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+25% Frecuencia de aparición de Yunque Dorado.', stat: '+25% Frecuencia Yunque Dorado' },
      { id: 'gem-sangre-titan', name: 'Sangre de Titán', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+25% Probabilidad de Shockwave.', stat: '+25% Prob. Shockwave' },
      { id: 'gem-esquirla-mith', name: 'Esquirla de Mithrill', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+30% Cantidad de Polvo Mineral al picar Mithrill.', stat: '+30% Polvo en Mithrill' },
      { id: 'gem-reliquia-oro', name: 'Reliquia de Oro', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '10% de chance de que el Yunque Dorado dure el doble de tiempo.', stat: '10% → Yunque Dorado dura x2' },
      { id: 'gem-magnetismo', name: 'Magnetismo Real', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+25% Probabilidad de obtener +100 Polvo Mineral por mineral roto.', stat: '+25% Chance +100 Polvo/mineral' },
      { id: 'gem-pulso-fuego', name: 'Pulso de Fuego', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: 'Al usar un Yunque Dorado, tu DPC se duplica por 10 segundos.', stat: 'Yunque Dorado → DPC ×2 por 10s' },
      { id: 'gem-aura-dorada', name: 'Aura Dorada', imagePath: '/images/pobs/GemaLegendaria.webp', rarity: 'Gema Legendaria', description: '+15% Prob. de doble mineral al romper (afecta Tier 1 y Tier 2).', stat: '+15% Doble mineral (T1 y T2)' },
      // ─ Binohmanas ─
      { id: 'gem-esencia-bin', name: 'Esencia de Binohmo', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+50% Polvo Mineral por mineral roto (Global).', stat: '+50% Polvo Global' },
      { id: 'gem-fractura', name: 'Fractura de Realidad', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+30% Prob. Shockwave. El Shockwave golpea al mineral 2 veces.', stat: '+30% Shockwave | Shockwave golpea x2' },
      { id: 'gem-ojo-tormenta', name: 'Ojo de la Tormenta', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+35% Frecuencia de Yunque Dorado; los Yunques duran el doble.', stat: '+35% Yunque Dorado | duran x2' },
      { id: 'gem-sangre-cor', name: 'Sangre de Corundom', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+40% Polvo al picar Blood Corundom. ×1.2 bonificación de ese mineral.', stat: '+40% Polvo Blood Corundom | x1.2 bonus' },
      { id: 'gem-genesis', name: 'Génesis', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+50% DPC. −25% Chance Crítico. −10% Mult. Crítico.', stat: '+50% DPC | −25% Crítico, −10% Mult.' },
      { id: 'gem-suerte-creador', name: 'Suerte del Creador', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+30% Chance de encontrar Blood Corundom/Mithrill.', stat: '+30% Prob. Blood Corundom/Mithrill' },
      { id: 'gem-poder-anc', name: 'Poder Ancestral', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: 'Mult. Crítico aumenta +1% por cada nivel de profundidad alcanzado.', stat: '+1% Mult. Crítico por nivel profundidad' },
      { id: 'gem-eco-infinito', name: 'Eco Infinito', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: '+40% Probabilidad de obtener +1 Polvo Mineral por golpe.', stat: '+40% Chance +1 Polvo/golpe' },
      { id: 'gem-martillo-div', name: 'Martillo Divino', imagePath: '/images/pobs/GemaBinohmana.webp', rarity: 'Gema Binohmana', description: 'Cada 1000 clicks, invoca un Yunque Dorado automáticamente.', stat: 'Cada 1000 clicks → Yunque Dorado auto' },
    ]
  },
  {
    id: 'pergaminos', label: 'Pergaminos', icon: '📜', items: [
      { id: 'perg-menor', name: 'Pergamino Menor', imagePath: '/images/pobs/PergMenor.webp', rarity: 'Pergamino', description: 'El pergamino más básico. Cada uno otorga 1 Punto de Habilidad. Puedes acumular hasta 20 en el inventario.', stat: 'Otorga: 1 Punto | Máx. inventario: 20' },
      { id: 'perg-estudio', name: 'Pergamino de Estudio', imagePath: '/images/pobs/Perg.webp', rarity: 'Pergamino', description: 'Un pergamino de mayor densidad arcana. Cada uno otorga 5 Puntos de Habilidad. Solo puedes llevar 6 a la vez.', stat: 'Otorga: 5 Puntos | Máx. inventario: 6' },
      { id: 'perg-dorado', name: 'Pergamino Dorado', imagePath: '/images/pobs/PergDor.webp', rarity: 'Pergamino', description: 'Tejido con hilo de oro antiguo. El más raro de los pergaminos. Otorga 10 Puntos de Habilidad. Solo puedes tener 5 a la vez.', stat: 'Otorga: 10 Puntos | Máx. inventario: 5' },
    ]
  },
];

const SIDEBAR_GROUPS = [
  { label: 'Recursos', ids: ['minerales', 'minerales-miticos'] as WikiSubId[] },
  { label: 'Arsenal', ids: ['armas-t1', 'armas-t2', 'armas-t3', 'armas-miticas'] as WikiSubId[] },
  { label: 'Progresión', ids: ['upgrades', 'habilidades', 'gemas', 'pergaminos'] as WikiSubId[] },
];

const RARITY_COLORS: Record<string, string> = {
  'Tier 1': 'text-gray-300 border-gray-500/30',
  'Tier 2': 'text-blue-300 border-blue-500/30',
  'Tier 3': 'text-red-300 border-red-500/30',
  'Arma Mítica': 'text-rose-300 border-rose-500/30',
  'Mineral Mítico': 'text-rose-300 border-rose-500/30',
  'Pergamino': 'text-emerald-300 border-emerald-500/30',
  'Común': 'text-gray-300 border-gray-500/30',
  'Raro': 'text-blue-300 border-blue-500/30',
  'Épico': 'text-purple-300 border-purple-500/30',
  'Legendario': 'text-amber-300 border-amber-500/30',
  'Mítico': 'text-rose-300 border-rose-500/30',
  'Divino': 'text-yellow-200 border-yellow-500/30',
  'Mejora': 'text-teal-300 border-teal-500/30',
  'Habilidad': 'text-cyan-300 border-cyan-500/30',
  'Gema Común': 'text-gray-400 border-gray-400/30',
  'Gema Poco Común': 'text-green-300 border-green-500/30',
  'Gema Rara': 'text-sky-300 border-sky-500/30',
  'Gema Impresionante': 'text-violet-300 border-violet-500/30',
  'Gema Legendaria': 'text-orange-300 border-orange-500/30',
  'Gema Binohmana': 'text-yellow-300 border-yellow-400/50',
};

// ─── PLACEHOLDER SECTION ─────────────────────────────────────────────────────────
function ComingSoonSection({ title, rune, subtitle }: { title: string; rune: string; subtitle: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center min-h-[40vh]">
      <div
        className="w-20 h-20 rounded-full border border-gold-dark/30 flex items-center justify-center mb-6"
        style={{ background: 'rgba(201,168,76,0.04)', boxShadow: '0 0 40px rgba(201,168,76,0.08) inset' }}
      >
        <span className="text-3xl" style={{ color: 'var(--gold-dark)' }}>{rune}</span>
      </div>
      <span
        className="font-cinzel text-xs tracking-[0.5em] uppercase mb-3"
        style={{ color: 'var(--gold-dark)', opacity: 0.5 }}
      >
        {subtitle}
      </span>
      <h3
        className="font-cinzel text-2xl md:text-3xl font-bold mb-4"
        style={{ color: 'var(--gold-light)' }}
      >
        {title}
      </h3>
      <p className="font-crimson text-lg text-gray-500 max-w-md">
        Esta sección está en construcción. Pronto se revelará su contenido completo.
      </p>
      <div className="flex items-center gap-4 mt-8 opacity-20">
        <div className="h-px w-16" style={{ background: 'var(--gold-dark)' }} />
        <span style={{ color: 'var(--gold-dark)', fontSize: '0.55rem' }}>✦ ✦ ✦</span>
        <div className="h-px w-16" style={{ background: 'var(--gold-dark)' }} />
      </div>
    </div>
  );
}

// ─── TRASCENDENCIAS SECTION ──────────────────────────────────────────────────
const ANCESTRAL_ARMS = [
  {
    id: 'oro',
    label: 'Brazo de Oro',
    color: '#C9A84C',
    glow: 'rgba(201,168,76,0.35)',
    bg: 'rgba(201,168,76,0.06)',
    border: 'rgba(201,168,76,0.3)',
    icon: '◈',
    tag: 'DPC',
    desc: 'Forjado en el núcleo de las primeras minas doradas. Sus 100 nodos otorgan multiplicadores porcentuales alucinantes a tu Daño Por Click, acumulándose de forma exponencial con cada trascendencia.',
    bonus: '+X% Daño Por Click (DPC)',
    nodes: 100,
  },
  {
    id: 'verde',
    label: 'Brazo Verde',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.3)',
    bg: 'rgba(74,222,128,0.05)',
    border: 'rgba(74,222,128,0.25)',
    icon: '❋',
    tag: 'Recursos',
    desc: 'Nacido de las raíces del mundo antiguo. Aumenta directamente la bonificación final de recursos extraídos desde el primer click, maximizando la eficiencia de extracción en todos los tiers.',
    bonus: '+X% Multiplicador Global de Drop',
    nodes: 100,
  },
  {
    id: 'azul',
    label: 'Brazo Azul',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.3)',
    bg: 'rgba(96,165,250,0.05)',
    border: 'rgba(96,165,250,0.25)',
    icon: '◎',
    tag: 'Resistencia',
    desc: 'Canaliza la magia del LAGH para debilitar la estructura molecular de todo mineral futuro. Cada nodo reduce pasivamente la vida máxima de las rocas que encuentres, sin importar el tier.',
    bonus: '-X% Vida de Minerales (pasivo)',
    nodes: 100,
  },
  {
    id: 'violeta',
    label: 'Brazo Violeta',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.3)',
    bg: 'rgba(167,139,250,0.05)',
    border: 'rgba(167,139,250,0.25)',
    icon: '▲',
    tag: 'Comercio',
    desc: 'El poder del mercado ancestral. Otorga descuentos porcentuales inmensas y fijas en los costos de todas las armerías de la Forja, haciendo que cada arma cueste menos en tu nueva run.',
    bonus: '-X% Costos en la Forja',
    nodes: 100,
  },
  {
    id: 'rojo',
    label: 'Brazo Rojo',
    color: '#f87171',
    glow: 'rgba(248,113,113,0.3)',
    bg: 'rgba(248,113,113,0.05)',
    border: 'rgba(248,113,113,0.25)',
    icon: '✸',
    tag: 'Fatalidad',
    desc: 'La sangre del universo cristalizada en poder. Suma valores directos e increíbles a tu multiplicador base de daño Crítico desde los primeros segundos de la partida.',
    bonus: '+X Multiplicador Crítico Base',
    nodes: 100,
  },
];

function TrascendenciasSection() {
  const [selectedArm, setSelectedArm] = useState(0);
  const arm = ANCESTRAL_ARMS[selectedArm];

  return (
    <div className="w-full space-y-16 pb-12">

      {/* ── HERO ── */}
      <div className="relative flex flex-col items-center text-center py-14 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="font-cinzel text-[10px] tracking-[0.6em] uppercase" style={{ color: 'rgba(201,168,76,0.5)' }}>
            Sistema de Prestigio
          </span>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-bold leading-tight"
            style={{ background: 'var(--gradient-gold)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Trascendencias
          </h2>
          <p className="font-crimson text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mt-2">
            Al alcanzar el pico de tu universo, puedes reiniciarlo todo para emerger más fuerte.
            Cada Trascendencia es un renacimiento cósmico. El poder que acumulas nunca desaparece — se transforma.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-8 opacity-20">
          <div className="h-px w-24" style={{ background: 'var(--gold-dark)' }} />
          <span style={{ color: 'var(--gold-dark)', fontSize: '0.5rem' }}>✦ ✦ ✦</span>
          <div className="h-px w-24" style={{ background: 'var(--gold-dark)' }} />
        </div>
      </div>

      {/* ── ¿QUÉ OCURRE AL TRASCENDER? ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--gold-dark)' }}>Al Trascender</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pierdes */}
          <div
            className="p-6 border rounded-sm space-y-4"
            style={{ background: 'rgba(248,113,113,0.03)', borderColor: 'rgba(248,113,113,0.15)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl" style={{ color: '#f87171' }}>✗</span>
              <span className="font-cinzel text-sm font-bold tracking-wider uppercase" style={{ color: '#f87171' }}>Lo que se reinicia</span>
            </div>
            {[
              { icon: '◈', text: 'Recursos mineros acumulados' },
              { icon: '⚔', text: 'Armas forjadas en la Forja' },
              { icon: '▲', text: 'Mejoras (Upgrades) compradas' },
              { icon: '↓', text: 'Profundidad de mina (vuelve al Nivel 1)' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xs w-4 text-center opacity-40" style={{ color: '#f87171' }}>{item.icon}</span>
                <span className="font-crimson text-base text-gray-400">{item.text}</span>
              </div>
            ))}
          </div>
          {/* Ganas */}
          <div
            className="p-6 border rounded-sm space-y-4"
            style={{ background: 'rgba(201,168,76,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl" style={{ color: 'var(--gold)' }}>✦</span>
              <span className="font-cinzel text-sm font-bold tracking-wider uppercase" style={{ color: 'var(--gold-light)' }}>Lo que conservas y ganas</span>
            </div>
            {[
              { icon: '◈', text: 'Nivel de Ascendencia (+1 permanente)' },
              { icon: '↑', text: '+75 niveles de profundidad disponibles' },
              { icon: '★', text: 'Rango sube (hasta Rango 100 · Maestría Máxima)' },
              { icon: '❋', text: 'Puntos Ancestrales para el Árbol Permanente' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xs w-4 text-center" style={{ color: 'var(--gold-dark)' }}>{item.icon}</span>
                <span className="font-crimson text-base text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ÁRBOL ANCESTRAL ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--gold-dark)' }}>Árbol Ancestral · NG+</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </div>
        <p className="font-crimson text-base text-gray-500 text-center mb-8 max-w-2xl mx-auto">
          A partir de la segunda Run, obtendrás <span style={{ color: 'var(--gold-light)' }}>Puntos Ancestrales</span> cada 3 niveles minados.
          Úsalos para desbloquear nodos en este árbol permanente de 5 caminos.
        </p>

        {/* Selector de brazos */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ANCESTRAL_ARMS.map((a, idx) => (
            <button
              key={a.id}
              onClick={() => setSelectedArm(idx)}
              className="px-4 py-2 text-xs font-cinzel tracking-wider uppercase border transition-all duration-300 rounded-sm"
              style={{
                background: selectedArm === idx ? a.bg : 'transparent',
                borderColor: selectedArm === idx ? a.color : 'rgba(255,255,255,0.08)',
                color: selectedArm === idx ? a.color : 'rgba(255,255,255,0.35)',
                boxShadow: selectedArm === idx ? `0 0 18px ${a.glow}` : 'none',
              }}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        {/* Panel del brazo seleccionado */}
        <motion.div
          key={arm.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-8 border rounded-sm"
          style={{ background: arm.bg, borderColor: arm.border, boxShadow: `0 0 40px ${arm.glow}` }}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-2xl border"
              style={{ background: `radial-gradient(ellipse, ${arm.glow} 0%, transparent 70%)`, borderColor: arm.border, color: arm.color }}
            >
              {arm.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-cinzel text-xl font-bold" style={{ color: arm.color }}>{arm.label}</h3>
                <span
                  className="text-[10px] font-cinzel tracking-widest uppercase px-2 py-0.5 border rounded-sm"
                  style={{ color: arm.color, borderColor: arm.border, background: `${arm.glow}` }}
                >{arm.tag}</span>
              </div>
              <p className="font-crimson text-base text-gray-300 leading-relaxed mb-4">{arm.desc}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  className="flex items-center gap-2 px-4 py-2 border rounded-sm"
                  style={{ borderColor: arm.border, background: 'rgba(0,0,0,0.3)' }}
                >
                  <span className="font-cinzel text-xs" style={{ color: arm.color }}>Efecto:</span>
                  <span className="font-cinzel text-xs font-bold" style={{ color: arm.color }}>{arm.bonus}</span>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-2 border rounded-sm"
                  style={{ borderColor: arm.border, background: 'rgba(0,0,0,0.3)' }}
                >
                  <span className="font-cinzel text-xs opacity-60" style={{ color: arm.color }}>Nodos:</span>
                  <span className="font-cinzel text-xs font-bold" style={{ color: arm.color }}>{arm.nodes} nodos</span>
                </div>
              </div>
            </div>
          </div>
          {/* Barra de nodos visual */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: arm.border }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-cinzel text-[10px] tracking-widest uppercase opacity-50" style={{ color: arm.color }}>Progresión de nodos</span>
              <span className="font-cinzel text-[10px]" style={{ color: arm.color }}>0 / {arm.nodes}</span>
            </div>
            <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: '0%', background: `linear-gradient(90deg, ${arm.color}, ${arm.glow})`, boxShadow: `0 0 8px ${arm.glow}` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-cinzel text-[9px] opacity-30" style={{ color: arm.color }}>Nodo 1</span>
              <span className="font-cinzel text-[9px] opacity-30" style={{ color: arm.color }}>Nodo 100</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── ORBE DE TRASCENDENCIA ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--gold-dark)' }}>Multiplicador Ancestral</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </div>

        <div
          className="relative p-8 md:p-10 border overflow-hidden rounded-sm"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, rgba(0,0,0,0) 70%), rgba(5,5,5,0.9)', borderColor: 'rgba(201,168,76,0.25)' }}
        >
          {/* Glow aura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: '0 0 80px rgba(201,168,76,0.08) inset' }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Orb visual */}
            <div className="flex-shrink-0 relative">
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl border-2"
                style={{
                  background: 'radial-gradient(ellipse, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.04) 50%, transparent 70%)',
                  borderColor: 'rgba(201,168,76,0.35)',
                  boxShadow: '0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.08)',
                  animation: 'orbPulse 3s ease-in-out infinite',
                }}
              >
                ◈
              </div>
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.3) 0%, transparent 70%)', filter: 'blur(12px)' }}
              />
            </div>
            {/* Texto */}
            <div className="flex-1 text-center md:text-left">
              <span className="font-cinzel text-[10px] tracking-[0.5em] uppercase opacity-50" style={{ color: 'var(--gold-dark)' }}>El Orbe Central</span>
              <h3 className="font-cinzel text-2xl md:text-3xl font-bold mt-1 mb-3" style={{ color: 'var(--gold-light)' }}>
                El Multiplicador Ancestral
              </h3>
              <p className="font-crimson text-base text-gray-300 leading-relaxed mb-5">
                Al reclamar el <span style={{ color: 'var(--gold)' }}>Orbe de Trascendencia</span> en tu nueva run se activa el
                Multiplicador Ancestral: un buff colosal e inamovible que escala con cada nivel de Ascendencia que ya poseas.
              </p>
              <div
                className="inline-flex items-center gap-3 px-6 py-3 border"
                style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.3)' }}
              >
                <span style={{ color: 'var(--gold-dark)' }}>✦</span>
                <div>
                  <span className="font-cinzel text-xs opacity-50 block" style={{ color: 'var(--gold-dark)' }}>Multiplicador por nivel de Ascendencia</span>
                  <span className="font-cinzel text-lg font-bold" style={{ color: 'var(--gold-light)' }}>×18.000.000.000</span>
                </div>
              </div>
              <p className="font-crimson text-sm text-gray-500 mt-4">
                Este multiplicador se aplica a tu daño total y se acumula por <em>cada</em> nivel de Ascendencia.
                Es la fuente de poder predilecta para desafiar el vacío y volver a forjar la Espada de Binohmo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SISTEMA DE RANGOS ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--gold-dark)' }}>Escalada de Rango</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { range: 'Rango 1', label: 'Primera Partida', desc: 'El inicio de tu leyenda. Sin Ascendencias previas.', color: '#9ca3af', glow: 'rgba(156,163,175,0.2)' },
            { range: 'Rango 2–99', label: 'Ascenso Continuo', desc: 'Cada trascendencia sube un rango. Efectos visuales únicos por tier.', color: '#C9A84C', glow: 'rgba(201,168,76,0.2)' },
            { range: 'Rango 100', label: 'Maestría Máxima', desc: 'La cima. Efectos místicos y arco iris legendarios. El pico absoluto.', color: '#e879f9', glow: 'rgba(232,121,249,0.3)' },
          ].map(r => (
            <div
              key={r.range}
              className="p-6 border rounded-sm text-center"
              style={{ background: `radial-gradient(ellipse at 50% 0%, ${r.glow} 0%, transparent 60%), rgba(5,5,5,0.8)`, borderColor: `${r.color}40` }}
            >
              <div
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-sm border font-cinzel font-bold"
                style={{ color: r.color, borderColor: `${r.color}60`, background: `${r.glow}`, boxShadow: `0 0 20px ${r.glow}` }}
              >
                ★
              </div>
              <span className="font-cinzel text-[10px] tracking-wider uppercase opacity-60 block mb-1" style={{ color: r.color }}>{r.range}</span>
              <h4 className="font-cinzel text-sm font-bold mb-2" style={{ color: r.color }}>{r.label}</h4>
              <p className="font-crimson text-sm text-gray-500 leading-snug">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.08); }
          50% { box-shadow: 0 0 60px rgba(201,168,76,0.35), 0 0 120px rgba(201,168,76,0.15); }
        }
      `}</style>
    </div>
  );
}

// ─── CONDENSADORA SECTION ───────────────────────────────────────────────────
const CATALYSTS = [
  { name: 'Hierro', luck: 5, color: '#9ca3af', note: '' },
  { name: 'Esmeralda', luck: 8, color: '#4ade80', note: '' },
  { name: 'Diamante', luck: 12, color: '#93c5fd', note: '' },
  { name: 'Stellar Saphirus', luck: 16, color: '#818cf8', note: '' },
  { name: 'Crimson Obsidian', luck: 20, color: '#f87171', note: '' },
  { name: 'Mithrill', luck: 25, color: '#e2e8f0', note: '' },
  { name: 'Blood Corundom', luck: 35, color: '#dc2626', note: '★ Bonus extra a rarezas altas' },
];

const GEM_RARITIES = [
  { rarity: 'Común', prob: 50, color: '#9ca3af', bar: '#6b7280' },
  { rarity: 'Poco Común', prob: 25, color: '#4ade80', bar: '#16a34a' },
  { rarity: 'Rara', prob: 14, color: '#60a5fa', bar: '#2563eb' },
  { rarity: 'Impresionante', prob: 7, color: '#a78bfa', bar: '#7c3aed' },
  { rarity: 'Legendaria', prob: 3, color: '#fbbf24', bar: '#d97706' },
  { rarity: 'Binohmana', prob: 1, color: '#f0abfc', bar: '#c026d3' },
];

const STEPS = [
  {
    num: '01',
    title: 'Cargar el Tanque de Polvo',
    icon: '⬡',
    color: '#C9A84C',
    desc: 'Clickeá sobre el Tanque en la interfaz. Carga hasta 500 unidades de tu Polvo Mineral acumulado. El tanque debe llegar a 500/500 para poder activar la máquina. Podés hacer múltiples cargas parciales.',
  },
  {
    num: '02',
    title: 'Insertar el Ore de Catálisis',
    icon: '◈',
    color: '#60a5fa',
    desc: 'Clickeá la prensa central. Se abre un panel con todos tus ores raros con ≥100 unidades. Elegir uno consume exactamente 100 unidades y actúa como catalizador que inclina las probabilidades de rareza.',
  },
  {
    num: '03',
    title: 'Activar la Palanca',
    icon: '▼',
    color: '#a78bfa',
    desc: 'Con el tanque lleno Y el ore insertado se habilita la Palanca. Al activarla, la máquina entra en su ciclo de condensación con efectos visuales y sonoros. Tras unos segundos, se revela una Gema al azar.',
  },
  {
    num: '04',
    title: 'Recoger la Gema',
    icon: '◆',
    color: '#4ade80',
    desc: 'La gema se muestra con nombre, rareza y efecto. Clickeá "Recoger" para añadirla al inventario. La máquina se resetea y podés iniciar un nuevo ciclo de condensación.',
  },
];

function CondensadoraSection() {
  const [selectedCatalyst, setSelectedCatalyst] = useState(6); // Blood Corundom por defecto
  const cat = CATALYSTS[selectedCatalyst];

  return (
    <div className="w-full space-y-16 pb-12">

      {/* ── HERO ── */}
      <div className="relative flex flex-col items-center text-center py-14 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(96,165,250,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="font-cinzel text-[10px] tracking-[0.6em] uppercase" style={{ color: 'rgba(96,165,250,0.5)' }}>
            Profundidad 30 · La Costa de las Almas
          </span>
          <h2
            className="font-cinzel text-4xl md:text-5xl font-bold leading-tight"
            style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f0abfc 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            La Condensadora
          </h2>
          <p className="font-crimson text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mt-2">
            Una máquina alquímica que convierte <span style={{ color: '#60a5fa' }}>Polvo Mineral</span> y{' '}
            <span style={{ color: '#a78bfa' }}>Ores Raros</span> en{' '}
            <span style={{ color: '#f0abfc' }}>Gemas de Efecto</span> únicos, encastrables en los Sockets de tus armas.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-8 opacity-20">
          <div className="h-px w-24" style={{ background: '#60a5fa' }} />
          <span style={{ color: '#60a5fa', fontSize: '0.5rem' }}>◆ ◆ ◆</span>
          <div className="h-px w-24" style={{ background: '#60a5fa' }} />
        </div>
      </div>

      {/* ── POLVO MINERAL ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: '#60a5fa' }}>¿Qué es el Polvo Mineral?</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.3), transparent)' }} />
        </div>
        <div
          className="p-6 md:p-8 border rounded-sm"
          style={{ background: 'rgba(96,165,250,0.04)', borderColor: 'rgba(96,165,250,0.2)' }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div
              className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-2xl border"
              style={{ background: 'rgba(96,165,250,0.1)', borderColor: 'rgba(96,165,250,0.3)', color: '#60a5fa', boxShadow: '0 0 24px rgba(96,165,250,0.2)' }}
            >
              ⬡
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold mb-2" style={{ color: '#93c5fd' }}>Recurso Secundario · Combustible de la Máquina</h3>
              <p className="font-crimson text-base text-gray-300 leading-relaxed mb-4">
                El Polvo Mineral se acumula automáticamente cada vez que rompés <strong style={{ color: '#60a5fa' }}>ores raros de Tier 2</strong>:
                Esmeralda, Diamante, Saphirus, Crimson Obsidian, Mithrill y Blood Corundom.
                Cuanto más valioso y difícil de romper sea el ore, más polvo genera por golpe.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Esmeralda', 'Diamante', 'Saphirus', 'Crimson Obsidian', 'Mithrill', 'Blood Corundom'].map(o => (
                  <span
                    key={o}
                    className="text-[11px] font-cinzel px-3 py-1 border rounded-sm"
                    style={{ color: '#60a5fa', borderColor: 'rgba(96,165,250,0.25)', background: 'rgba(96,165,250,0.06)' }}
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PASOS ── */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: '#a78bfa' }}>Cómo usar la Condensadora</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(167,139,250,0.3), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="p-6 border rounded-sm relative overflow-hidden"
              style={{ background: `rgba(0,0,0,0.4)`, borderColor: `${step.color}25` }}
            >
              <div
                className="absolute top-0 right-0 font-cinzel text-6xl font-black opacity-[0.04] select-none pointer-events-none"
                style={{ color: step.color, lineHeight: 1 }}
              >
                {step.num}
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm border flex-shrink-0"
                    style={{ color: step.color, borderColor: `${step.color}50`, background: `${step.color}12` }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <span className="font-cinzel text-[10px] opacity-50" style={{ color: step.color }}>Paso {step.num}</span>
                    <h4 className="font-cinzel text-sm font-bold" style={{ color: step.color }}>{step.title}</h4>
                  </div>
                </div>
                <p className="font-crimson text-base text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ORE CATALIZADOR ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: '#60a5fa' }}>Ore Catalizador · Bonus de Suerte</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(96,165,250,0.3), transparent)' }} />
        </div>
        <p className="font-crimson text-base text-gray-500 text-center mb-6 max-w-xl mx-auto">
          El ore que insertés en la prensa actúa como catalizador. A más suerte, mayor chance de gemas de alta rareza.
        </p>

        {/* Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATALYSTS.map((c, idx) => (
            <button
              key={c.name}
              onClick={() => setSelectedCatalyst(idx)}
              className="px-3 py-1.5 text-[11px] font-cinzel tracking-wide border transition-all duration-250 rounded-sm"
              style={{
                background: selectedCatalyst === idx ? `${c.color}18` : 'transparent',
                borderColor: selectedCatalyst === idx ? c.color : 'rgba(255,255,255,0.08)',
                color: selectedCatalyst === idx ? c.color : 'rgba(255,255,255,0.3)',
                boxShadow: selectedCatalyst === idx ? `0 0 14px ${c.color}40` : 'none',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Panel */}
        <motion.div
          key={cat.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 border rounded-sm"
          style={{ background: `${cat.color}08`, borderColor: `${cat.color}35`, boxShadow: `0 0 30px ${cat.color}20` }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl border"
              style={{ color: cat.color, borderColor: `${cat.color}50`, background: `${cat.color}15`, boxShadow: `0 0 20px ${cat.color}30` }}
            >
              ◈
            </div>
            <div className="flex-1">
              <h4 className="font-cinzel text-base font-bold mb-1" style={{ color: cat.color }}>{cat.name}</h4>
              {cat.note && (
                <span className="font-cinzel text-[10px] tracking-wider uppercase px-2 py-0.5 border rounded-sm mb-2 inline-block" style={{ color: cat.color, borderColor: `${cat.color}40`, background: `${cat.color}10` }}>
                  {cat.note}
                </span>
              )}
              <div className="flex items-center gap-3 mt-1">
                <span className="font-cinzel text-xs opacity-60" style={{ color: cat.color }}>Bonus de Suerte:</span>
                <span className="font-cinzel text-lg font-black" style={{ color: cat.color }}>+{cat.luck}%</span>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(cat.luck / 35) * 100}%`, background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})`, boxShadow: `0 0 8px ${cat.color}60` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-cinzel text-[9px] opacity-30" style={{ color: cat.color }}>+5%</span>
                <span className="font-cinzel text-[9px] opacity-30" style={{ color: cat.color }}>+35% (máx)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── PROBABILIDADES DE RAREZA ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: '#a78bfa' }}>Probabilidades de Rareza · Sin Suerte</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(167,139,250,0.3), transparent)' }} />
        </div>
        <div className="space-y-3">
          {GEM_RARITIES.map(g => (
            <div key={g.rarity} className="flex items-center gap-4">
              <div className="w-28 flex-shrink-0">
                <span className="font-cinzel text-xs font-bold" style={{ color: g.color }}>{g.rarity}</span>
              </div>
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${g.prob * 2}%`, background: `linear-gradient(90deg, ${g.bar}80, ${g.bar})`, boxShadow: `0 0 6px ${g.bar}60` }}
                />
              </div>
              <div className="w-10 text-right">
                <span className="font-cinzel text-xs font-bold" style={{ color: g.color }}>{g.prob}%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="font-crimson text-sm text-gray-600 text-center mt-4">
          La Suerte del ore catalizador reduce Común/Poco Común y eleva Impresionante/Legendaria/Binohmana.
        </p>
      </div>

      {/* ── SOCKETS ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.3))' }} />
          <span className="font-cinzel text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--gold-dark)' }}>Inventario · Sockets de Armas</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(251,191,36,0.3), transparent)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 border rounded-sm" style={{ background: 'rgba(201,168,76,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: 'var(--gold)' }} className="text-xl">◆</span>
              <h4 className="font-cinzel text-sm font-bold" style={{ color: 'var(--gold-light)' }}>Inventario de Gemas</h4>
            </div>
            <p className="font-crimson text-base text-gray-400 leading-relaxed">
              Las gemas obtenidas se guardan en tu inventario, visible dentro de la Condensadora.
              Desde ahí podés gestionarlas y ver sus efectos antes de encastrarlas.
            </p>
          </div>
          <div className="p-6 border rounded-sm" style={{ background: 'rgba(201,168,76,0.03)', borderColor: 'rgba(201,168,76,0.15)' }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: 'var(--gold)' }} className="text-xl">⬡</span>
              <h4 className="font-cinzel text-sm font-bold" style={{ color: 'var(--gold-light)' }}>Sockets en la Forja</h4>
            </div>
            <p className="font-crimson text-base text-gray-400 leading-relaxed">
              Andá a la Forja, seleccioná un arma comprada y encastrá gemas en sus ranuras.
              Cada arma tiene <strong style={{ color: 'var(--gold)' }}>0 a 5 sockets</strong> según su nivel máximo de mejora.
              Los efectos solo están activos mientras ese arma esté <strong style={{ color: 'var(--gold)' }}>equipada</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* ── SINERGIA CONJURADOR ── */}
      <div
        className="p-6 md:p-8 border rounded-sm"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(167,139,250,0.06) 0%, transparent 70%)', borderColor: 'rgba(167,139,250,0.2)' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xl" style={{ color: '#a78bfa' }}>✦</span>
          <h4 className="font-cinzel text-sm font-bold tracking-wider uppercase" style={{ color: '#a78bfa' }}>Sinergia · Camino del Conjurador</h4>
        </div>
        <p className="font-crimson text-base text-gray-400 mb-5 leading-relaxed">
          Si elegiste el camino del Conjurador en el árbol de habilidades, tenés acceso a dos skills que potencian directamente la Condensadora:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'Sabiduría del Sabio', effect: '+25% Polvo Mineral generado globalmente por cada mineral roto.', icon: '◎' },
            { name: 'Destilación de Gemas', effect: '+75% probabilidad de Gemas Impresionante, Legendaria o Binohmana.', icon: '◆' },
          ].map(s => (
            <div key={s.name} className="flex items-start gap-3 p-4 border rounded-sm" style={{ borderColor: 'rgba(167,139,250,0.2)', background: 'rgba(167,139,250,0.04)' }}>
              <span className="text-lg mt-0.5 flex-shrink-0" style={{ color: '#a78bfa' }}>{s.icon}</span>
              <div>
                <span className="font-cinzel text-xs font-bold block mb-1" style={{ color: '#c4b5fd' }}>{s.name}</span>
                <span className="font-crimson text-sm text-gray-400">{s.effect}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── BACKGROUND EFECTO MITOLÓGICO ───────────────────────────────────────────
function MythicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; baseSize: number; angle: number; rotSpeed: number; glowPhase: number }[] = [];
    let animationFrameId: number;

    // Pre-render the complex glowing diamond ONCE to an off-screen canvas
    // Real-time shadowBlur is computationally very expensive
    const offCanvas = document.createElement('canvas');
    const offSize = 40;
    offCanvas.width = offSize;
    offCanvas.height = offSize;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      const r = 8;
      offCtx.translate(offSize / 2, offSize / 2);
      offCtx.beginPath();
      offCtx.moveTo(0, -r);
      offCtx.lineTo(r / 2, 0);
      offCtx.lineTo(0, r);
      offCtx.lineTo(-r / 2, 0);
      offCtx.closePath();
      offCtx.fillStyle = '#C9A84C';
      offCtx.shadowColor = 'rgba(201, 168, 76, 0.8)';
      offCtx.shadowBlur = r * 1.5;
      offCtx.fill();
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight * 1.5, document.documentElement.scrollHeight);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Max 80 particles to prevent N^2 loop and render overload on very long scroll pages
      const numParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 40000));
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() * -0.2) - 0.05,
          baseSize: Math.random() * 1.2 + 0.5,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.015,
          glowPhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const maxDist = 130;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.rotSpeed;
        p.glowPhase += 0.012;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Trazar constelaciones (líneas doradas muy tenues)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          // Optimization: early exit on X axis before calculating square root
          if (Math.abs(dx) > maxDist) continue;

          const dy = p.y - p2.y;
          if (Math.abs(dy) > maxDist) continue;

          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDist) * 0.1;
            ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Variar brillo
        const alpha = 0.2 + Math.abs(Math.sin(p.glowPhase)) * 0.5;
        const currentSize = p.baseSize * (1 + Math.abs(Math.sin(p.glowPhase)) * 0.3);

        // Render pre-calculated diamond
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = alpha;

        // 8 is the base radius of the pre-rendered diamond
        const scale = (currentSize * 2) / 8;
        ctx.scale(scale, scale);
        // Draw centered
        ctx.drawImage(offCanvas, -offSize / 2, -offSize / 2);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(document.body);

    resize();
    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Fondo de ruido y viñeta sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none" />

      {/* Efecto Canvas Ores/Partículas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function PeakOfBinohmoSwordPage() {
  const [activeMain, setActiveMain] = useState<MainSectionId>('descubre');
  const [activeWikiSub, setActiveWikiSub] = useState<WikiSubId>('minerales');
  const activeSub = WIKI_SUBSECTIONS.find(s => s.id === activeWikiSub)!;
  const wikiTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wikiTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeWikiSub]);

  return (
    <div className="min-h-screen relative" style={{ background: '#050505' }}>
      <MythicBackground />

      {/* ═══ HERO BANNER ═══════════════════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(260px, 35vh, 420px)', marginTop: '72px' }}
      >
        <img
          src="/images/pobs/CosmosFinal.jpeg"
          alt="Peak of Binohmo Sword"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.4) saturate(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/25 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60 z-10" />

        {/* Línea dorada superior */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, #FFD700, #C9A84C, transparent)' }} />

        {/* Contenido Hero */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <span
            className="font-cinzel text-xs md:text-sm tracking-[0.5em] uppercase mb-3 px-6 py-1.5 border"
            style={{ color: 'rgba(139,105,20,0.9)', borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            Videojuego · Tierras Sagradas
          </span>
          <h1
            className="font-cinzel font-black uppercase tracking-[0.08em] leading-none"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
              background: 'linear-gradient(135deg, #8B6914 0%, #C9A84C 28%, #FFD700 50%, #C9A84C 72%, #8B6914 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shine 4s linear infinite',
              filter: 'drop-shadow(0 0 25px rgba(201,168,76,0.25))',
            }}
          >
            Peak of Binohmo Sword
          </h1>
          <p className="font-crimson mt-3 text-lg md:text-xl opacity-60" style={{ color: 'var(--gold-light)' }}>
            Forja la espada legendaria. Asciende al pico del poder.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] z-20"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
      </div>

      {/* ═══ STATS BAR ═════════════════════════════════════════════════════════ */}
      <div className="flex justify-center px-6">
        <div
          className="flex flex-wrap justify-center gap-px border border-gold-dark/20 overflow-hidden"
          style={{ background: 'rgba(5,5,5,0.98)', maxWidth: '860px', width: '100%' }}
        >
          {[
            { label: 'Género', value: 'Clicker · Incremental' },
            { label: 'Mundos', value: '3 Reinos' },
            { label: 'Armas', value: '36+ Únicas' },
            { label: 'Estado', value: 'Completado' },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-6 py-3 flex-1 min-w-[110px]"
              style={{ background: 'rgba(10,10,10,0.8)', borderRight: i < 3 ? '1px solid rgba(201,168,76,0.08)' : 'none' }}
            >
              <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--gold-dark)' }}>
                {stat.label}
              </span>
              <span className="font-cinzel text-sm mt-1 font-bold" style={{ color: 'var(--gold-light)' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ NAVEGACIÓN PRINCIPAL — "LOSAS RÚNICAS" ════════════════════════════ */}
      {/*
        Diseño: 5 losas verticales conectadas por una línea central.
        Cada losa tiene proporción vertical, con la runa arriba, el nombre al centro
        y un subtítulo abajo. La activa se "enciende" con glow dorado.
        En mobile se vuelve un carrusel horizontal scrolleable.
      */}
      <div id="secciones-nav" className="max-w-[1100px] mx-auto px-4 md:px-8 mt-14 mb-2">

        {/* Contenedor del rail rúnico */}
        <div className="relative flex items-stretch justify-center gap-0">

          {/* Línea horizontal central (decorativa) */}
          <div
            className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 pointer-events-none hidden md:block"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15) 15%, rgba(201,168,76,0.15) 85%, transparent)' }}
          />

          {/* Cada losa */}
          {MAIN_SECTIONS.map((sec, idx) => {
            const isActive = activeMain === sec.id;
            return (
              <React.Fragment key={sec.id}>
                {/* Conector entre losas */}
                {idx > 0 && (
                  <div className="hidden md:flex items-center justify-center w-6 flex-shrink-0 relative">
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: isActive || activeMain === MAIN_SECTIONS[idx - 1].id ? 'var(--gold-dark)' : 'rgba(201,168,76,0.2)' }}
                    />
                  </div>
                )}

                <button
                  onClick={() => setActiveMain(sec.id)}
                  className="relative group flex flex-col items-center justify-center outline-none cursor-pointer transition-all duration-400 flex-1 min-w-0"
                  style={{
                    padding: 'clamp(20px, 3vw, 32px) clamp(10px, 2vw, 20px)',
                    border: `1px solid ${isActive ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.1)'}`,
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)'
                      : 'rgba(8,8,8,0.7)',
                    boxShadow: isActive ? '0 0 40px rgba(201,168,76,0.12) inset, 0 0 20px rgba(201,168,76,0.06)' : 'none',
                    transition: 'all 0.35s ease',
                  }}
                >
                  {/* Runa / Icono */}
                  <span
                    className="text-2xl mb-3 transition-all duration-300"
                    style={{
                      color: isActive ? 'var(--gold-light)' : 'rgba(139,105,20,0.45)',
                      textShadow: isActive ? '0 0 20px rgba(201,168,76,0.6)' : 'none',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {sec.rune}
                  </span>

                  {/* Nombre */}
                  <span
                    className="font-cinzel font-bold text-center leading-tight transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--gold-light)' : 'rgba(180,155,100,0.45)',
                    }}
                  >
                    {sec.label}
                  </span>

                  {/* Subtítulo */}
                  <span
                    className="font-cinzel text-center mt-1 hidden md:block"
                    style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: isActive ? 'rgba(201,168,76,0.5)' : 'rgba(139,105,20,0.25)',
                    }}
                  >
                    {sec.subtitle}
                  </span>

                  {/* Indicador activo inferior */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-400"
                    style={{
                      width: isActive ? '40%' : '0%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                    }}
                  />

                  {/* Hover glow (solo inactivos) */}
                  {!isActive && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'rgba(201,168,76,0.024)' }}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Separador ornamental debajo del rail */}
        <div className="flex items-center justify-center gap-4 mt-4 opacity-25">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dark))' }} />
          <span style={{ color: 'var(--gold-dark)', fontSize: '0.55rem' }}>✦ ✦ ✦</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, var(--gold-dark))' }} />
        </div>
      </div>

      {/* ═══ CONTENIDO DE SECCIONES ════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >

            {/* ─── DESCUBRE ─────────────────────────────────────────────── */}
            {activeMain === 'descubre' && (
              <div className="w-full">

                {/* ══ 1. LOGO + GANCHO PRINCIPAL ══ */}
                <div className="flex flex-col items-center text-center pt-4 pb-16 border-b border-gold-dark/10">
                  {/* Logo */}
                  <div className="relative mb-8">
                    <div
                      className="absolute inset-0 rounded-full blur-2xl"
                      style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.18) 0%, transparent 70%)' }}
                    />
                    <img
                      src="/images/pobs/logo.webp"
                      alt="Peak of Binohmo Sword Logo"
                      className="relative z-10 h-40 md:h-52 w-auto object-contain drop-shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>

                  <span className="font-cinzel text-xs tracking-[0.55em] uppercase mb-4" style={{ color: 'var(--gold-dark)', opacity: 0.6 }}>
                    Un Videojuego de Tierras Sagradas
                  </span>

                  <h2
                    className="font-cinzel font-black uppercase max-w-3xl mb-6 leading-[1.1]"
                    style={{
                      fontSize: 'clamp(1.7rem, 4vw, 3.2rem)',
                      background: 'var(--gradient-gold)', backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Rompe. Forja. Asciende.<br />Alcanza la Cumbre.
                  </h2>

                  <p className="font-crimson text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed opacity-80">
                    Un juego incremental de <strong className="text-gold-light">minería y forja</strong> donde cada golpe te acerca un paso más a la espada más legendaria que jamás existió.
                  </p>
                </div>

                {/* ══ 2. LOOP PRINCIPAL — 3 PASOS ══ */}
                <div className="py-16 border-b border-gold-dark/10">
                  <div className="text-center mb-12">
                    <span className="font-cinzel text-xs tracking-[0.5em] uppercase" style={{ color: 'var(--gold-dark)', opacity: 0.55 }}>El Ciclo Sagrado</span>
                    <h3 className="font-cinzel text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--gold-light)' }}>
                      Así se juega
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl mx-auto">
                    {[
                      {
                        num: '01',
                        icon: '◈',
                        title: 'Rompe Minerales',
                        body: 'Golpea rocas para extraer minerales de distintas raridades. Cada veta es un tesoro escondido esperando ser revelado. Cuanto más profundo vayas, más valiosa la recompensa.',
                        accent: '#C9A84C',
                      },
                      {
                        num: '02',
                        icon: '⚒',
                        title: 'Forja Armas',
                        body: 'Combina los minerales recolectados en la forja para crear armas poderosas. Avanza por tres Tiers de forja, cada uno más exigente y más glorioso que el anterior.',
                        accent: '#E8C96A',
                      },
                      {
                        num: '03',
                        icon: '▲',
                        title: 'Asciende',
                        body: 'Desbloquea habilidades, compra upgrades y viaja a nuevos mundos con minerales únicos. Cada ascenso te lleva más cerca del objetivo final: la Binohmo Sword.',
                        accent: '#FFD700',
                      },
                    ].map((step, i) => (
                      <div
                        key={step.num}
                        className="relative flex flex-col items-center text-center px-8 py-10 group"
                        style={{
                          borderLeft: i > 0 ? '1px solid rgba(201,168,76,0.08)' : 'none',
                          background: 'rgba(8,8,8,0.4)',
                        }}
                      >
                        {/* Número de paso */}
                        <span
                          className="font-cinzel font-black absolute top-6 right-8 opacity-10 select-none"
                          style={{ fontSize: '4rem', color: step.accent, lineHeight: 1 }}
                        >
                          {step.num}
                        </span>

                        {/* Icono */}
                        <div
                          className="w-16 h-16 rounded-full border flex items-center justify-center mb-5 flex-shrink-0 relative z-10 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
                          style={{ borderColor: 'rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.04)' }}
                        >
                          <span className="text-2xl" style={{ color: step.accent }}>{step.icon}</span>
                        </div>

                        <h4 className="font-cinzel font-bold text-lg mb-3 relative z-10" style={{ color: step.accent }}>
                          {step.title}
                        </h4>
                        <p className="font-crimson text-base text-gray-400 leading-relaxed relative z-10">
                          {step.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ══ 3. LOS 3 MUNDOS ══ */}
                <div className="py-16 border-b border-gold-dark/10">
                  <div className="text-center mb-12">
                    <span className="font-cinzel text-xs tracking-[0.5em] uppercase" style={{ color: 'var(--gold-dark)', opacity: 0.55 }}>La Travesía</span>
                    <h3 className="font-cinzel text-2xl md:text-3xl font-bold mt-2" style={{ color: 'var(--gold-light)' }}>
                      Los 3 Mundos
                    </h3>
                    <p className="font-crimson text-lg text-gray-500 mt-3 max-w-xl mx-auto">
                      Cada mundo trae minerales únicos, armas más poderosas y desafíos más profundos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                      {
                        num: 'I',
                        name: 'Minas Doradas',
                        sub: 'Riquezas ocultas en las venas del mundo',
                        desc: 'Un reino de luz y oro mineral. Extrae los materiales básicos y descubre las vetas más puras de las tierras superficiales. Aquí comienza la leyenda de todo forjador.',
                        tags: ['Hierro', 'Cobre', 'Plata', 'T1–T2'],
                        color: 'rgba(201,168,76,0.5)',
                        borderColor: 'rgba(201,168,76,0.25)',
                        animate: false
                      },
                      {
                        num: 'II',
                        name: 'La Costa de las Almas',
                        sub: 'Susurros perdidos en la marea etérea',
                        desc: 'Un reino etéreo donde los cristales resuenan con una energía azulada única. Aquí el aire es frío y el mithrill brota de arenas que parecen cantar.',
                        tags: ['Mithrill', 'Esmeralda', 'Diamante'],
                        color: 'rgba(0,180,216,0.5)',
                        borderColor: 'rgba(0,180,216,0.25)',
                        animate: 'animate-pulse-cyan-blue'
                      },
                      {
                        num: 'III',
                        name: 'Volkagh',
                        sub: 'Ciudad de fuego esculpida en piedra profunda',
                        desc: 'Una ciudad forjada en las entrañas de una cueva titánica. Rodeada de ríos de lava pura, es el santuario de los Minerales Míticos y la Forja Divina.',
                        tags: ['Minerales Míticos', 'Forja Divina', 'Armas Míticas'],
                        color: 'rgba(230,57,70,0.5)',
                        borderColor: 'rgba(230,57,70,0.25)',
                        animate: 'animate-pulse-red-orange'
                      },
                    ].map((world) => (
                      <div
                        key={world.num}
                        className={`relative flex flex-col border overflow-hidden group hover:border-opacity-60 transition-all duration-400 ${world.animate || ''}`}
                        style={{ background: 'rgba(6,6,6,0.8)', borderColor: world.borderColor }}
                      >
                        {/* Número grande de fondo */}
                        <div
                          className="absolute top-0 right-0 font-cinzel font-black opacity-5 leading-none select-none"
                          style={{ fontSize: '8rem', color: world.color, lineHeight: 0.85, transform: 'translateY(-5px)' }}
                        >
                          {world.num}
                        </div>

                        {/* Franja de color superior */}
                        <div className="h-1 w-full" style={{ background: world.color }} />

                        <div className="p-6 flex flex-col flex-grow z-10">
                          <span className="font-cinzel text-[10px] tracking-[0.4em] uppercase mb-2 block" style={{ color: world.color }}>
                            Santuario {world.num}
                          </span>
                          <h4 className="font-cinzel font-bold text-xl mb-1" style={{ color: 'var(--gold-light)' }}>
                            {world.name}
                          </h4>
                          <span className="font-crimson italic text-sm text-gray-500 mb-4 block">{world.sub}</span>
                          <p className="font-crimson text-gray-400 text-base leading-relaxed flex-grow mb-5">
                            {world.desc}
                          </p>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {world.tags.map(tag => (
                              <span
                                key={tag}
                                className="font-cinzel text-[9px] tracking-[0.2em] uppercase px-2 py-1 border"
                                style={{ borderColor: world.borderColor, color: world.color, background: 'rgba(0,0,0,0.4)' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ══ 4. EL OBJETIVO FINAL — ANIMADO Y DRAMÁTICO ══ */}
                <div className="py-20 relative overflow-hidden">
                  {/* Fondo radial misterioso */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.04) 0%, transparent 65%)' }} />

                  <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="font-cinzel text-xs tracking-[0.55em] uppercase mb-6 block" style={{ color: 'var(--gold-dark)', opacity: 0.5 }}>
                      El Destino Final
                    </span>

                    <h3
                      className="font-cinzel font-black uppercase mb-10 leading-tight"
                      style={{
                        fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
                        color: 'var(--gold-light)',
                        textShadow: '0 0 60px rgba(201,168,76,0.2)',
                      }}
                    >
                      El Camino a la Binohmo Sword
                    </h3>

                    {/* Cadena de pasos del endgame */}
                    <div className="flex flex-col gap-0 items-center mb-14 w-full max-w-2xl mx-auto">
                      {[
                        { icon: '✸', label: 'Forja las 9 Armas Míticas', desc: 'Cada una requiere los materiales más raros del Abismo Eterno.' },
                        { icon: '✦', label: 'Sacrifícalas en el Altar Final', desc: 'El altar transforma el sacrificio en poder puro.' },
                        { icon: '◉', label: 'Obtén la Llave del Infinito', desc: 'La única llave que abre el portal al inicio de la creación.' },
                        { icon: '◈', label: 'Boss Battle: El Mineral de Binohmo', desc: 'Enfréntate al origen mismo de la materia en un combate épico.' },
                        { icon: '⚒', label: 'Forja la Binohmo Sword', desc: 'La espada legendaria definitiva. El pico absoluto del poder.' },
                      ].map((step, i, arr) => (
                        <div key={i} className="flex flex-col items-center w-full">
                          <div
                            className="flex items-start gap-4 w-full text-left px-6 py-5 border border-gold-dark/12 hover:border-gold-dark/35 transition-all duration-300 group"
                            style={{ background: i === arr.length - 1 ? 'rgba(201,168,76,0.04)' : 'rgba(6,6,6,0.6)' }}
                          >
                            <div
                              className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                              style={{
                                borderColor: i === arr.length - 1 ? 'rgba(255,215,0,0.5)' : 'rgba(201,168,76,0.2)',
                                background: i === arr.length - 1 ? 'rgba(201,168,76,0.1)' : 'rgba(0,0,0,0.5)',
                              }}
                            >
                              <span
                                className="text-sm"
                                style={{ color: i === arr.length - 1 ? '#FFD700' : 'var(--gold-dark)' }}
                              >
                                {step.icon}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span
                                className="font-cinzel font-bold text-base tracking-wide"
                                style={{ color: i === arr.length - 1 ? 'var(--gold-bright)' : 'var(--gold-light)' }}
                              >
                                {step.label}
                              </span>
                              <span className="font-crimson text-sm text-gray-500 mt-1 leading-relaxed">
                                {step.desc}
                              </span>
                            </div>
                          </div>
                          {/* Conector vertical entre pasos */}
                          {i < arr.length - 1 && (
                            <div
                              className="w-px"
                              style={{ height: '24px', background: 'linear-gradient(180deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="font-crimson text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed italic">
                      "De ahí viene el nombre. <span style={{ color: 'var(--gold-light)' }}>Peak of Binohmo Sword</span> es la cima que tenés que alcanzar."
                    </p>
                  </div>
                </div>

                {/* ══ 5. FEATURES RÁPIDOS ══ */}
                <div className="border-t border-gold-dark/10 pt-14 pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {[
                      { icon: '◈', label: 'Minería Activa', desc: 'Rompe vetas y recolecta al momento' },
                      { icon: '⚒', label: 'Forja Profunda', desc: 'Sistema de crafting por Tiers' },
                      { icon: '▲', label: 'Progresión Total', desc: 'Skills, upgrades y trascendencia' },
                      { icon: '✦', label: 'Fin Épico', desc: '9 Armas Míticas + Boss Final' },
                    ].map(f => (
                      <div
                        key={f.icon}
                        className="flex flex-col items-center text-center p-5 border border-gold-dark/10 hover:border-gold-dark/30 transition-all duration-300"
                        style={{ background: 'rgba(8,8,8,0.5)' }}
                      >
                        <span className="text-xl mb-3" style={{ color: 'var(--gold-dark)' }}>{f.icon}</span>
                        <span className="font-cinzel text-[11px] font-bold tracking-wider uppercase mb-2" style={{ color: 'var(--gold-light)' }}>{f.label}</span>
                        <span className="font-crimson text-xs text-gray-500 leading-snug">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}


            {/* ─── TRASCENDENCIAS ───────────────────────────────────────── */}
            {activeMain === 'trascendencias' && (
              <TrascendenciasSection />
            )}

            {/* ─── CONDENSADORA ─────────────────────────────────────────── */}
            {activeMain === 'condensadora' && (
              <CondensadoraSection />
            )}

            {/* ─── DETRÁS DE LA FORJA ───────────────────────────────────── */}
            {activeMain === 'detras' && (
              <ComingSoonSection title="Detrás de la Forja" rune="⚒" subtitle="Dev" />
            )}

            {/* ─── WIKI ─────────────────────────────────────────────────── */}
            {activeMain === 'wiki' && (
              <div>
                {/* Encabezado Wiki */}
                <div className="flex flex-col items-center text-center mb-12">
                  <span className="font-cinzel text-xs tracking-[0.5em] uppercase mb-3" style={{ color: 'var(--gold-dark)', opacity: 0.7 }}>
                    Compendio Oficial
                  </span>
                  <h2
                    className="font-cinzel text-3xl md:text-4xl font-bold"
                    style={{
                      background: 'var(--gradient-gold)', backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Wiki del Juego
                  </h2>
                </div>

                {/* Layout Wiki: Sidebar + Contenido */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                  {/* ─ Sidebar ─ */}
                  <aside className="w-full lg:w-[250px] lg:min-w-[250px] flex-shrink-0 lg:sticky top-[90px]">
                    <div
                      className="border border-gold-dark/20 overflow-hidden"
                      style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)' }}
                    >
                      <div
                        className="px-5 py-4 border-b border-gold-dark/15 flex items-center gap-3"
                        style={{ background: 'rgba(201,168,76,0.03)' }}
                      >
                        <span style={{ color: 'var(--gold-dark)' }}>✦</span>
                        <span className="font-cinzel text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--gold-light)' }}>
                          Categorías
                        </span>
                      </div>

                      {SIDEBAR_GROUPS.map((group, gIdx) => (
                        <div key={group.label} className={gIdx > 0 ? 'border-t border-gold-dark/10' : ''}>
                          <div className="px-5 pt-4 pb-2">
                            <span className="font-cinzel text-[9px] tracking-[0.4em] uppercase opacity-35" style={{ color: 'var(--gold-dark)' }}>
                              {group.label}
                            </span>
                          </div>
                          {group.ids.map((subId) => {
                            const sub = WIKI_SUBSECTIONS.find(s => s.id === subId)!;
                            const isActive = activeWikiSub === subId;
                            return (
                              <button
                                key={subId}
                                onClick={() => setActiveWikiSub(subId)}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 outline-none cursor-pointer relative"
                                style={{
                                  background: isActive ? 'rgba(201,168,76,0.07)' : 'transparent',
                                  borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                                }}
                              >
                                <span className="text-sm flex-shrink-0 transition-all" style={{ color: isActive ? 'var(--gold-light)' : 'rgba(139,105,20,0.5)', opacity: isActive ? 1 : 0.7 }}>{sub.icon}</span>
                                <span className="font-cinzel text-[11px] tracking-wider uppercase transition-colors truncate" style={{ color: isActive ? 'var(--gold-light)' : 'rgba(180,150,90,0.5)' }}>
                                  {sub.label}
                                </span>
                                <span className="ml-auto font-cinzel text-[9px] flex-shrink-0 tabular-nums" style={{ color: isActive ? 'var(--gold-dark)' : 'rgba(100,80,40,0.4)' }}>
                                  {sub.items.length}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ))}

                      <div className="px-5 py-4 border-t border-gold-dark/10 flex justify-center">
                        <span className="font-cinzel text-[9px] tracking-[0.4em]" style={{ color: 'rgba(139,105,20,0.2)' }}>✦ ✦ ✦</span>
                      </div>
                    </div>
                  </aside>

                  {/* ─ Contenido Wiki ─ */}
                  <main className="flex-1 min-w-0">
                    {/* Sentinel invisible para scroll al tope */}
                    <div ref={wikiTopRef} style={{ height: 0, overflow: 'hidden' }} />
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeWikiSub}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                      >
                        {/* Header sub */}
                        <div className="flex items-center gap-4 mb-8 pb-5 border-b border-gold-dark/12">
                          <span className="text-2xl flex-shrink-0" style={{ color: 'var(--gold-dark)' }}>{activeSub.icon}</span>
                          <div>
                            <h3 className="font-cinzel font-bold text-xl md:text-2xl" style={{ color: 'var(--gold-light)' }}>
                              {activeSub.label}
                            </h3>
                            <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase mt-1 opacity-40" style={{ color: 'var(--gold-dark)' }}>
                              {activeSub.items.length} {activeSub.items.length === 1 ? 'entrada' : 'entradas'}
                            </p>
                          </div>
                        </div>

                        {/* Grid de items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {activeSub.items.map((item) => (
                            <div
                              key={item.id}
                              className="group flex flex-col border border-gold-dark/12 hover:border-gold-dark/45 transition-all duration-300 overflow-hidden"
                              style={{ background: 'rgba(8,8,8,0.7)' }}
                            >
                              {/* Imagen 1:1 */}
                              <div
                                className="w-full aspect-square relative overflow-hidden bg-black/60 flex items-center justify-center"
                                style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                              >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
                                <img
                                  src={item.imagePath}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML += `<span style="color:rgba(201,168,76,0.12);font-size:4rem;position:absolute;">${activeSub.icon}</span>`;
                                  }}
                                />
                                <div className="absolute top-3 right-3 z-10">
                                  <span className={`font-cinzel text-[9px] tracking-[0.2em] uppercase px-2 py-1 border ${RARITY_COLORS[item.rarity] ?? 'text-gray-300 border-gray-500/30'}`} style={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.55)' }}>
                                    {item.rarity}
                                  </span>
                                </div>
                              </div>

                              {/* Datos */}
                              <div className="p-4 flex flex-col flex-grow">
                                <h4 className="font-cinzel font-bold text-base mb-1" style={{ color: 'var(--gold-light)' }}>
                                  {item.name}
                                </h4>
                                <p className="font-crimson text-sm text-gray-400 leading-snug mb-3">
                                  {item.description}
                                </p>

                                {/* Badge de desbloqueo */}
                                {item.unlock && (
                                  <div
                                    className="font-cinzel text-[9px] tracking-[0.15em] uppercase px-2 py-1 mb-3 border-l-2 inline-block"
                                    style={{ color: '#FFD700', borderColor: '#FFD700', background: 'rgba(255,215,0,0.05)' }}
                                  >
                                    {item.unlock}
                                  </div>
                                )}

                                {/* Tabla de niveles */}
                                {item.levels && item.levels.length > 0 ? (
                                  <div className="mt-auto border border-gold-dark/10 overflow-hidden">
                                    {/* Header tabla */}
                                    <div
                                      className="grid grid-cols-3 gap-0"
                                      style={{ background: 'rgba(201,168,76,0.05)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}
                                    >
                                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase px-2 py-1.5" style={{ color: 'var(--gold-dark)' }}>Nv</span>
                                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase px-2 py-1.5 border-l border-gold-dark/10" style={{ color: 'var(--gold-dark)' }}>Daño</span>
                                      <span className="font-cinzel text-[8px] tracking-[0.2em] uppercase px-2 py-1.5 border-l border-gold-dark/10" style={{ color: 'var(--gold-dark)' }}>Coste</span>
                                    </div>
                                    {/* Filas */}
                                    {item.levels.map((lv, li) => (
                                      <div
                                        key={lv.level}
                                        className="grid grid-cols-3 gap-0"
                                        style={{
                                          borderTop: li > 0 ? '1px solid rgba(201,168,76,0.06)' : 'none',
                                          background: li % 2 === 0 ? 'transparent' : 'rgba(201,168,76,0.02)',
                                        }}
                                      >
                                        <span className="font-cinzel text-[10px] px-2 py-1.5 font-bold" style={{ color: 'var(--gold)' }}>{lv.level}</span>
                                        <span className="font-cinzel text-[10px] px-2 py-1.5 border-l border-gold-dark/08 font-bold" style={{ color: '#E8C96A' }}>{lv.dmg}</span>
                                        <span className="font-crimson text-[10px] px-2 py-1.5 border-l border-gold-dark/08 text-gray-500 leading-tight">{lv.cost}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : item.stat ? (
                                  <div
                                    className="font-cinzel text-[10px] tracking-[0.2em] uppercase px-3 py-2 border-l-2 mt-auto"
                                    style={{ color: 'var(--gold-dark)', borderColor: 'var(--gold-dark)', background: 'rgba(201,168,76,0.03)' }}
                                  >
                                    {item.stat}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ))}

                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </main>

                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══ BOTÓN VOLVER ARRIBA ═══════════════════════════════════════════════ */}
      <div className="flex justify-center pb-24 relative z-20">
        <button
          onClick={() => {
            const nav = document.getElementById('secciones-nav');
            if (nav) {
              const rect = nav.getBoundingClientRect();
              window.scrollTo({
                top: window.scrollY + rect.top - 130,
                behavior: 'smooth'
              });
            }
          }}
          title="Volver a Secciones"
          className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full transition-all duration-700 outline-none hover:scale-110"
          style={{ 
            background: 'linear-gradient(135deg, rgba(8,8,8,0.9) 0%, rgba(15,15,15,0.95) 100%)',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 0 20px rgba(201,168,76,0.05) inset, 0 10px 30px rgba(0,0,0,0.8)'
          }}
        >
          {/* Anillos de Glow */}
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-md" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="absolute inset-1 rounded-full border border-gold-light/10 group-hover:border-gold-light/30 transition-colors duration-700" />
          
          <span 
            className="font-cinzel text-lg md:text-xl flex flex-col items-center justify-center transition-transform duration-500 group-hover:-translate-y-1 relative z-10" 
            style={{ color: 'var(--gold-light)', textShadow: '0 0 15px rgba(201,168,76,0.6)' }}
          >
            <span className="block transform scale-x-150" style={{ transform: 'scale(1.2, 0.8)' }}>▲</span>
          </span>
        </button>
      </div>

      {/* Keyframe animación del título */}
      <style>{`
        @keyframes shine {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-cyan-blue {
          0% { border-color: rgba(0, 180, 216, 0.25); box-shadow: 0 0 5px rgba(0, 180, 216, 0.05); }
          50% { border-color: rgba(0, 119, 182, 0.5); box-shadow: 0 0 15px rgba(0, 119, 182, 0.15); }
          100% { border-color: rgba(0, 180, 216, 0.25); box-shadow: 0 0 5px rgba(0, 180, 216, 0.05); }
        }
        @keyframes pulse-red-orange {
          0% { border-color: rgba(230, 57, 70, 0.25); box-shadow: 0 0 5px rgba(230, 57, 70, 0.05); }
          50% { border-color: rgba(251, 133, 0, 0.5); box-shadow: 0 0 15px rgba(251, 133, 0, 0.15); }
          100% { border-color: rgba(230, 57, 70, 0.25); box-shadow: 0 0 5px rgba(230, 57, 70, 0.05); }
        }
        .animate-pulse-cyan-blue {
          animation: pulse-cyan-blue 4s ease-in-out infinite;
        }
        .animate-pulse-red-orange {
          animation: pulse-red-orange 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
