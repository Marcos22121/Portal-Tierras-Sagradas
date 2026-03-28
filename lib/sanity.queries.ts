import { groq } from 'next-sanity'

export const articlesQuery = groq`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    "category": category->{
      title,
      slug
    }
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    publishedAt,
    excerpt,
    coverImage,
    "category": category->{
      title,
      slug
    }
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    description,
    coverImage
  }
`

export const articlesByCategoryQuery = groq`
  *[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    coverImage,
    "category": category->{
      title,
      slug
    }
  }
`

export const homeCategoriesWithArticlesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage
    }
  }
`

export const homeErasWithLeyendasQuery = groq`
  *[_type == "era"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    coverImage,
    "articles": *[_type == "article" && references(^._id) && (category->title match "*leyenda*" || category->title match "*historia*")] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      coverImage
    }
  }
`
