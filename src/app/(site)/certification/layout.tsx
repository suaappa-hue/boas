import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import { serviceSchema, breadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = pageMetadata.certification

export default function CertificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceSchema('pro'),
            breadcrumbSchema([
              { name: '홈', url: 'https://boas-two.vercel.app' },
              { name: '인증 컨설팅', url: 'https://boas-two.vercel.app/certification' },
            ]),
          ]),
        }}
      />
      {children}
    </>
  )
}
