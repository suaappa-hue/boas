'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'

const BENEFIT_TABS = [
  {
    label: '세제 혜택',
    title: '세제 혜택',
    stat: '최대 50%',
    desc: '법인세·소득세 감면 및 세액공제',
    list: ['법인세 최대 50% 감면', '소득세 최대 50% 감면', '취득세·재산세 감면', '연구개발비 세액공제'],
    image: 'benefitTax' as const,
  },
  {
    label: '정책자금 우대',
    title: '정책자금 우대',
    stat: '금리 우대',
    desc: '저금리 대출 및 한도 증액',
    list: ['금리 0.5~1% 우대', '대출 한도 20% 증액', '보증비율 우대', '심사 기간 단축'],
    image: 'benefitFund' as const,
  },
  {
    label: '입찰 가점',
    title: '입찰 가점',
    stat: '3~5%',
    desc: '공공기관 입찰 시 가점 부여',
    list: ['공공입찰 3~5% 가점', '우선 구매 대상 선정', '조달청 등록 우대', '수의계약 기회 확대'],
    image: 'benefitBid' as const,
  },
  {
    label: '인재 채용 지원',
    title: '인재 채용 지원',
    stat: '다양한 지원',
    desc: '우수인력 채용 및 육성 지원',
    list: ['채용 지원금 지급', '병역특례 TO 배정', '외국인 고용 허가 우대', '인력 교육훈련 지원'],
    image: 'benefitHiring' as const,
  },
]

const READY_TABS = [
  {
    label: '벤처확인기업',
    title: '벤처확인기업 인증 요건',
    desc: <>벤처투자, 연구개발비, 매출액 등<br className="mobile-br" />기술성장성을 기준으로 평가합니다</>,
    items: [
      '업력 7년 미만 기업',
      '벤처투자 확인 또는 기술평가 보증/대출',
      '기술성 평가 통과 (60점 이상)',
      '매출액 또는 연구개발비 기준 충족',
      '중소기업 요건 충족',
      '법인 또는 개인사업자 등록',
    ],
  },
  {
    label: '이노비즈',
    title: '이노비즈 인증 요건',
    desc: <>기술혁신성과 연구개발<br className="mobile-br" />투자 실적을 중심으로 평가합니다</>,
    items: [
      '중소기업 요건 충족',
      '최근 3년 연구개발비 투자 실적',
      '기술혁신성 평가 통과 (70점 이상)',
      '기술개발 전담 인력 보유',
      '특허, 실용신안 등 지식재산권 보유',
      '3년 이상 사업 운영 실적',
    ],
  },
  {
    label: '메인비즈',
    title: '메인비즈 인증 요건',
    desc: <>경영시스템과 경영혁신 실적을<br className="mobile-br" />종합적으로 평가합니다</>,
    items: [
      '중소기업 요건 충족',
      '경영시스템 구축 (인사, 회계, 생산 등)',
      '최근 3년 경영 성과 및 성장성',
      '경영혁신 계획 수립 및 실행',
      '재무건전성 확보',
      '3년 이상 사업 운영 실적',
    ],
  },
  {
    label: '기업부설연구소',
    title: '기업부설연구소 인증 요건',
    desc: <>연구 인력과 연구 시설,<br className="mobile-br" />연구개발 투자를 중심으로 평가합니다</>,
    items: [
      '전담 연구 인력 5명 이상 보유',
      '연구전담요원 1명 이상 (학사 이상)',
      '독립된 연구 전용 공간 확보',
      '연구개발 장비 및 시설 보유',
      '연간 연구개발비 투자 실적',
      '연구개발 과제 수행 실적',
    ],
  },
  {
    label: 'ISO',
    title: 'ISO 인증 요건',
    desc: <>품질경영시스템(ISO 9001) 및<br className="mobile-br" />환경경영시스템(ISO 14001)<br className="mobile-br" />기준을 평가합니다</>,
    items: [
      '품질경영시스템 문서화 (품질매뉴얼 절차서)',
      '내부심사 실시 (1회 이상)',
      '경영검토 회의 실시',
      '시정조치 및 예방조치 프로세스 운영',
      '3개월 이상 시스템 운영 실적',
      '인증심사 대응 가능한 체계 구축',
    ],
  },
  {
    label: '여성기업',
    title: '여성기업 인증 요건',
    desc: <>여성 대표자 여부 및<br className="mobile-br" />여성 소유 지분 비율을<br className="mobile-br" />기준으로 평가합니다</>,
    items: [
      '여성이 대표이사 또는 대표자',
      '여성 소유 지분 50% 이상',
      '여성이 실질적으로 경영 총괄',
      '중소기업 또는 소상공인 요건 충족',
      '사업자등록증 및 법인등기부등본',
      '주주명부 또는 출자증명서',
    ],
  },
]

