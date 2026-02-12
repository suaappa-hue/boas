import type { Metadata } from 'next'

const SITE_URL = 'https://example.com'
const SITE_NAME = '보아스 경영지원솔루션'

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, email: true },
  robots: { index: true, follow: true },
}

export const pageMetadata: Record<string, Metadata> = {
  home: {
    title: '보아스 경영지원솔루션 | 중소기업 정책자금·벤처인증 전문 컨설팅',
    description:
      '중소기업 정책자금 전문 컨설팅 보아스 경영지원솔루션. 저금리 정책자금 조달, 벤처인증, 이노비즈 인증까지 기업 역량을 분석해 맞춤 자금조달 전략을 설계합니다. 무료 기업진단으로 시작하세요.',
    keywords:
      '정책자금, 중소기업 정책자금, 자금조달, 정부지원금, 창업자금, 운전자금, 시설자금, 보아스 경영지원솔루션, 벤처인증, 이노비즈, 경영컨설팅',
    openGraph: {
      title: '보아스 경영지원솔루션 | 중소기업 정책자금·벤처인증 전문 컨설팅',
      description:
        '저금리 정책자금 조달, 벤처인증, 이노비즈 인증까지. 기업 역량을 분석해 맞춤 자금조달 전략을 설계합니다.',
      url: SITE_URL,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
      images: [{ url: 'https://example.com/images/og-image.png', width: 1200, height: 630, alt: '보아스 경영지원솔루션 - 정부정책자금 자금확보 전문가' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: '보아스 경영지원솔루션 | 중소기업 정책자금·벤처인증 전문 컨설팅',
      description:
        '저금리 중소기업 정책자금, 맞춤 자금조달 전략. 무료 기업진단 신청하세요.',
    },
    alternates: { canonical: SITE_URL },
  },

  fund: {
    title: '중소기업 정책자금 컨설팅 | 저금리 자금조달 종류·절차 - 보아스 경영지원솔루션',
    description:
      '창업자금, 운전자금, 시설자금 등 중소기업 맞춤 정책자금 컨설팅. 연 2~4% 저금리 정책자금으로 자금조달 부담을 줄이세요. 무료 기업진단 제공.',
    openGraph: {
      title: '중소기업 정책자금 컨설팅 | 보아스 경영지원솔루션',
      description:
        '중소기업 맞춤 정책자금 컨설팅. 연 2~4% 저금리 자금조달 전략 수립.',
      url: `${SITE_URL}/fund`,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '중소기업 정책자금 컨설팅 | 보아스 경영지원솔루션',
      description: '연 2~4% 저금리 중소기업 정책자금. 무료 진단 신청.',
    },
    alternates: { canonical: `${SITE_URL}/fund` },
  },

  certification: {
    title: '벤처인증·이노비즈 기업인증 컨설팅 | 보아스 경영지원솔루션',
    description:
      '벤처인증, 이노비즈인증 전문 컨설팅. 기업인증 취득으로 세제감면, 정책자금 우대, 공공입찰 가점 등 다양한 혜택을 확보하세요. 체계적인 인증 컨설팅으로 높은 성공률 달성.',
    keywords:
      '벤처인증, 이노비즈인증, 기업인증 컨설팅, 세제혜택, 정책자금 우대, 벤처기업인증, 이노비즈기업, 메인비즈',
    openGraph: {
      title: '벤처인증·이노비즈 기업인증 컨설팅 | 보아스 경영지원솔루션',
      description:
        '벤처인증, 이노비즈인증 취득으로 세제감면·정책자금 우대 확보. 체계적 기업인증 컨설팅.',
      url: `${SITE_URL}/certification`,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '벤처인증·이노비즈 기업인증 컨설팅 | 보아스 경영지원솔루션',
      description: '벤처·이노비즈 기업인증으로 세제감면, 정책자금 우대 확보.',
    },
    alternates: { canonical: `${SITE_URL}/certification` },
  },

  success: {
    title: '정책자금 성공사례 | 중소기업 자금조달 실적 - 보아스 경영지원솔루션',
    description:
      '보아스 경영지원솔루션의 418건 이상 정책자금 성공사례. 96% 심사 통과율, 평균 2.8억 자금조달. 다양한 업종의 실제 중소기업 성공사례를 확인하세요.',
    keywords:
      '정책자금 성공사례, 중소기업 자금조달, 컨설팅 성공률, 정책자금 후기, 보아스 경영지원솔루션 실적',
    openGraph: {
      title: '정책자금 성공사례 | 중소기업 자금조달 실적 - 보아스 경영지원솔루션',
      description:
        '418건+ 성공사례, 96% 통과율, 평균 2.8억 자금조달. 실제 성공사례를 확인하세요.',
      url: `${SITE_URL}/success`,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '정책자금 성공사례 | 보아스 경영지원솔루션',
      description: '418건+ 정책자금 성공사례. 96% 통과율, 평균 2.8억 자금조달.',
    },
    alternates: { canonical: `${SITE_URL}/success` },
  },

  contact: {
    title: '정책자금 무료 상담 신청 | 중소기업 자금조달 - 보아스 경영지원솔루션',
    description:
      '중소기업 정책자금 무료 상담 신청. 전문 컨설턴트가 1:1로 기업 현황을 분석하고 최적의 자금조달 전략을 제안합니다. 부담 없이 무료 기업진단으로 시작하세요.',
    keywords:
      '정책자금 상담, 무료 기업진단, 자금조달 상담, 중소기업 컨설팅, 보아스 경영지원솔루션 상담',
    openGraph: {
      title: '정책자금 무료 상담 신청 | 중소기업 자금조달 - 보아스 경영지원솔루션',
      description:
        '전문 컨설턴트 1:1 무료 기업진단. 대표님 맞춤 정책자금 전략을 제안합니다.',
      url: `${SITE_URL}/contact`,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '정책자금 무료 상담 | 보아스 경영지원솔루션',
      description: '중소기업 정책자금 전문 컨설턴트 1:1 무료 진단. 지금 신청하세요.',
    },
    alternates: { canonical: `${SITE_URL}/contact` },
  },
}
