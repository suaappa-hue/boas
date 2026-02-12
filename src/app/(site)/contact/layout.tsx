import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import { localBusinessSchema, breadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = pageMetadata.contact

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            localBusinessSchema(),
            breadcrumbSchema([
              { name: '홈', url: 'https://example.com' },
              { name: '무료 상담', url: 'https://example.com/contact' },
            ]),
          ]),
        }}
      />
      {children}
    </>
  )
}