const CERT_CARDS = [
  {
    name: '벤처확인기업',
    desc: '혁신적 기술과 성장 가능성을 인정받는 기업',
    benefits: ['세제 혜택 최대 50% 감면', '정책자금 금리 우대', '공공입찰 가점 부여'],
    image: 'certVenture' as const,
  },
  {
    name: '이노비즈',
    desc: '기술혁신형 중소기업 인증',
    benefits: ['R&D 자금 지원 우대', '기술개발 세액공제', '조달청 입찰 우대'],
    image: 'certInnobiz' as const,
  },
  {
    name: '메인비즈',
    desc: '경영혁신형 중소기업 인증',
    benefits: ['경영개선자금 지원', '컨설팅 비용 지원', '판로 개척 지원'],
    image: 'certMainbiz' as const,
  },
  {
    name: '기업부설연구소',
    desc: '독자적 연구개발 역량 보유 기업',
    benefits: ['연구개발비 세액공제', '전문연구요원 배정', 'R&D 과제 수주 가점'],
    image: 'certLab' as const,
  },
  {
    name: 'ISO 인증',
    desc: '국제 표준 품질경영시스템',
    benefits: ['수출 경쟁력 강화', '입찰 참가 자격', '기업 신뢰도 향상'],
    image: 'certIso' as const,
  },
  {
    name: '여성기업인증',
    desc: '여성이 대표인 기업',
    benefits: ['공공입찰 우대 (5% 가점)', '정책자금 금리 우대', '특화 지원 프로그램'],
    image: 'certWoman' as const,
  },
]

