import { defineField, defineType } from 'sanity'

export const biography = defineType({
  name: 'biography',
  title: 'Biografía (Personaje)',
  type: 'document',
  icon: () => '⚔',
  fields: [
    // ─── IDENTIDAD ────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Nombre del Personaje',
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
      description: 'Frase que aparece encima del nombre. Ej: "El Caballero Mítico de Tierras Sagradas"',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Descripción Corta',
      type: 'string',
      description: 'Subtítulo breve. Ej: "El Creador y Observador", "Emperador del Imperio del Lag"',
    }),

    // ─── CONTENIDO ────────────────────────────────────────────────
    defineField({
      name: 'biography',
      title: 'Biografía (Cuerpo Principal)',
      type: 'blockContent',
      description: 'Toda la backstory del personaje en formato rich text.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'characteristics',
      title: 'Características',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Listado de rasgos clave. Ej: "Inmortal e imperceptible a voluntad"',
    }),

    // ─── IMÁGENES ─────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Imágenes del Personaje',
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
      description: 'Imágenes en relación 2:3 (retrato vertical). Podés agregar varias.',
      validation: (Rule) => Rule.required().min(1),
    }),

    // ─── EQUIPAMIENTO (Cross-ref al Museo) ────────────────────────
    defineField({
      name: 'equipment',
      title: 'Armamento / Equipamiento',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'museumItem' }],
        },
      ],
      description: 'Items del Museo que este personaje utiliza. Se generan links automáticos.',
    }),

    // ─── CONTEXTO ─────────────────────────────────────────────────
    defineField({
      name: 'faction',
      title: 'Facción',
      type: 'string',
      description: 'Ej: "Imperio del Lag", "Los Errantes"',
    }),
    defineField({
      name: 'religion',
      title: 'Religión',
      type: 'string',
      description: 'Religión o creencia del personaje.',
    }),
    defineField({
      name: 'placeOfOrigin',
      title: 'Lugar de Origen (Texto)',
      type: 'string',
      description: 'Nombre del lugar de nacimiento como texto libre.',
    }),
    defineField({
      name: 'placeOfOriginRef',
      title: 'Lugar de Origen (Referencia)',
      type: 'reference',
      to: [{ type: 'land' }],
      description: 'Opcional: vinculá el lugar a un artículo de Tierras para generar un link.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'shortDescription',
      media: 'images.0',
    },
  },
})
