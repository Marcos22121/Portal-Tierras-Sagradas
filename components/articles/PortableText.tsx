import { PortableText as PortableTextComponent } from '@portabletext/react'

export const PortableText = ({ value }: { value: any }) => {
  return (
    <div className="font-crimson text-lg leading-relaxed space-y-4">
      <PortableTextComponent
        value={value}
        components={{
          block: {
            normal: ({ children }: any) => <p className="mb-4 text-gray-300">{children}</p>,
            h1: ({ children }: any) => <h1 className="font-cinzel text-3xl text-gold-gradient mt-8 mb-4">{children}</h1>,
            h2: ({ children }: any) => <h2 className="font-cinzel text-2xl text-gold mb-3 mt-6">{children}</h2>,
            h3: ({ children }: any) => <h3 className="font-cinzel text-xl text-gold-light mb-2 mt-4">{children}</h3>,
            blockquote: ({ children }: any) => (
              <blockquote className="border-l-4 border-gold-dark pl-4 py-2 my-6 italic bg-black/30">
                {children}
              </blockquote>
            ),
          },
          marks: {
            strong: ({ children }: any) => <strong className="font-bold text-gray-200">{children}</strong>,
            em: ({ children }: any) => <em className="italic text-gray-400">{children}</em>,
          },
        }}
      />
    </div>
  )
}
