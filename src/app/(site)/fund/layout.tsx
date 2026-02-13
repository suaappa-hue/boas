import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import { serviceSchema, breadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = pageMetadata.fund

export default function FundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceSchema('fund'),
            breadcrumbSchema([
              { name: '홈', url: 'https://www.boas-solution.kr' },
              { name: '정책자금', url: 'https://www.boas-solution.kr/fund' },
            ]),
          ]),
        }}
      />
      {children}
    </>
  )
}
