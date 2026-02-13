import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'
import EmployeeSection from '@/components/site/EmployeeSection'
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
              대표님의 역량을 읽고<br/>
              <span className="highlight">자금의 길</span>을 열어드립니다
            </h1>

            <p className="boas-hero-subheadline">
              경영컨설턴트 전문가가 대표자 역량을 직접 분석하고,<br/>
              기업에 가장 유리한 정책자금 전략을 설계합니다.
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
              ※ 대표자 개인역량 및 기업 성장잠재력을 심층 분석합니다.<br/>
              정책자금 서류작성 및 접수대행은 하지 않습니다.
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
            대표님의 기업,<br className="mobile-br"/>
            <span className="highlight">정책자금</span> 대상인지 <span className="highlight">무료로 확인</span>해보세요
          </p>
        </div>
      </section>

      {/* Core Services Section */}
      <section id="boas-core" className="boas-core">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">보아스가 제공하는<br/>세 가지 핵심 솔루션</h2>
            <p className="boas-section-subtitle">전문가의 시선으로 기업을 분석하고,<br className="mobile-br"/>최적의 자금 경로를 찾아드립니다</p>
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
                  대표님 기업의 재무구조와<br/>
                  성장단계에 맞는 저금리<br/>
                  정책자금을 설계합니다.
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
                  벤처·이노비즈·메인비즈 등<br/>
                  인증 취득으로 세제감면과<br/>
                  정책자금 우대를 확보합니다.
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
                  보아스와 함께 정책자금을<br/>
                  확보한 수도권·충청 지역<br/>
                  중소기업의 실제 사례입니다.
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
            <h2 className="boas-section-title">대표님들이<br/>보아스를 선택하는 이유</h2>
            <p className="boas-section-subtitle">전문 경영컨설턴트의 정밀 분석, 그 차이를 경험하세요</p>
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
                  비용 부담 없이 시작하세요.<br/>
                  대표님의 경력·역량과 기업 재무현황을<br/>
                  전문가의 기준으로 분석합니다.
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
                <h3 className="boas-point-title">1:1 전담 컨설팅</h3>
                <p className="boas-point-description">
                  천편일률적인 상담은 하지 않습니다.<br/>
                  업종·매출·성장단계에 따라<br/>
                  최적의 자금조달 로드맵을 수립합니다.
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
                  진행 과정을 단계별로 공유합니다.<br/>
                  불필요한 비용을 제안하지 않으며,<br/>
                  결과로 신뢰를 증명합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Expert Section - 동적 임직원 */}
          <EmployeeSection />
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
                <span className="boas-review-industry">구리 제조업 대표님</span>
                <p className="boas-review-text">처음 상담부터 끝까지 한 분이 전담으로 붙어주셔서 진행 상황을 매번 확인할 필요가 없었어요. 중간에 궁금한 점이 생기면 바로바로 답변해주시고, 정책자금이 이렇게 체계적으로 진행되는 줄 처음 알았습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">남양주 IT 대표님</span>
                <p className="boas-review-text">직접 은행에 갔을 때는 담보가 없다고 한도가 낮았는데, 보아스 경영지원솔루션에서 기술보증 기반 정책자금을 안내받고 훨씬 나은 조건으로 자금을 확보할 수 있었습니다. 개발 인력 충원에 큰 도움이 됐어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">하남 유통업 대표님</span>
                <p className="boas-review-text">정책자금 종류가 이렇게 다양한 줄 몰랐어요. 저희 업종과 매출 규모에 맞는 자금을 콕 집어서 추천해주시니까 선택이 쉬웠습니다. 복잡한 서류 준비도 하나하나 안내해주셔서 수월하게 진행했어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">성남 서비스업 대표님</span>
                <p className="boas-review-text">다른 곳에서는 전화 한 번이면 끝이었는데, 여기는 카톡으로 실시간 소통이 되고 진행 상황도 수시로 공유해주셔서 답답함이 전혀 없었어요. 사후관리까지 챙겨주시는 건 정말 기대 이상이었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">서울 강동 식품업 대표님</span>
                <p className="boas-review-text">반신반의하면서 상담을 받았는데, 정책자금 금리가 시중 대출보다 확연히 낮더라고요. 연간 이자 부담이 줄어드니 그만큼 원재료 투자에 여유가 생겼습니다. 진작 알았으면 좋았을 거예요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">수원 건설업 대표님</span>
                <p className="boas-review-text">정책자금이 이렇게 조건이 좋은 줄 정말 몰랐습니다. 일반 대출만 쓰고 있었는데, 컨설턴트분이 저희 상황에 맞는 자금을 찾아주시면서 금리 차이를 숫자로 보여주시니까 확 와닿더라고요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">용인 물류업 대표님</span>
                <p className="boas-review-text">업종과 기업 규모에 딱 맞는 정책자금을 정확하게 매칭해주셨어요. 혼자 알아봤으면 어디서부터 시작해야 할지 막막했을 텐데, 전문가 도움으로 시간도 절약하고 더 좋은 조건을 찾을 수 있었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">안양 도소매업 대표님</span>
                <p className="boas-review-text">비용이나 수수료 관련해서 처음부터 투명하게 설명해주셔서 불안감 없이 진행할 수 있었어요. 숨겨진 비용이 없으니까 신뢰가 가고, 주변 사장님들에게도 추천하고 있습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">천안 제조업 대표님</span>
                <p className="boas-review-text">제 상황을 꼼꼼히 파악한 뒤에 최적의 방법을 제안해주시는 게 느껴졌어요. 단순히 자금만 연결해주는 게 아니라 재무구조 개선까지 같이 고민해주셔서 장기적으로 큰 도움이 됐습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">세종 무역업 대표님</span>
                <p className="boas-review-text">혼자 준비하다가 서류가 너무 복잡해서 거의 포기했었어요. 보아스 경영지원솔루션에서 전 과정을 같이 점검해주셔서 무사히 마칠 수 있었습니다. 올해 추가 자금도 상담 예정입니다.</p>
              </div>

              {/* Second Set (duplicate for infinite scroll) */}
              <div className="boas-review-card">
                <span className="boas-review-industry">구리 제조업 대표님</span>
                <p className="boas-review-text">처음 상담부터 끝까지 한 분이 전담으로 붙어주셔서 진행 상황을 매번 확인할 필요가 없었어요. 중간에 궁금한 점이 생기면 바로바로 답변해주시고, 정책자금이 이렇게 체계적으로 진행되는 줄 처음 알았습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">남양주 IT 대표님</span>
                <p className="boas-review-text">직접 은행에 갔을 때는 담보가 없다고 한도가 낮았는데, 보아스 경영지원솔루션에서 기술보증 기반 정책자금을 안내받고 훨씬 나은 조건으로 자금을 확보할 수 있었습니다. 개발 인력 충원에 큰 도움이 됐어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">하남 유통업 대표님</span>
                <p className="boas-review-text">정책자금 종류가 이렇게 다양한 줄 몰랐어요. 저희 업종과 매출 규모에 맞는 자금을 콕 집어서 추천해주시니까 선택이 쉬웠습니다. 복잡한 서류 준비도 하나하나 안내해주셔서 수월하게 진행했어요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">성남 서비스업 대표님</span>
                <p className="boas-review-text">다른 곳에서는 전화 한 번이면 끝이었는데, 여기는 카톡으로 실시간 소통이 되고 진행 상황도 수시로 공유해주셔서 답답함이 전혀 없었어요. 사후관리까지 챙겨주시는 건 정말 기대 이상이었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">서울 강동 식품업 대표님</span>
                <p className="boas-review-text">반신반의하면서 상담을 받았는데, 정책자금 금리가 시중 대출보다 확연히 낮더라고요. 연간 이자 부담이 줄어드니 그만큼 원재료 투자에 여유가 생겼습니다. 진작 알았으면 좋았을 거예요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">수원 건설업 대표님</span>
                <p className="boas-review-text">정책자금이 이렇게 조건이 좋은 줄 정말 몰랐습니다. 일반 대출만 쓰고 있었는데, 컨설턴트분이 저희 상황에 맞는 자금을 찾아주시면서 금리 차이를 숫자로 보여주시니까 확 와닿더라고요.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">용인 물류업 대표님</span>
                <p className="boas-review-text">업종과 기업 규모에 딱 맞는 정책자금을 정확하게 매칭해주셨어요. 혼자 알아봤으면 어디서부터 시작해야 할지 막막했을 텐데, 전문가 도움으로 시간도 절약하고 더 좋은 조건을 찾을 수 있었습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">안양 도소매업 대표님</span>
                <p className="boas-review-text">비용이나 수수료 관련해서 처음부터 투명하게 설명해주셔서 불안감 없이 진행할 수 있었어요. 숨겨진 비용이 없으니까 신뢰가 가고, 주변 사장님들에게도 추천하고 있습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">천안 제조업 대표님</span>
                <p className="boas-review-text">제 상황을 꼼꼼히 파악한 뒤에 최적의 방법을 제안해주시는 게 느껴졌어요. 단순히 자금만 연결해주는 게 아니라 재무구조 개선까지 같이 고민해주셔서 장기적으로 큰 도움이 됐습니다.</p>
              </div>

              <div className="boas-review-card">
                <span className="boas-review-industry">세종 무역업 대표님</span>
                <p className="boas-review-text">혼자 준비하다가 서류가 너무 복잡해서 거의 포기했었어요. 보아스 경영지원솔루션에서 전 과정을 같이 점검해주셔서 무사히 마칠 수 있었습니다. 올해 추가 자금도 상담 예정입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
