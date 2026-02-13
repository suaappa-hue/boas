import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'
import { pageMetadata } from '@/lib/seo/metadata'
import {
  organizationSchema,
  webSiteSchema,
  localBusinessSchema,
  faqSchema,
  howToSchema,
} from '@/lib/seo/schemas'

export const metadata: Metadata = pageMetadata.home

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationSchema(),
            webSiteSchema(),
            localBusinessSchema(),
            faqSchema(),
            howToSchema(),
          ]),
        }}
      />

      {/* Hero Section */}
      <section id="boas-hero" className="boas-hero">
        <div className="boas-hero-container">
          {/* Left: Main Copy */}
          <div className="boas-hero-content">
            <div className="boas-hero-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              중소기업 정책자금 전문
            </div>

            <h1 className="boas-hero-headline">
              기업의 성장 가능성을 분석해<br/>
              <span className="highlight">맞춤 자금</span>을 설계합니다
            </h1>

            <p className="boas-hero-subheadline">
              정책자금 심사부터 기업인증 컨설팅까지,<br/>
              전담 컨설턴트가 1:1 맞춤 상담합니다.
            </p>

            <div className="boas-hero-cta-group">
              <Link href="/contact#boas-contact-form" className="boas-cta-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                무료 심사 신청
              </Link>

              <Link href="/fund" className="boas-cta-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 16 16 12 12 8"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                정책자금 안내
              </Link>
            </div>

            <p className="boas-hero-disclaimer">
              ※ 대표자 개인역량 및 성장잠재력을 분석합니다.<br/>
              정책자금 서류작성 및 접수대행을 하지 않습니다.
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="boas-hero-visual">
            <Image unoptimized src={IMAGES.serviceConsulting} alt="보아스 경영지원솔루션 - 정책자금 컨설팅" width={500} height={500} priority />
          </div>
        </div>
      </section>

      {/* Interest Section - Rate Comparison */}
      <section id="boas-interest" className="boas-interest">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">은행 대출 대비<br/>연 300만원 절감<br/>중소기업 정책자금</h2>
          </div>

          {/* Rate Comparison Grid */}
          <div className="boas-rate-grid">
            {/* Card 1: Policy Fund (Highlight) */}
            <div className="boas-rate-card highlight">
              <span className="boas-essential-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                필수체크
              </span>
              <span className="boas-card-badge">가장 저렴</span>

              <div className="boas-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>

              <h3 className="boas-card-label">정책자금</h3>
              <div className="boas-rate-percent">3.5%</div>
              <div className="boas-rate-amount">350만원</div>
            </div>

            {/* Card 2: Bank Loan */}
            <div className="boas-rate-card">
              <span className="boas-card-top-badge">연 300만원 손실</span>

              <div className="boas-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h3 className="boas-card-label">은행 대출</h3>
              <div className="boas-rate-percent">6.5%</div>
              <div className="boas-rate-amount">650만원</div>
              <div className="boas-rate-loss">연 300만원 손실</div>
            </div>

            {/* Card 3: Card Loan */}
            <div className="boas-rate-card">
              <span className="boas-card-top-badge">연 1,150만원 손실</span>

              <div className="boas-card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>

              <h3 className="boas-card-label">카드론</h3>
              <div className="boas-rate-percent">15%</div>
              <div className="boas-rate-amount">1,500만원</div>
              <div className="boas-rate-loss">연 1,150만원 손실</div>
            </div>
          </div>

          <p className="boas-rate-note">※ 1년 기준, 1억원 대출 시 연간 이자 금액</p>

          {/* Highlight Message */}
          <div className="boas-highlight-message">
            <div className="boas-highlight-text">
              정책자금으로 최대<br/>
              <span className="emphasis">1,150만원</span>
              이자부담 절약가능
            </div>
            <p className="boas-disclaimer">
              ※ 개인 및 기업의 신용에 따라 자금 규모와<br/>
              적합여부가 달라질 수 있습니다.
            </p>
          </div>

          {/* CTA Button */}
          <div className="boas-interest-cta">
            <Link href="/contact#boas-contact-form" className="boas-cta-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              무료심사 자격 확인
            </Link>
            <p className="boas-disclaimer">
              ※ 개인 및 기업의 신용에 따라 자금 규모와<br/>
              적합여부가 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bar */}
      <section className="boas-cta-bar">
        <div className="boas-cta-bar-container">
          <p className="boas-cta-text">
            중소기업 대표님,<br className="mobile-br"/>
            <span className="highlight">무료 상담</span>으로 <span className="highlight">자금조달 방안</span> 확인하세요
          </p>
        </div>
      </section>

      {/* Core Services Section */}
      <section id="boas-core" className="boas-core">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">보아스 경영지원솔루션 핵심 서비스</h2>
            <p className="boas-section-subtitle">대표자 역량분석 기반<br className="mobile-br"/>맞춤형 자금 전략을 수립합니다</p>
          </div>

          <div className="boas-service-grid">
            {/* Card 1: Policy Fund Consulting */}
            <Link href="/fund" className="boas-service-card">
              <Image quality={90} src={IMAGES.serviceFund} alt="정책자금 컨설팅" width={400} height={250} className="boas-service-image" />
              <div className="boas-service-content">
                <div className="boas-service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <h3 className="boas-service-title">정책자금 컨설팅</h3>
                <p className="boas-service-description">
                  저금리 중소기업 정책자금<br/>
                  으로 성장 기반을 마련하고<br/>
                  맞춤 전략을 수립합니다.
                </p>
                <span className="boas-service-link">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>

            {/* Card 2: Certification Consulting */}
            <Link href="/certification" className="boas-service-card">
              <Image quality={90} src={IMAGES.serviceCert} alt="인증 컨설팅" width={400} height={250} className="boas-service-image" />
              <div className="boas-service-content">
                <div className="boas-service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                </div>
                <h3 className="boas-service-title">인증 컨설팅</h3>
                <p className="boas-service-description">
                  벤처·이노비즈 등<br/>
                  기업인증으로 세제혜택과<br/>
                  자금우대를 확보합니다.
                </p>
                <span className="boas-service-link">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>

            {/* Card 3: Success Cases */}
            <Link href="/success" className="boas-service-card">
              <Image quality={90} src={IMAGES.serviceSuccess} alt="성공사례" width={400} height={250} className="boas-service-image" />
              <div className="boas-service-content">
                <div className="boas-service-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="boas-service-title">성공사례</h3>
                <p className="boas-service-description">
                  보아스 경영지원솔루션과 함께한<br/>
                  중소기업의 실제 자금<br/>
                  조달 사례를 확인하세요.
                </p>
                <span className="boas-service-link">
                  자세히 보기
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="boas-info" className="boas-info">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">보아스 경영지원솔루션이<br/>선택받는 이유</h2>
            <p className="boas-section-subtitle">많은 중소기업 대표님이 보아스 경영지원솔루션을 찾는 이유</p>
          </div>

          {/* Differentiation Points Grid */}
          <div className="boas-points-grid">
            {/* Point 1: Free Diagnosis */}
            <div className="boas-point-card">
              <Image quality={90} src={IMAGES.pointFree} alt="무료 진단" width={400} height={250} className="boas-point-image" />
              <div className="boas-point-content">
                <div className="boas-point-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="boas-point-title">무료 현황분석</h3>
                <p className="boas-point-description">
                  비용 없이 시작하세요.<br/>
                  기업 현황과 대표님 역량을 분석하고<br/>
                  적합한 정책자금을 안내합니다.
                </p>
              </div>
            </div>

            {/* Point 2: 1:1 Custom Consulting */}
            <div className="boas-point-card">
              <Image quality={90} src={IMAGES.pointCustom} alt="1:1 맞춤 컨설팅" width={400} height={250} className="boas-point-image" />
              <div className="boas-point-content">
                <div className="boas-point-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="boas-point-title">1:1 맞춤 컨설팅</h3>
                <p className="boas-point-description">
                  획일적인 컨설팅이 아닙니다.<br/>
                  대표님 기업에 꼭 맞는<br/>
                  자금조달 전략을 수립해드립니다.
                </p>
              </div>
            </div>

            {/* Point 3: Transparent Process */}
            <div className="boas-point-card">
              <Image quality={90} src={IMAGES.pointTransparent} alt="투명한 프로세스" width={400} height={250} className="boas-point-image" />
              <div className="boas-point-content">
                <div className="boas-point-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="boas-point-title">투명한 프로세스</h3>
                <p className="boas-point-description">
                  컨설팅 과정을 실시간 투명하게 공유하며,<br/>
                  불필요한 비용은<br/>
                  절대 제안하지 않습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Expert Section */}
          <div className="boas-expert-header">
            <h3 className="boas-expert-title">정책자금 전문 컨설턴트</h3>
            <p className="boas-expert-subtitle">풍부한 경험과 전문성으로<br className="mobile-br"/>중소기업 성장을 지원합니다</p>
          </div>

          <div className="boas-expert-grid">
            <div className="boas-expert-card">
              <div className="boas-expert-profile">
                <div className="boas-expert-photo">
                  <Image src="/images/profile.jpg" alt="김광진 대표 컨설턴트" width={200} height={200} />
                </div>
                <h4 className="boas-expert-name">김광진</h4>
                <p className="boas-expert-role">기업심사관</p>
              </div>
              <div className="boas-expert-message">
                <p className="boas-expert-greeting">안녕하세요, 보아스 경영지원솔루션입니다.</p>
                <p className="boas-expert-description">
                  많은 중소기업 대표님께서 좋은 기술력을 갖추고도 자금 부족으로 성장 기회를 놓치는 모습을 보며 안타까움을 느꼈습니다.
                  그래서 저는 대표님의 역량과 기업 잠재력을 정밀 분석하여, 가장 적합한 정책자금 솔루션을 찾아드리고자 합니다.
                  <br/><br/>
                  단순한 서류 대행이 아닌, 대표님의 비전을 함께 고민하고 자금조달을 지원하는 든든한 파트너가 되겠습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Customer Reviews */}
      <section id="boas-story" className="boas-story">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">정책자금 상담 후기</h2>
            <p className="boas-section-subtitle">실제 이용하신 대표님들의<br className="mobile-br"/> 생생한 컨설팅 후기를 확인하세요</p>
          </div>

          <div className="boas-review-scroll-wrapper">
            <div className="boas-review-scroll-container">
              {/* First Set */}
              <div className="boas-review-card">
                <span className="boas-review-industry">대전 제조업 대표님</span>
                <p className="boas-review-text">다른 업체는 상담 후 연락이 두절되는 경우가 많았는데, 보아스 경영지원솔루션은 처음부터 끝까지 책임감 있게 진행해주셔서 정말 신뢰할 수 있었습니다. 정책자금 받는 과정이 이렇게 안심되는 줄 몰랐어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">세종 식품업 대표님</span>
                <p className="boas-review-text">제가 직접 은행에 알아봤을 때는 5천만원 한도였는데, 보아스 경영지원솔루션을 통해 정책자금을 알아보니 더 좋은 조건을 찾을 수 있었어요. 덕분에 사업 확장 계획을 앞당길 수 있었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">천안 IT 대표님</span>
                <p className="boas-review-text">정책자금 종류가 이렇게 많은지 몰랐어요. 저희 회사 상황에 딱 맞는 자금을 추천해주시고, 신청 절차까지 상세히 안내해주셔서 헤매지 않고 진행할 수 있었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">공주 유통업 대표님</span>
                <p className="boas-review-text">문의사항이 생길 때마다 빠르게 답변해주셔서 답답함이 없었어요. 다른 컨설팅 업체는 연락이 잘 안 되던데, 여기는 카톡으로도 실시간 소통이 가능해서 정말 편했습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">논산 건설업 대표님</span>
                <p className="boas-review-text">솔직히 처음엔 반신반의했는데, 실제로 정책자금이 일반 대출보다 금리가 낮더라고요. 이자 부담이 확 줄어드니까 회사 운영이 훨씬 여유로워졌습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">아산 제조업 대표님</span>
                <p className="boas-review-text">정책자금이 이렇게 금리가 낮고 조건이 좋은 줄 전혀 몰랐습니다. 일반 대출만 알고 있었는데, 보아스 경영지원솔루션에서 정책자금의 장점을 하나하나 설명해주셔서 눈이 확 뜨였어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">보령 서비스업 대표님</span>
                <p className="boas-review-text">저희 회사 업종과 규모에 맞는 정책자금을 정확히 찾아주셨어요. 전문가의 노하우가 확실히 다르다는 걸 느꼈습니다. 혼자 알아봤으면 이런 좋은 조건의 자금은 못 찾았을 거예요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">서산 물류업 대표님</span>
                <p className="boas-review-text">절차가 투명하고, 추가 비용이나 숨은 수수료 같은 게 전혀 없어서 믿고 맡길 수 있었어요. 처음부터 모든 과정을 명확하게 설명해주시니까 불안감이 없었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">당진 도소매업 대표님</span>
                <p className="boas-review-text">다른 업체는 전화 한 통으로 끝나는 느낌이었는데, 여기는 정말 세심하게 챙겨주셔서 감동했어요. 제 상황을 꼼꼼히 파악하고 최선의 방법을 찾아주려고 노력하시는 게 느껴졌습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">홍성 무역업 대표님</span>
                <p className="boas-review-text">혼자 준비하다가 너무 복잡해서 포기하려던 참이었어요. 그런데 보아스 경영지원솔루션에서 끝까지 함께 해주셔서 결국 정책자금 신청을 무사히 마칠 수 있었습니다. 정말 감사드립니다.</p>
              </div>

              {/* Second Set (duplicate for infinite scroll) */}
              <div className="boas-review-card">
                <span className="boas-review-industry">대전 제조업 대표님</span>
                <p className="boas-review-text">다른 업체는 상담 후 연락이 두절되는 경우가 많았는데, 보아스 경영지원솔루션은 처음부터 끝까지 책임감 있게 진행해주셔서 정말 신뢰할 수 있었습니다. 정책자금 받는 과정이 이렇게 안심되는 줄 몰랐어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">세종 식품업 대표님</span>
                <p className="boas-review-text">제가 직접 은행에 알아봤을 때는 5천만원 한도였는데, 보아스 경영지원솔루션을 통해 정책자금을 알아보니 더 좋은 조건을 찾을 수 있었어요. 덕분에 사업 확장 계획을 앞당길 수 있었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">천안 IT 대표님</span>
                <p className="boas-review-text">정책자금 종류가 이렇게 많은지 몰랐어요. 저희 회사 상황에 딱 맞는 자금을 추천해주시고, 신청 절차까지 상세히 안내해주셔서 헤매지 않고 진행할 수 있었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">공주 유통업 대표님</span>
                <p className="boas-review-text">문의사항이 생길 때마다 빠르게 답변해주셔서 답답함이 없었어요. 다른 컨설팅 업체는 연락이 잘 안 되던데, 여기는 카톡으로도 실시간 소통이 가능해서 정말 편했습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">논산 건설업 대표님</span>
                <p className="boas-review-text">솔직히 처음엔 반신반의했는데, 실제로 정책자금이 일반 대출보다 금리가 낮더라고요. 이자 부담이 확 줄어드니까 회사 운영이 훨씬 여유로워졌습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">아산 제조업 대표님</span>
                <p className="boas-review-text">정책자금이 이렇게 금리가 낮고 조건이 좋은 줄 전혀 몰랐습니다. 일반 대출만 알고 있었는데, 보아스 경영지원솔루션에서 정책자금의 장점을 하나하나 설명해주셔서 눈이 확 뜨였어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">보령 서비스업 대표님</span>
                <p className="boas-review-text">저희 회사 업종과 규모에 맞는 정책자금을 정확히 찾아주셨어요. 전문가의 노하우가 확실히 다르다는 걸 느꼈습니다. 혼자 알아봤으면 이런 좋은 조건의 자금은 못 찾았을 거예요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">서산 물류업 대표님</span>
                <p className="boas-review-text">절차가 투명하고, 추가 비용이나 숨은 수수료 같은 게 전혀 없어서 믿고 맡길 수 있었어요. 처음부터 모든 과정을 명확하게 설명해주시니까 불안감이 없었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">당진 도소매업 대표님</span>
                <p className="boas-review-text">다른 업체는 전화 한 통으로 끝나는 느낌이었는데, 여기는 정말 세심하게 챙겨주셔서 감동했어요. 제 상황을 꼼꼼히 파악하고 최선의 방법을 찾아주려고 노력하시는 게 느껴졌습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">홍성 무역업 대표님</span>
                <p className="boas-review-text">혼자 준비하다가 너무 복잡해서 포기하려던 참이었어요. 그런데 보아스 경영지원솔루션에서 끝까지 함께 해주셔서 결국 정책자금 신청을 무사히 마칠 수 있었습니다. 정말 감사드립니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
