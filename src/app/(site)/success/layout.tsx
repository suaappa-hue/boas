import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo/metadata'
import { breadcrumbSchema } from '@/lib/seo/schemas'

export const metadata: Metadata = pageMetadata.success

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbSchema([
              { name: '홈', url: 'https://www.boas-solution.kr' },
              { name: '성공사례', url: 'https://www.boas-solution.kr/success' },
            ]),
          ]),
        }}
      />
      {children}
    </>
  )
}
