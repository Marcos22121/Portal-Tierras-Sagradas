import { defineField, defineType } from 'sanity'

export const land = defineType({
  name: 'land',
  title: 'Tierra (Lugar)',
  type: 'document',
  icon: () => '🏰',
  fields: [
    // ─── IDENTIDAD ────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Nombre del Lugar',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Título Decorativo',
      type: 'string',
      description: 'Frase de flare. Ej: "La Fortaleza Eterna del Norte"',
    }),
    defineField({
      name: 'headerImage',
      title: 'Imagen de Cabecera (3:2)',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen principal que se muestra en el fondo del header (Recomendado 3:2).',
    }),
    defineField({
      name: 'landType',
      title: 'Tipo de Lugar',
      type: 'string',
      options: {
        list: [
          { title: 'Punto de Interés (Edificio, Templo, Ruina)', value: 'punto-de-interes' },
          { title: 'Región (Bosque, Desierto, Montaña)', value: 'region' },
          { title: 'Pueblo o Ciudad', value: 'pueblo-ciudad' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── CONTENIDO ────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Descripción Completa',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
      description: 'Historia y detalles del lugar en formato rich text.',
    }),
    defineField({
      name: 'images',
      title: 'Imágenes del Lugar',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Pie de Imagen',
              type: 'string',
            },
          ],
        },
      ],
      description: 'Varias imágenes en relación 2:3.',
    }),

    // ─── UBICACIÓN (Self-reference) ──────────────────────────────
    defineField({
      name: 'parentLocation',
      title: 'Ubicación Padre',
      type: 'reference',
      to: [{ type: 'land' }],
      description: 'Si es un templo, en qué región está. Si es un pueblo, en qué zona se ubica.',
    }),

    // ─── METADATA ─────────────────────────────────────────────────
    defineField({
      name: 'ruler',
      title: 'Gobernante',
      type: 'reference',
      to: [{ type: 'biography' }],
      description: 'Personaje que gobierna este lugar.',
    }),
    defineField({
      name: 'climate',
      title: 'Clima',
      type: 'string',
      description: 'Ej: "Tropical", "Gélido", "Volcánico"',
    }),
    defineField({
      name: 'biome',
      title: 'Bioma',
      type: 'string',
      description: 'Ej: "Desierto", "Bosque Ancestral", "Tundra"',
    }),
    defineField({
      name: 'dangerLevel',
      title: 'Peligrosidad',
      type: 'string',
      options: {
        list: [
          { title: '🟢 Bajo', value: 'bajo' },
          { title: '🟡 Medio', value: 'medio' },
          { title: '🟠 Alto', value: 'alto' },
          { title: '🔴 Extremo', value: 'extremo' },
          { title: '⚫ Desconocido', value: 'desconocido' },
        ],
      },
      description: 'Nivel de peligrosidad para viajeros.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'landType',
      media: 'images.0',
    },
    prepare({ title, subtitle, media }) {
      const typeLabels: Record<string, string> = {
        'punto-de-interes': 'Punto de Interés',
        'region': 'Región',
        'pueblo-ciudad': 'Pueblo / Ciudad',
      }
      return {
        title,
        subtitle: typeLabels[subtitle] || subtitle,
        media,
      }
    },
  },
})
