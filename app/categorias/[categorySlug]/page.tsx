import { notFound } from 'next/navigation'
import { client } from '../../../lib/sanity.client'
import { articlesByCategoryQuery, categoryBySlugQuery } from '../../../lib/sanity.queries'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { categorySlug: string } }) {
  const category = await client.fetch(categoryBySlugQuery, { slug: params.categorySlug })
  if (!category) return {}
  return {
    title: `Tierras Sagradas: ${category.title} | Categorías`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: { params: { categorySlug: string } }) {
  const category = await client.fetch(categoryBySlugQuery, { slug: params.categorySlug })
  
  if (!category) {
    notFound()
  }

  const articles = await client.fetch(articlesByCategoryQuery, { categorySlug: params.categorySlug })

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="ornament-divider mb-6">
            <span style={{ color: 'var(--gold-dark)', fontSize: '0.9rem' }}>✦</span>
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4 text-gold-gradient">
            {category.title}
          </h1>
          {category.description && (
            <p className="font-crimson text-xl text-gray-400 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <Link 
                href={`/articulos/${article.slug.current}`} 
                key={article._id}
                className="card-mythic p-6 flex flex-col h-full group cursor-pointer"
              >
                <h3 className="font-cinzel text-xl text-gold mb-3 group-hover:text-gold-bright transition-colors">
                  {article.title}
                </h3>
                <p className="font-crimson text-gray-400 flex-grow text-sm">
                  {article.excerpt || 'Sin descripción disponible.'}
                </p>
                <div className="mt-6 pt-4 border-t border-gold-dark/30 flex justify-between items-center">
                  <span className="text-xs font-cinzel text-gray-500 uppercase tracking-widest">
                    Leer más
                  </span>
                  <span className="text-gold-dark text-xs">✦</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-gold-dark/30 bg-black/50">
            <span className="font-cinzel tracking-widest uppercase text-gold-muted text-sm">
              Aún no hay manuscritos en esta categoría.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
