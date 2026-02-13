import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { baseMetadata } from '@/lib/seo/metadata'
import { GA_MEASUREMENT_ID } from '@/lib/gtag'

export const metadata: Metadata = {
  ...baseMetadata,
  title: '보아스 경영지원솔루션 | 정책자금 경영컨설팅',
  description:
    '보아스 경영지원솔루션은 정책자금 전문 경영컨설팅 기업입니다. 체계적인 진단으로 정책자금 심사 통과율을 높여드립니다.',
  keywords:
    '정책자금, 경영컨설팅, 자금상담, 창업자금, 운전자금, 시설자금, 보아스 경영지원솔루션',
  openGraph: {
    title: '보아스 경영지원솔루션 | 정책자금 경영컨설팅',
    description: '체계적인 경영 자문, 정책자금 전문 컨설팅',
    url: 'https://boas-two.vercel.app',
    siteName: '보아스 경영지원솔루션',
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    other: {
      'naver-site-verification': [process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || ''],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