export default function CertificationPage() {
  const [activeBenefitTab, setActiveBenefitTab] = useState(0)
  const [activeReadyTab, setActiveReadyTab] = useState(0)

  return (
    <>
      <style>{`
        .mobile-br{display:none}
        .boas-cert-hero{background:linear-gradient(135deg,#FFFFFF 0%,var(--boas-bg-ivory) 100%);padding:0;margin:0;min-height:auto;display:flex;align-items:flex-start}
        .boas-cert-hero-container{max-width:1200px;margin:0 auto;padding:60px 48px;display:grid;grid-template-columns:1.2fr 1fr;gap:64px;align-items:center;width:100%}
        .boas-cert-hero-content{max-width:600px}
        .boas-cert-hero-headline{font-size:48px;font-weight:700;color:var(--boas-text-primary);line-height:1.25;margin-bottom:20px;letter-spacing:-0.02em;animation:fadeInUp .6s ease-out .1s both}
        .boas-cert-hero-subheadline{font-size:18px;color:#666;line-height:1.7;margin-bottom:36px;animation:fadeInUp .6s ease-out .2s both}
        .boas-cert-hero-cta-group{display:flex;gap:16px;flex-wrap:wrap;animation:fadeInUp .6s ease-out .3s both}
        .boas-cert-hero-visual{position:relative;display:flex;align-items:center;justify-content:center;animation:fadeIn .8s ease-out .5s both}
        .boas-cert-hero-visual img{width:100%;max-width:500px;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:16px;box-shadow:0 24px 48px rgba(0, 212, 216,0.15)}
        .boas-cert-hero-disclaimer{font-size:13px;color:#999;line-height:1.6;margin-top:20px;animation:fadeInUp .6s ease-out .4s both}

        .boas-cert-category{background:linear-gradient(180deg,#f7f5f0 0%,var(--boas-bg-ivory) 100%);padding:80px 0}
        .boas-cert-grid{display:grid;grid-template-columns:repeat(3,340px);gap:30px;justify-content:center}
        .boas-cert-card{background:#fff;border:1px solid var(--boas-primary-pale);border-radius:12px;padding:32px 24px;text-align:center;transition:all .3s ease;cursor:pointer;display:flex;flex-direction:column;align-items:center}
        .boas-cert-card:hover{transform:translateY(-8px);box-shadow:0 12px 24px rgba(0, 212, 216,0.2);border-color:var(--boas-primary)}
        .boas-cert-logo{width:100px;height:100px;object-fit:contain;margin-bottom:20px}
        .boas-cert-name{font-size:18px;font-weight:600;color:var(--boas-text-primary);margin-bottom:12px;line-height:1.4}
        .boas-cert-description{font-size:14px;color:#666;line-height:1.5;margin-bottom:20px;min-height:42px}
        .boas-cert-benefits{width:auto;padding-top:20px;border-top:1px solid var(--boas-primary-pale);display:flex;flex-direction:column;align-items:flex-start}
        .boas-benefit-item{display:grid;grid-template-columns:16px 1fr;gap:8px;align-items:center;font-size:13px;color:#666;margin-bottom:8px;text-align:left}
        .boas-benefit-item:last-child{margin-bottom:0}
        .boas-benefit-item svg{width:16px;height:16px;flex-shrink:0;fill:var(--boas-primary)}
        .boas-cert-category-cta{text-align:center;margin-top:40px}

        .boas-cert-cta-bar{background:linear-gradient(135deg,var(--boas-primary) 0%,var(--boas-primary-dark) 100%);padding:48px 40px;text-align:center}
        .boas-cert-cta-text{font-size:42px;font-weight:700;font-style:italic;color:#fff;line-height:1.6;margin:0;letter-spacing:-0.02em}
        .boas-cert-cta-text .highlight{font-weight:800;color:#FFF9F0;text-shadow:0 2px 4px rgba(0,0,0,0.1)}

        .boas-cert-benefit-section{background:#fff;padding:80px 0}
        .boas-benefit-tabs{display:flex;justify-content:center;gap:12px;margin-bottom:40px;flex-wrap:wrap;max-width:1080px;margin-left:auto;margin-right:auto}
        .boas-benefit-tab-btn{background:#fff;border:2px solid var(--boas-primary-pale);border-radius:12px;padding:12px 24px;font-size:16px;font-weight:600;color:#666;cursor:pointer;transition:all .3s ease;width:160px;white-space:nowrap;outline:none}
        .boas-benefit-tab-btn:hover{border-color:var(--boas-primary);background:var(--boas-primary-pale)}
        .boas-benefit-tab-btn.active{background:linear-gradient(135deg,var(--boas-primary) 0%,var(--boas-primary-dark) 100%);border-color:var(--boas-primary);color:#fff}
        .boas-benefit-card-container{position:relative;min-height:480px;max-width:1080px;margin:0 auto}
        .boas-benefit-detail-card{display:grid;grid-template-columns:320px 1fr;gap:60px;align-items:center;background:#fff;border:1px solid var(--boas-primary-pale);border-radius:20px;padding:60px;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
        .boas-benefit-icon-wrap{width:320px;height:320px;border-radius:16px;overflow:hidden}
        .boas-benefit-icon-wrap img{width:100%;height:100%;object-fit:cover}
        .boas-benefit-detail-content{display:flex;flex-direction:column;justify-content:center}
        .boas-benefit-detail-title{font-size:28px;font-weight:700;color:var(--boas-text-primary);margin-bottom:16px;line-height:1.2}
        .boas-benefit-stat{font-size:48px;font-weight:700;background:linear-gradient(135deg,var(--boas-primary) 0%,var(--boas-primary-dark) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:16px;line-height:1;letter-spacing:-0.02em}
        .boas-benefit-detail-desc{font-size:16px;color:#666;line-height:1.6;margin-bottom:24px}
        .boas-benefit-detail-list{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
        .boas-benefit-detail-list li{font-size:15px;color:#666;line-height:1.6;padding-left:24px;position:relative}
        .boas-benefit-detail-list li::before{content:'\\2022';position:absolute;left:0;color:var(--boas-primary);font-weight:700;font-size:18px}

        .boas-cert-ready{background:var(--boas-bg-ivory);padding:80px 0}
        .boas-ready-tabs{display:flex;justify-content:center;gap:12px;margin-bottom:40px;flex-wrap:wrap;max-width:1080px;margin-left:auto;margin-right:auto}
        .boas-ready-tab-btn{background:#fff;border:2px solid var(--boas-primary-pale);border-radius:12px;padding:12px 20px;font-size:15px;font-weight:600;color:#666;cursor:pointer;transition:all .3s ease;outline:none;width:150px;white-space:nowrap}
        .boas-ready-tab-btn:hover{border-color:var(--boas-primary);background:#fff;transform:translateY(-2px)}
        .boas-ready-tab-btn.active{background:var(--boas-primary);border-color:var(--boas-primary);color:#fff}
        .boas-ready-card-container{position:relative;min-height:480px;max-width:1080px;margin:0 auto}
        .boas-ready-card{background:#fff;border:1px solid var(--boas-primary-pale);border-radius:20px;padding:48px;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
        .boas-ready-header{text-align:center;margin-bottom:36px;padding-bottom:28px;border-bottom:2px solid var(--boas-primary-pale)}
        .boas-ready-title{font-size:28px;font-weight:700;color:var(--boas-text-primary);margin-bottom:12px;line-height:1.2}
        .boas-ready-description{font-size:15px;color:#666;line-height:1.6}
        .boas-checklist{display:grid;grid-template-columns:repeat(2,1fr);gap:20px 36px;max-width:900px;margin:0 auto}
        .boas-checklist-item{display:flex;align-items:flex-start;gap:14px}
        .boas-check-icon{flex-shrink:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:var(--boas-primary);border-radius:50%;margin-top:2px}
        .boas-check-icon svg{width:14px;height:14px;stroke:#fff;stroke-width:3}
        .boas-checklist-text{flex:1;font-size:16px;font-weight:500;color:#333;line-height:1.6}
        .boas-ready-cta{text-align:center;margin-top:36px;padding-top:28px;border-top:2px solid var(--boas-primary-pale)}

        .boas-cert-final-cta{background:#fff;padding:80px 0;text-align:center}
        .boas-cert-final-cta-text{font-size:42px;font-weight:700;color:var(--boas-text-primary);line-height:1.4;margin-bottom:20px;letter-spacing:-0.02em}
        .boas-cert-final-cta-text .highlight{color:var(--boas-primary)}
        .boas-cert-final-cta-sub{font-size:18px;color:#666;line-height:1.6;margin-bottom:36px}
        .boas-cert-final-cta-buttons{display:flex;justify-content:center;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:28px}
        .boas-cert-final-cta-links{display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap}
        .boas-cert-final-link{display:inline-flex;align-items:center;gap:8px;font-size:16px;font-weight:500;color:#666;text-decoration:none;transition:all .3s ease}
        .boas-cert-final-link:hover{color:var(--boas-primary);transform:translateX(4px)}
        .boas-cert-final-link svg{width:18px;height:18px;color:var(--boas-primary)}

        @media(max-width:1023px){
          .boas-cert-hero-container{padding:60px 40px;gap:48px;grid-template-columns:1fr 1fr}
          .boas-cert-hero-headline{font-size:40px}
          .boas-cert-grid{grid-template-columns:repeat(3,1fr);gap:20px}
          .boas-cert-cta-text{font-size:32px}
          .boas-benefit-detail-card{grid-template-columns:280px 1fr;gap:40px;padding:48px}
          .boas-benefit-icon-wrap{width:280px;height:280px}
          .boas-cert-final-cta-text{font-size:36px}
        }
        @media(max-width:767px){
          .mobile-br{display:inline}
          .boas-cert-hero-container{grid-template-columns:1fr;padding:0;gap:0;text-align:center}
          .boas-cert-hero-content{max-width:100%;padding:40px 20px;order:1}
          .boas-cert-hero-headline{font-size:26px;margin-bottom:16px;line-height:1.35;word-break:keep-all}
          .boas-cert-hero-subheadline{font-size:14px;margin-bottom:28px}
          .boas-cert-hero-cta-group{flex-direction:column;gap:12px}
          .boas-cert-hero-cta-group .boas-cta-primary,.boas-cert-hero-cta-group .boas-cta-ghost{width:100%;justify-content:center}
          .boas-cert-hero-visual{order:-1;width:100%}
          .boas-cert-hero-visual img{max-width:100%;width:100%;aspect-ratio:4/5;border-radius:0;box-shadow:none}
          .boas-section-title{font-size:18px;word-break:keep-all}
          .boas-cert-category{padding:48px 0}
          .boas-cert-grid{grid-template-columns:repeat(3,1fr);gap:12px;padding:0 8px}
          .boas-cert-card{padding:16px 8px;border-radius:8px}
          .boas-cert-logo{width:56px;height:56px;margin-bottom:8px}
          .boas-cert-name{font-size:10.5px;margin-bottom:0;line-height:1.3;word-break:keep-all}
          .boas-cert-description,.boas-cert-benefits{display:none}
          .boas-cert-category-cta{margin-top:24px}
          .boas-cert-cta-bar{padding:32px 20px}
          .boas-cert-cta-text{font-size:22px;line-height:1.7;text-wrap:balance}
          .boas-cert-benefit-section{padding:48px 0}
          .boas-benefit-tabs{gap:8px;padding:0 8px}
          .boas-benefit-tab-btn{font-size:13px;padding:10px 12px;flex:1;min-width:calc(50% - 4px);max-width:none;width:auto}
          .boas-benefit-card-container{min-height:400px}
          .boas-benefit-detail-card{grid-template-columns:1fr;gap:24px;padding:32px 24px;text-align:center}
          .boas-benefit-icon-wrap{width:160px;height:160px;margin:0 auto}
          .boas-benefit-detail-title{font-size:22px}
          .boas-benefit-stat{font-size:36px}
          .boas-benefit-detail-desc{font-size:14px;margin-bottom:0}
          .boas-benefit-detail-list{display:none}
          .boas-cert-ready{padding:48px 0}
          .boas-ready-tabs{gap:8px;padding:0 8px}
          .boas-ready-tab-btn{font-size:10px;padding:10px 8px;flex:1;min-width:calc(33.33% - 6px);max-width:none;width:auto}
          .boas-ready-card-container{min-height:520px}
          .boas-ready-card{padding:32px 20px}
          .boas-ready-header{margin-bottom:28px;padding-bottom:20px}
          .boas-ready-title{font-size:20px;margin-bottom:10px}
          .boas-ready-description{font-size:13px}
          .boas-checklist{grid-template-columns:1fr;gap:16px}
          .boas-checklist-item{gap:12px}
          .boas-check-icon{width:20px;height:20px}
          .boas-check-icon svg{width:12px;height:12px}
          .boas-checklist-text{font-size:12px;line-height:1.4}
          .boas-ready-cta{margin-top:28px;padding-top:20px}
          .boas-ready-cta .boas-cta-primary{width:100%;justify-content:center}
          .boas-cert-final-cta{padding:48px 20px}
          .boas-cert-final-cta-text{font-size:22px;word-break:keep-all;text-wrap:balance}
          .boas-cert-final-cta-sub{font-size:14px;margin-bottom:28px}
          .boas-cert-final-cta-buttons{flex-direction:column;gap:12px}
          .boas-cert-final-cta-buttons .boas-cta-primary{width:100%;justify-content:center}
          .boas-cert-final-cta-links{flex-direction:column;gap:16px}
        }
      `}</style>

      {/* Hero Section */}
      <section className="boas-cert-hero">
        <div className="boas-cert-hero-container">
          <div className="boas-cert-hero-content">
            <h1 className="boas-cert-hero-headline">
              기업인증 하나로<br/>
              혜택은 여러 가지
            </h1>

            <p className="boas-cert-hero-subheadline">
              세제 감면, 정책자금 우대, 입찰 가점까지<br/>
              벤처·이노비즈 인증으로 성장 기회를 넓히세요
            </p>

            <div className="boas-cert-hero-cta-group">
              <Link href="/contact#boas-contact-form" className="boas-cta-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                무료 인증 진단 신청
              </Link>

              <a href="tel:1533-9269" className="boas-cta-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                전화 상담하기
              </a>
            </div>

            <p className="boas-cert-hero-disclaimer">
              기업 현황에 맞는 최적의 인증을 안내합니다.<br/>
              인증 취득을 위한 전문 컨설팅을 제공합니다.
            </p>
          </div>

          <div className="boas-cert-hero-visual">
            <Image unoptimized src={IMAGES.certHero} alt="보아스 경영지원솔루션 - 기업인증 컨설팅" width={500} height={500} priority />
          </div>
        </div>
      </section>

      {/* Certification Category Section */}
      <section className="boas-cert-category">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">보아스 경영지원솔루션이 지원하는 중소기업 인증</h2>
            <p className="boas-section-subtitle">귀사에 맞는 최적의 기업인증을 찾아드립니다</p>
          </div>

          <div className="boas-cert-grid">
            {CERT_CARDS.map((cert, i) => (
              <div key={i} className="boas-cert-card">
                <Image src={IMAGES[cert.image]} alt={cert.name} width={100} height={100} className="boas-cert-logo" />
                <h3 className="boas-cert-name">{cert.name}</h3>
                <p className="boas-cert-description">{cert.desc}</p>
                <div className="boas-cert-benefits">
                  {cert.benefits.map((b, j) => (
                    <div key={j} className="boas-benefit-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="boas-cert-category-cta">
            <Link href="/contact#boas-contact-form" className="boas-cta-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              무료심사 신청하기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="boas-cert-cta-bar">
        <p className="boas-cert-cta-text">
          우리 기업에 맞는 <span className="highlight">인증</span>, 지금 무료로 <span className="highlight">진단</span>하세요
        </p>
      </section>

      {/* Benefits Section */}
      <section className="boas-cert-benefit-section">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">벤처·이노비즈 인증의 실질적 혜택</h2>
            <p className="boas-section-subtitle">인증 취득 후 받을 수 있는 세제감면·자금우대 혜택</p>
          </div>

          <div className="boas-benefit-tabs">
            {BENEFIT_TABS.map((tab, i) => (
              <button
                key={i}
                className={`boas-benefit-tab-btn${activeBenefitTab === i ? ' active' : ''}`}
                onClick={() => setActiveBenefitTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="boas-benefit-card-container">
            {BENEFIT_TABS.map((tab, i) => (
              <div
                key={i}
                className="boas-benefit-detail-card"
                style={{ display: activeBenefitTab === i ? 'grid' : 'none' }}
              >
                <div className="boas-benefit-icon-wrap">
                  <Image unoptimized src={IMAGES[tab.image]} alt={tab.title} width={320} height={320} />
                </div>
                <div className="boas-benefit-detail-content">
                  <h3 className="boas-benefit-detail-title">{tab.title}</h3>
                  <div className="boas-benefit-stat">{tab.stat}</div>
                  <p className="boas-benefit-detail-desc">{tab.desc}</p>
                  <ul className="boas-benefit-detail-list">
                    {tab.list.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready Section (인증 요건) */}
      <section className="boas-cert-ready">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">기업인증별 요건 및 준비사항</h2>
            <p className="boas-section-subtitle">우리 기업이 갖춰야 할 인증 조건을 확인하세요</p>
          </div>

          <div className="boas-ready-tabs">
            {READY_TABS.map((tab, i) => (
              <button
                key={i}
                className={`boas-ready-tab-btn${activeReadyTab === i ? ' active' : ''}`}
                onClick={() => setActiveReadyTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="boas-ready-card-container">
            {READY_TABS.map((tab, i) => (
              <div
                key={i}
                className="boas-ready-card"
                style={{ display: activeReadyTab === i ? 'block' : 'none' }}
              >
                <div className="boas-ready-header">
                  <h3 className="boas-ready-title">{tab.title}</h3>
                  <p className="boas-ready-description">{tab.desc}</p>
                </div>

                <div className="boas-checklist">
                  {tab.items.map((item, j) => (
                    <div key={j} className="boas-checklist-item">
                      <div className="boas-check-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <span className="boas-checklist-text">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="boas-ready-cta">
                  <Link href="/contact#boas-contact-form" className="boas-cta-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    무료심사 신청하기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="boas-cert-final-cta">
        <div className="boas-section-container">
          <h2 className="boas-cert-final-cta-text">
            우리 기업에 맞는 인증,<br/>
            <span className="highlight">무료 진단으로 확인하세요</span>
          </h2>
          <p className="boas-cert-final-cta-sub">
            무료 인증 진단으로 최적의 인증을<br/>먼저 파악하고 시작하세요
          </p>

          <div className="boas-cert-final-cta-buttons">
            <Link href="/contact#boas-contact-form" className="boas-cta-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              무료 인증 심사 신청하기
            </Link>
          </div>

          <div className="boas-cert-final-cta-links">
            <a href="tel:1533-9269" className="boas-cert-final-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              전화 심사: 1533-9269
            </a>
            <Link href="/fund" className="boas-cert-final-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              정책자금 알아보기
            </Link>
            <Link href="/success" className="boas-cert-final-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              성공사례 확인하기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
