import { notFound } from 'next/navigation'
import { client } from '../../../lib/sanity.client'
import { legendBySlugQuery } from '../../../lib/sanity.queries'
import { PortableText } from '../../../components/articles/PortableText'
import Link from 'next/link'
import { urlForImage } from '../../../lib/sanity.image'

import BackToTop from '../../../components/ui/BackToTop'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const legend = await client.fetch(legendBySlugQuery, { slug: params.slug })
  if (!legend) return {}
  return {
    title: `Tierras Sagradas: ${legend.title}`,
    description: legend.excerpt,
  }
}

export default async function LegendPage({ params }: { params: { slug: string } }) {
  const legend = await client.fetch(legendBySlugQuery, { slug: params.slug })
  
  if (!legend) {
    notFound()
  }

  return (
    <article className="pt-32 pb-24 px-6 md:px-12 min-h-screen bg-obsidian">
      <div className="max-w-4xl mx-auto">
        <header className="mb-14 text-center">
          {legend.coverImage && (
            <div className="w-full aspect-[3/2] overflow-hidden border border-gold-dark/20 rounded-sm mb-12 shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img 
                src={urlForImage(legend.coverImage)?.width(1600).height(1067).url()} 
                alt={legend.title} 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          )}

          <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-gold-gradient leading-tight tracking-wider">
            {legend.title}
          </h1>

          <div className="ornament-divider mx-auto w-1/3 mb-10 opacity-60">
            <span style={{ color: 'var(--gold-dark)', fontSize: '0.8rem' }}>✦</span>
          </div>

          {legend.excerpt && (
            <p className="font-crimson text-xl md:text-2xl text-gray-400 italic font-light max-w-3xl mx-auto leading-relaxed">
              {legend.excerpt}
            </p>
          )}
        </header>

        {/* Content Body area */}
        <div className="bg-[#050505]/40 backdrop-blur-sm border border-gold-dark/15 p-8 md:p-16 lg:p-20 relative shadow-2xl rounded-sm">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-gold-dark/30" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gold-dark/30" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-gold-dark/30" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gold-dark/30" />
          
          <div className="portable-text-container">
             {legend.body ? (
               <PortableText value={legend.body} />
             ) : (
               <div className="text-center py-20 opacity-40">
                 <p className="font-cinzel tracking-widest uppercase">El pergamino se encuentra en blanco.</p>
               </div>
             )}
          </div>
        </div>

        {/* Navegación al final */}
        <div className="mt-24 pt-16 border-t border-gold-dark/20 flex flex-col items-center gap-12">
          <BackToTop />
          
          <div className="flex flex-col items-center gap-6">
            <p className="font-crimson text-lg italic text-gray-400">¿Deseas continuar tu viaje por la historia?</p>
            <Link 
              href="/#leyendas" 
              className="group relative px-10 py-4 border border-gold-dark/30 bg-black/40 hover:border-gold-light transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 gold-glow-hover"
            >
              <span className="font-cinzel text-sm tracking-[0.25em] text-gold-muted group-hover:text-gold-light group-hover:drop-shadow-[0_0_8px_rgba(201,168,76,0.6)] uppercase transition-all">
                Explorar más leyendas
              </span>
              <span className="text-gold-dark group-hover:text-gold-light transition-colors text-xl">→</span>
              <div className="absolute inset-0 bg-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
