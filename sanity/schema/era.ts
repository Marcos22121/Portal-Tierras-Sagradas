import { defineField, defineType } from 'sanity'

export const era = defineType({
  name: 'era',
  title: 'Era (Línea Temporal)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título de la Era',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Ej: Era del Inicio, Era del Cisma',
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
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
      description: 'Breve resumen de los eventos de esta era',
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagen de Fondo',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Se usará como fondo difuminado de la tarjeta de la Era en la portada',
    }),
  ],
})
