import { groq } from 'next-sanity'

// ─── ARTÍCULOS (Leyendas) ────────────────────────────────────────────────────
export const articlesQuery = groq`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, coverImage,
    "category": category->{ title, slug }
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id, title, slug, body, publishedAt, excerpt, coverImage,
    "category": category->{ title, slug },
    "era": era->{ title, slug },
    "characters": characters[]->{ _id, name, slug, shortDescription, images }
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, title, description, coverImage
  }
`

export const articlesByCategoryQuery = groq`
  *[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id, title, slug, publishedAt, excerpt, coverImage,
    "category": category->{ title, slug }
  }
`

// ─── ERAS ────────────────────────────────────────────────────────────────────
export const homeErasWithLeyendasQuery = groq`
  *[_type == "era"] | order(title asc) {
    _id, title, slug, description, coverImage,
    "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc) {
      _id, title, slug, excerpt, coverImage
    }
  }
`

// ─── BIOGRAFÍAS ──────────────────────────────────────────────────────────────
export const allBiographiesQuery = groq`
  *[_type == "biography"] | order(name asc) {
    _id, name, slug, title, shortDescription,
    images,
    "equipment": equipment[]->{ _id, name, slug, coverImage },
    faction
  }
`

export const biographyBySlugQuery = groq`
  *[_type == "biography" && slug.current == $slug][0] {
    _id, name, slug, title, shortDescription, biography, characteristics,
    images,
    "equipment": equipment[]->{ _id, name, slug, coverImage, itemType },
    faction, religion, placeOfOrigin,
    "placeOfOriginRef": placeOfOriginRef->{ _id, name, slug },
    "legends": *[_type == "article" && references(^._id)] | order(publishedAt desc) {
      _id, title, slug, excerpt, coverImage,
      "era": era->{ title }
    }
  }
`

// ─── MUSEO ───────────────────────────────────────────────────────────────────
export const allMuseumItemsQuery = groq`
  *[_type == "museumItem"] | order(name asc) {
    _id, name, slug, itemType, coverImage,
    "bearer": bearer->{ _id, name, slug }
  }
`

export const museumItemBySlugQuery = groq`
  *[_type == "museumItem" && slug.current == $slug][0] {
    _id, name, slug, itemType, description, coverImage,
    origin, creator,
    "bearer": bearer->{ _id, name, slug, shortDescription, images }
  }
`

// ─── TIERRAS ─────────────────────────────────────────────────────────────────
export const allLandsQuery = groq`
  *[_type == "land"] | order(name asc) {
    _id, name, slug, title, landType, images, dangerLevel,
    "parentLocation": parentLocation->{ _id, name, slug },
    "ruler": ruler->{ _id, name, slug }
  }
`

export const landBySlugQuery = groq`
  *[_type == "land" && slug.current == $slug][0] {
    _id, name, slug, title, landType, description, images,
    climate, biome, dangerLevel,
    "parentLocation": parentLocation->{ _id, name, slug },
    "ruler": ruler->{ _id, name, slug, shortDescription, images },
    "childLocations": *[_type == "land" && references(^._id)] | order(name asc) {
      _id, name, slug, landType
    }
  }
`
