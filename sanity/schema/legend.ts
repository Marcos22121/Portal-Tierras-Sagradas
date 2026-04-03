import { defineField, defineType } from 'sanity'

export const legend = defineType({
  name: 'legend',
  title: 'Leyenda',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'era',
      title: 'Era (Solo para Historias/Leyendas)',
      type: 'reference',
      to: { type: 'era' },
      description: 'Si es una leyenda, a qué Era pertenece',
    }),
    defineField({
      name: 'characters',
      title: 'Personajes que aparecen',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'biography' }],
        },
      ],
      description: 'Personajes de Biografías que participan en esta leyenda. Se usa para generar la sección "Leyendas donde aparece" en la biografía.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumen Corto',
      type: 'text',
      rows: 4,
      description: 'Aparecerá en las cards e intro del artículo.',
    }),
    defineField({
      name: 'body',
      title: 'Contenido Completo',
      type: 'blockContent',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      description: '¿Mostrar este artículo en la portada principal?',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
