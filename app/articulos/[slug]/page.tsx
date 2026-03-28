import { notFound } from 'next/navigation'
import { client } from '../../../lib/sanity.client'
import { articleBySlugQuery } from '../../../lib/sanity.queries'
import { PortableText } from '../../../components/articles/PortableText'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await client.fetch(articleBySlugQuery, { slug: params.slug })
  if (!article) return {}
  return {
    title: `Tierras Sagradas: ${article.title}`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await client.fetch(articleBySlugQuery, { slug: params.slug })
  
  if (!article) {
    notFound()
  }

  return (
    <article className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          {article.category && (
            <Link 
              href={`/categorias/${article.category.slug.current}`}
              className="inline-block font-cinzel text-xs tracking-widest text-gold-light uppercase border border-gold-dark/40 px-3 py-1 mb-6 hover:bg-gold-dark/10 transition-colors"
            >
              {article.category.title}
            </Link>
          )}

          <h1 className="font-cinzel text-4xl md:text-6xl font-bold mb-6 text-gold-gradient leading-tight">
            {article.title}
          </h1>

          <div className="ornament-divider mx-auto w-1/2 mb-8">
            <span style={{ color: 'var(--gold-dark)', fontSize: '0.6rem' }}>✦</span>
          </div>

          {article.excerpt && (
            <p className="font-crimson text-xl text-gray-400 italic font-light">
              {article.excerpt}
            </p>
          )}
        </header>

        {/* Content Body area */}
        <div className="bg-obsidian-surface border border-obsidian-border p-8 md:p-12 relative shadow-2xl">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold-dark/50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-dark/50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-dark/50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold-dark/50" />
          
          <div className="portable-text-container">
             {article.body ? (
               <PortableText value={article.body} />
             ) : (
               <div className="text-center py-10 opacity-50">
                 <p className="font-cinzel">El pergamino se encuentra en blanco.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </article>
  )
}
