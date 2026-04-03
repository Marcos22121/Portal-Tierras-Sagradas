import { defineField, defineType } from 'sanity'

export const museumItem = defineType({
  name: 'museumItem',
  title: 'Museo (Objeto / Artefacto)',
  type: 'document',
  icon: () => '🗡',
  fields: [
    // ─── IDENTIDAD ────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Nombre del Objeto',
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
      name: 'itemType',
      title: 'Tipo de Objeto',
      type: 'string',
      options: {
        list: [
          { title: 'Armamento Sagrado', value: 'armamento' },
          { title: 'Reliquia Arcana', value: 'reliquia' },
          { title: 'Runa', value: 'runa' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      description: 'Categoría del objeto dentro del Museo.',
    }),
    defineField({
      name: 'headerImage',
      title: 'Imagen de Cabecera (3:2)',
      type: 'image',
      options: { hotspot: true },
      description: 'Imagen panorámica para el fondo del header (Recomendado 3:2).',
    }),

    // ─── CONTENIDO ────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Descripción Completa',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
      description: 'Historia y detalles del objeto en formato rich text.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Imagen del objeto. Idealmente formato 1:1 (cuadrado).',
    }),

    // ─── METADATA ─────────────────────────────────────────────────
    defineField({
      name: 'origin',
      title: 'Lugar de Origen',
      type: 'string',
      description: 'Ej: "Imperio del Lag", "Reinos del Eclipse"',
    }),
    defineField({
      name: 'creator',
      title: 'Creador / Forjador',
      type: 'string',
      description: 'Quién creó o forjó este objeto.',
    }),
    defineField({
      name: 'bearer',
      title: 'Poseedor Actual',
      type: 'reference',
      to: [{ type: 'biography' }],
      description: 'Personaje que actualmente posee o empuña este objeto.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'itemType',
      media: 'coverImage',
    },
    prepare({ title, subtitle, media }) {
      const typeLabels: Record<string, string> = {
        armamento: 'Armamento Sagrado',
        reliquia: 'Reliquia Arcana',
        runa: 'Runa',
      }
      return {
        title,
        subtitle: typeLabels[subtitle] || subtitle,
        media,
      }
    },
  },
})
