'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'

export default function FundPage() {
  const [activeTab, setActiveTab] = useState<'fund' | 'consulting'>('fund')

  return (
    <>
      <style>{`
        .boas-fund-hero{background:linear-gradient(135deg,#FFFFFF 0%,var(--dark-bg) 100%);padding:0;margin:0;min-height:auto;display:flex;align-items:flex-start}
        .boas-fund-hero-container{max-width:1200px;margin:0 auto;padding:60px 48px;display:grid;grid-template-columns:1.2fr 1fr;gap:64px;align-items:center;width:100%}
        .boas-fund-hero-content{max-width:600px}
        .boas-fund-hero-headline{font-size:48px;font-weight:700;color:var(--body-text);line-height:1.25;margin-bottom:20px;letter-spacing:-0.02em;animation:fadeInUp .6s ease-out .1s both}
        .boas-fund-hero-subheadline{font-size:18px;font-weight:400;color:#666;line-height:1.7;margin-bottom:36px;animation:fadeInUp .6s ease-out .2s both}
        .boas-fund-hero-cta-group{display:flex;gap:16px;flex-wrap:wrap;animation:fadeInUp .6s ease-out .3s both}
        .boas-fund-hero-visual{position:relative;display:flex;align-items:center;justify-content:center;animation:fadeIn .8s ease-out .5s both}
        .boas-fund-hero-visual img{width:100%;max-width:500px;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:16px;box-shadow:0 24px 48px rgba(0, 212, 216,0.15)}
        .boas-fund-hero-disclaimer{font-size:13px;color:#999;line-height:1.6;margin-top:20px;animation:fadeInUp .6s ease-out .4s both}
        .boas-fund-why{background:var(--dark-bg);padding:80px 0}
        .boas-why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
        .boas-why-card{background:#fff;border:1px solid var(--cyan-lighter);border-radius:12px;padding:0;text-align:center;transition:all .3s ease;overflow:hidden}
        .boas-why-card:hover{transform:translateY(-8px);box-shadow:0 12px 24px rgba(0, 212, 216,0.2);border-color:var(--cyan)}
        .boas-why-image{width:100%;height:200px;object-fit:cover;display:block;transition:transform .3s ease}
        .boas-why-card:hover .boas-why-image{transform:scale(1.05)}
        .boas-why-content{padding:32px 28px}
        .boas-why-title{font-size:24px;font-weight:600;color:var(--body-text);margin-bottom:16px}
        .boas-why-description{font-size:16px;color:#666;line-height:1.6}
        .boas-why-example{background:#fff;border:2px solid var(--cyan);border-radius:12px;padding:32px 24px;margin-top:40px;text-align:center;max-width:600px;margin-left:auto;margin-right:auto;box-shadow:0 4px 16px rgba(0, 212, 216,0.15)}
        .boas-example-desc{font-size:14px;color:#666;line-height:1.5;margin-bottom:12px}
        .boas-example-amount{font-size:28px;font-weight:700;color:var(--cyan);line-height:1.2;margin-bottom:8px;display:block}
        .boas-example-result{font-size:14px;color:#666;line-height:1.5;margin:0;text-wrap:balance}
        .boas-fund-category{background:#fff;padding:80px 0}
        .boas-tab-container{display:flex;flex-direction:column;gap:0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.12)}
        .boas-tab-menu{background:var(--cyan-lighter);padding:0;border-bottom:2px solid var(--cyan-lighter);display:flex;justify-content:center;gap:0}
        .boas-tab-button{flex:0 0 auto;padding:24px 48px;text-align:center;background:transparent;border:none;border-bottom:4px solid transparent;cursor:pointer;transition:all .3s ease;font-size:18px;font-weight:600;color:#666;margin-bottom:-2px;font-family:inherit}
        .boas-tab-button:hover{background:rgba(0, 212, 216,0.1);color:var(--body-text);border-bottom-color:var(--cyan)}
        .boas-tab-button.active{background:#fff;border-bottom-color:var(--cyan);color:var(--body-text)}
        .boas-tab-content{padding:48px;display:none}
        .boas-tab-content.active{display:block;animation:boasFadeIn .4s ease}
        @keyframes boasFadeIn{from{opacity:0}to{opacity:1}}
        .boas-tab-header-image{width:100%;height:auto;aspect-ratio:16/7;object-fit:cover;border-radius:8px;margin-bottom:32px}
        .boas-consulting-items-container{display:flex;flex-direction:column}
        .boas-consulting-item{display:grid;grid-template-columns:280px 1fr;gap:40px;margin-bottom:40px;padding-bottom:40px;border-bottom:1px solid var(--cyan-lighter);align-items:start}
        .boas-consulting-item:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
        .boas-item-icon{width:100%;height:auto;aspect-ratio:1/1;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);transition:all .3s ease}
        .boas-item-icon:hover{box-shadow:0 8px 24px rgba(0, 212, 216,0.25);transform:translateY(-4px)}
        .boas-item-icon img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}
        .boas-item-icon:hover img{transform:scale(1.05)}
        .boas-item-content{display:flex;flex-direction:column;gap:20px}
        .boas-item-header{display:flex;align-items:center;gap:12px}
        .boas-item-number{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:linear-gradient(135deg,var(--cyan),var(--cyan-dark));color:#fff;font-size:18px;font-weight:700;border-radius:50%;flex-shrink:0}
        .boas-item-title{font-size:26px;font-weight:600;color:var(--body-text);margin:0}
        .boas-item-details{display:flex;flex-direction:column;gap:16px}
        .boas-detail-row{display:flex;align-items:baseline;gap:12px}
        .boas-detail-label{font-size:17px;font-weight:600;color:#666;white-space:nowrap;min-width:100px}
        .boas-detail-value{font-size:17px;font-weight:400;color:#666;line-height:1.6}
        .boas-detail-highlight{font-size:24px;font-weight:700;color:var(--cyan);margin-right:4px}
        .boas-consulting-list{list-style:none;padding:0;margin:0}
        .boas-consulting-list li{position:relative;padding-left:28px;margin-bottom:14px;font-size:18px;color:#666;line-height:1.6}
        .boas-consulting-list li:last-child{margin-bottom:0}
        .boas-consulting-list li::before{content:"\\2022";position:absolute;left:8px;color:var(--cyan);font-weight:700;font-size:20px}
        .boas-consulting-list strong{font-weight:600;color:var(--body-text)}
        .boas-fund-process{background:var(--dark-bg);padding:80px 0}
        .boas-process-timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:32px;position:relative}
        .boas-process-timeline::before{content:'';position:absolute;top:64px;left:12%;right:12%;height:2px;background:repeating-linear-gradient(to right,var(--cyan) 0%,var(--cyan) 8px,transparent 8px,transparent 16px);z-index:0}
        .boas-process-step{background:#fff;border:1px solid var(--cyan-lighter);border-radius:12px;padding:32px 24px;text-align:center;position:relative;transition:all .3s ease;z-index:1}
        .boas-process-step:hover{transform:translateY(-8px);box-shadow:0 12px 24px rgba(0, 212, 216,0.2);border-color:var(--cyan)}
        .boas-step-number{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:linear-gradient(135deg,var(--cyan),var(--cyan-dark));color:#fff;font-size:28px;font-weight:700;border-radius:50%;margin-bottom:24px;box-shadow:0 4px 12px rgba(0, 212, 216,0.3)}
        .boas-step-title{font-size:22px;font-weight:600;color:var(--body-text);margin-bottom:16px;line-height:1.3}
        .boas-step-description{list-style:none;padding:0;margin:0;text-align:left}
        .boas-step-description li{position:relative;padding-left:20px;margin-bottom:10px;font-size:15px;color:#666;line-height:1.5}
        .boas-step-description li::before{content:"\\2022";position:absolute;left:4px;color:var(--cyan);font-weight:700;font-size:16px}
        .boas-fund-final-cta{background:var(--cyan-lighter);padding:80px 0}
        .boas-final-cta-container{max-width:1200px;margin:0 auto;padding:0 40px;text-align:center}
        .boas-final-cta-main-text{font-size:48px;font-weight:700;color:var(--body-text);line-height:1.4;margin-bottom:24px;letter-spacing:-0.02em}
        .boas-final-cta-main-text .highlight{color:var(--cyan)}
        .boas-final-cta-sub-text{font-size:20px;color:#666;line-height:1.6;margin-bottom:40px}
        .boas-final-cta-button-group{display:flex;justify-content:center;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:32px}
        .boas-final-cta-links{display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap}
        .boas-final-cta-link{display:inline-flex;align-items:center;gap:8px;font-size:16px;font-weight:500;color:#666;text-decoration:none;transition:all .3s ease}
        .boas-final-cta-link:hover{color:var(--cyan);transform:translateX(4px)}
        .boas-final-cta-link svg{width:18px;height:18px;color:var(--cyan)}
        @media(max-width:1023px){
          .boas-fund-hero-container{padding:60px 32px;gap:48px;grid-template-columns:1fr 1fr}
          .boas-fund-hero-headline{font-size:40px}
          .boas-why-grid{grid-template-columns:1fr;gap:24px}
          .boas-fund-category{padding:60px 0}
          .boas-tab-button{padding:20px 32px;font-size:16px}
          .boas-tab-content{padding:32px 24px}
          .boas-consulting-item{grid-template-columns:200px 1fr;gap:28px}
          .boas-item-title{font-size:22px}
          .boas-detail-label{font-size:15px;min-width:85px}
          .boas-detail-value{font-size:15px}
          .boas-detail-highlight{font-size:20px}
          .boas-consulting-list li{font-size:16px}
          .boas-process-timeline{grid-template-columns:repeat(2,1fr);gap:24px}
          .boas-process-timeline::before{display:none}
          .boas-final-cta-main-text{font-size:40px}
        }
        @media(max-width:767px){
          .boas-fund-hero-container{grid-template-columns:1fr;padding:0;gap:0;text-align:center}
          .boas-fund-hero-content{max-width:100%;padding:32px 20px 40px;order:1}
          .boas-fund-hero-headline{font-size:24px;margin-bottom:16px;line-height:1.35;word-break:keep-all}
          .boas-fund-hero-subheadline{font-size:15px;margin-bottom:28px}
          .boas-fund-hero-cta-group{flex-direction:column;gap:12px}
          .boas-fund-hero-cta-group .boas-cta-primary,.boas-fund-hero-cta-group .boas-cta-ghost{width:100%;justify-content:center;font-size:15px;padding:15px 20px}
          .boas-fund-hero-visual{order:-1;width:100%}
          .boas-fund-hero-visual img{max-width:100%;width:100%;aspect-ratio:4/5;border-radius:0;box-shadow:none}
          .boas-fund-hero-disclaimer{font-size:11px;margin-top:16px}
          .boas-fund-why{padding:40px 0}
          .boas-why-grid{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;padding:12px 20px 20px;-ms-overflow-style:none;scrollbar-width:none}
          .boas-why-grid::-webkit-scrollbar{display:none}
          .boas-why-card{flex:0 0 85vw;max-width:320px;scroll-snap-align:start}
          .boas-why-image{height:140px}
          .boas-why-content{padding:20px 18px}
          .boas-why-title{font-size:20px;margin-bottom:12px}
          .boas-why-description{font-size:14px}
          .boas-why-example{padding:24px 20px;margin:24px 20px 0}
          .boas-fund-category{padding:40px 0}
          .boas-fund-category .boas-section-container{padding:0}
          .boas-fund-category .boas-section-header{margin-bottom:32px;padding:0 20px}
          .boas-tab-container{border-radius:0}
          .boas-tab-menu{padding:0}
          .boas-tab-button{font-size:14px;padding:16px 20px}
          .boas-tab-content{padding:0;position:relative}
          .boas-tab-header-image{display:none}
          .boas-consulting-items-container{display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:16px;padding:20px;margin:0}
          .boas-consulting-items-container::-webkit-scrollbar{display:none}
          .boas-consulting-item{display:flex;flex-direction:column;flex:0 0 85vw;max-width:340px;scroll-snap-align:start;background:#fff;border:1px solid var(--cyan-lighter);border-radius:12px;padding:24px 20px;margin:0;gap:16px}
          .boas-consulting-item:last-child{padding-bottom:24px;border-bottom:1px solid var(--cyan-lighter)}
          .boas-item-icon{display:none}
          .boas-item-number{width:28px;height:28px;font-size:14px}
          .boas-item-title{font-size:18px}
          .boas-item-details{gap:12px}
          .boas-detail-row{flex-direction:row;gap:6px;align-items:baseline}
          .boas-detail-label{font-size:12px;min-width:auto;font-weight:700;color:var(--body-text);white-space:nowrap}
          .boas-detail-value{font-size:12px;line-height:1.5}
          .boas-detail-highlight{font-size:14px}
          .boas-consulting-list li{font-size:13px;padding-left:20px;margin-bottom:10px;line-height:1.5}
          .boas-consulting-list li::before{font-size:15px;left:6px}
          .boas-fund-process{padding:40px 0}
          .boas-process-timeline{grid-template-columns:1fr;gap:16px}
          .boas-process-timeline::before{display:none}
          .boas-process-step{padding:24px 20px}
          .boas-step-number{width:48px;height:48px;font-size:20px;margin-bottom:16px}
          .boas-step-title{font-size:18px}
          .boas-step-description{display:inline-block;text-align:left}
          .boas-fund-final-cta{padding:50px 0}
          .boas-final-cta-container{padding:0 20px}
          .boas-final-cta-main-text{font-size:24px;word-break:keep-all}
          .boas-final-cta-sub-text{font-size:16px;margin-bottom:32px;text-wrap:balance}
          .boas-final-cta-button-group{flex-direction:column;gap:16px}
          .boas-final-cta-button-group .boas-cta-primary{width:100%;font-size:16px;padding:16px 24px}
          .boas-final-cta-links{flex-direction:column;gap:16px}
        }
      `}</style>

      {/* Hero Section */}
      <section id="boas-fund-hero" className="boas-fund-hero">
        <div className="boas-fund-hero-container">
          <div className="boas-fund-hero-content">
            <h1 className="boas-fund-hero-headline">
              전문 컨설턴트가 설계하는<br/>
              정책자금 조달 전략
            </h1>

            <p className="boas-fund-hero-subheadline">
              대표자 역량과 기업 성장잠재력을 먼저 분석합니다.<br/>
              승인 가능성을 높이는 전략, 보아스가 함께합니다.
            </p>

            <div className="boas-fund-hero-cta-group">
              <Link href="/contact#boas-contact-form" className="boas-cta-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                무료 심사 신청
              </Link>

              <a href="tel:1533-9269" className="boas-cta-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                전화 상담하기
              </a>
            </div>

            <p className="boas-fund-hero-disclaimer">
              ※ 대표자 개인역량 및 성장잠재력을 분석합니다.<br/>
              정책자금 서류작성 및 접수대행을 하지 않습니다.
            </p>
          </div>

          <div className="boas-fund-hero-visual">
            <Image unoptimized src={IMAGES.fundHero} alt="보아스 경영지원솔루션 - 정책자금 컨설팅" width={500} height={500} priority />
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="boas-fund-why" className="boas-fund-why">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">정책자금, 받을 수 있는데 왜 안 받으세요?</h2>
            <p className="boas-section-subtitle">자격이 되는데도 몰라서, 준비가 안 돼서 놓치는 기업이 많습니다</p>
          </div>

          <div className="boas-why-grid">
            <div className="boas-why-card">
              <Image quality={90} src={IMAGES.whyLowRate} alt="저금리 장점" width={400} height={200} className="boas-why-image" />
              <div className="boas-why-content">
                <h3 className="boas-why-title">이자 부담, 확 줄입니다</h3>
                <p className="boas-why-description">
                  시중 금리 대비 1~3%p 낮은 정책금리 적용.<br/>
                  같은 금액이라도 매년 수백만 원을 아낄 수 있습니다.
                </p>
              </div>
            </div>

            <div className="boas-why-card">
              <Image quality={90} src={IMAGES.whyGrowth} alt="성장 동력 확보" width={400} height={200} className="boas-why-image" />
              <div className="boas-why-content">
                <h3 className="boas-why-title">투자 타이밍을 놓치지 마세요</h3>
                <p className="boas-why-description">
                  설비 도입, 인력 확충, 신사업 진출까지.<br/>
                  기회가 왔을 때 자금이 준비되어야 합니다.
                </p>
              </div>
            </div>

            <div className="boas-why-card">
              <Image quality={90} src={IMAGES.whyTrust} alt="기업 신뢰도 향상" width={400} height={200} className="boas-why-image" />
              <div className="boas-why-content">
                <h3 className="boas-why-title">정부 보증이 곧 신용입니다</h3>
                <p className="boas-why-description">
                  정책자금 자금확보 이력은 기업 신뢰도를 높이고,<br/>
                  후속 투자와 금융 거래에서 유리한 조건을 만듭니다.
                </p>
              </div>
            </div>
          </div>

          <div className="boas-why-example">
            <p className="boas-example-desc">실제 컨설팅 사례 기준</p>
            <span className="boas-example-amount">연 1,150만원 절감</span>
            <p className="boas-example-result">1억원 기준, 카드론 대비 정책자금 이자 절감액</p>
          </div>
        </div>
      </section>

      {/* Category Section - 주요 컨설팅 분야 (탭 UI) */}
      <section className="boas-fund-category">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">보아스 컨설팅 영역</h2>
            <p className="boas-section-subtitle">대표님의 기업 상황에 맞는 최적의 자금과 경영 전략을 설계합니다</p>
          </div>

          <div className="boas-tab-container">
            {/* 탭 메뉴 */}
            <div className="boas-tab-menu">
              <button
                className={`boas-tab-button ${activeTab === 'fund' ? 'active' : ''}`}
                onClick={() => setActiveTab('fund')}
              >
                정책자금 컨설팅
              </button>
              <button
                className={`boas-tab-button ${activeTab === 'consulting' ? 'active' : ''}`}
                onClick={() => setActiveTab('consulting')}
              >
                경영 컨설팅
              </button>
            </div>

            {/* 탭 1: 정책자금 컨설팅 */}
            <div className={`boas-tab-content ${activeTab === 'fund' ? 'active' : ''}`}>
              <Image quality={90} src={IMAGES.categoryFund} alt="정책자금 컨설팅" width={1200} height={525} className="boas-tab-header-image" />

              <div className="boas-consulting-items-container">
                {/* 1. 운전자금 */}
                <div className="boas-consulting-item">
                  <div className="boas-item-icon">
                    <Image quality={90} src={IMAGES.itemOperation} alt="운전자금" width={280} height={280} />
                  </div>
                  <div className="boas-item-content">
                    <div className="boas-item-header">
                      <span className="boas-item-number">1</span>
                      <h3 className="boas-item-title">운전자금</h3>
                    </div>
                    <div className="boas-item-details">
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">대상:</span>
                        <span className="boas-detail-value">재료비, 인건비 등 일상 운영 자금이 필요한 기업</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">한도:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">연간 5억 원</span>이내</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">금리:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">2~4%</span>정책자금 기준금리(변동)</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">상환기간:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">최대 6년</span>(거치 3년)</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">보증비율:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">최대 100%</span>신용/기술보증</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">지원기관:</span>
                        <span className="boas-detail-value">신용보증기금, 기술보증기금</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 시설자금 */}
                <div className="boas-consulting-item">
                  <div className="boas-item-icon">
                    <Image quality={90} src={IMAGES.itemFacility} alt="시설자금" width={280} height={280} />
                  </div>
                  <div className="boas-item-content">
                    <div className="boas-item-header">
                      <span className="boas-item-number">2</span>
                      <h3 className="boas-item-title">시설자금</h3>
                    </div>
                    <div className="boas-item-details">
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">대상:</span>
                        <span className="boas-detail-value">설비 구매, 공장 확장 등 시설 투자 기업</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">한도:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">기업당 60억 원</span>이내</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">금리:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">2~3.5%</span>정책자금 기준금리(변동 또는 고정)</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">상환기간:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">최대 10년</span>(거치 4년)</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">보증비율:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">최대 95%</span>신용/기술보증</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">지원기관:</span>
                        <span className="boas-detail-value">중소벤처기업진흥공단</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 기술개발(R&D) 자금 */}
                <div className="boas-consulting-item">
                  <div className="boas-item-icon">
                    <Image quality={90} src={IMAGES.itemRnd} alt="R&D 자금" width={280} height={280} />
                  </div>
                  <div className="boas-item-content">
                    <div className="boas-item-header">
                      <span className="boas-item-number">3</span>
                      <h3 className="boas-item-title">기술개발(R&amp;D) 자금</h3>
                    </div>
                    <div className="boas-item-details">
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">대상:</span>
                        <span className="boas-detail-value">신제품 개발, 기술 혁신을 추진하는 기업</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">한도:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">최대 10억 원</span></span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">금리:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">1.5~3%</span>정책자금 기준금리 - 0.3%p</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">상환기간:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">5년</span>(거치 3년, 분할상환 2년)</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">보증비율:</span>
                        <span className="boas-detail-value"><span className="boas-detail-highlight">최대 100%</span>기술보증</span>
                      </div>
                      <div className="boas-detail-row">
                        <span className="boas-detail-label">지원기관:</span>
                        <span className="boas-detail-value">중소벤처기업진흥공단, 중소기업기술정보진흥원</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 탭 2: 경영 컨설팅 */}
            <div className={`boas-tab-content ${activeTab === 'consulting' ? 'active' : ''}`}>
              <Image quality={90} src={IMAGES.categoryConsulting} alt="경영 컨설팅" width={1200} height={525} className="boas-tab-header-image" />

              <div className="boas-consulting-items-container">
                {/* 1. 재무구조 개선 */}
                <div className="boas-consulting-item">
                  <div className="boas-item-icon">
                    <Image quality={90} src={IMAGES.itemFinance} alt="재무구조 개선" width={280} height={280} />
                  </div>
                  <div className="boas-item-content">
                    <div className="boas-item-header">
                      <span className="boas-item-number">1</span>
                      <h3 className="boas-item-title">재무구조 개선</h3>
                    </div>
                    <ul className="boas-consulting-list">
                      <li>심사 통과에 유리한 <strong>부채비율</strong> 조정</li>
                      <li><strong>유동비율</strong> 기준 충족 가이드</li>
                      <li>보증기관이 선호하는 <strong>재무제표</strong> 설계</li>
                      <li>월별 <strong>현금흐름</strong> 예측 및 관리 체계 구축</li>
                      <li><strong>재무 건전성</strong> 평가 등급 개선 전략</li>
                      <li>정책자금 신청 전 <strong>자본구조</strong> 사전 정비</li>
                      <li>전문가 관점의 <strong>재무비율</strong> 취약점 진단</li>
                    </ul>
                  </div>
                </div>

                {/* 2. 원가절감 전략 */}
                <div className="boas-consulting-item">
                  <div className="boas-item-icon">
                    <Image quality={90} src={IMAGES.itemCost} alt="원가절감 전략" width={280} height={280} />
                  </div>
                  <div className="boas-item-content">
                    <div className="boas-item-header">
                      <span className="boas-item-number">2</span>
                      <h3 className="boas-item-title">원가절감 전략</h3>
                    </div>
                    <ul className="boas-consulting-list">
                      <li>매출 대비 <strong>불필요 지출</strong> 항목 식별</li>
                      <li>제품별·서비스별 <strong>원가구조</strong> 재설계</li>
                      <li>매출총이익률 기반 <strong>수익성</strong> 개선 로드맵</li>
                      <li><strong>고정비·변동비</strong> 비중 재조정</li>
                      <li>생산라인 <strong>공정 효율화</strong> 포인트 도출</li>
                      <li>주요 자재 <strong>구매 단가</strong> 벤치마킹 및 협상</li>
                      <li>적정 <strong>재고 수준</strong> 산정 및 회전율 개선</li>
                    </ul>
                  </div>
                </div>

                {/* 3. 사업계획서 준비 지원 */}
                <div className="boas-consulting-item">
                  <div className="boas-item-icon">
                    <Image quality={90} src={IMAGES.itemPlan} alt="사업계획서 준비 지원" width={280} height={280} />
                  </div>
                  <div className="boas-item-content">
                    <div className="boas-item-header">
                      <span className="boas-item-number">3</span>
                      <h3 className="boas-item-title">사업계획서 준비 지원</h3>
                    </div>
                    <ul className="boas-consulting-list">
                      <li>전문 컨설턴트가 알려주는 <strong>평가 핵심 기준</strong></li>
                      <li>승인률을 높이는 <strong>사업계획서</strong> 논리 구조 설계</li>
                      <li><strong>현장 발표</strong> 및 <strong>대면 심사</strong> 모의 훈련</li>
                      <li>데이터 기반 <strong>시장분석</strong>·<strong>경쟁우위</strong> 서술 전략</li>
                      <li>심사에 강한 <strong>재무계획</strong>·<strong>손익 추정표</strong> 작성법</li>
                      <li>투자 매력도를 높이는 <strong>사업모델</strong> 정리 코칭</li>
                      <li>실전형 <strong>PT 자료</strong> 구성 및 발표 리허설</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="boas-fund-process">
        <div className="boas-section-container">
          <div className="boas-section-header">
            <h2 className="boas-section-title">보아스 컨설팅 프로세스</h2>
            <p className="boas-section-subtitle">컨설팅 경험에 기반한 4단계 맞춤 전략으로 승인 가능성을 끌어올립니다</p>
          </div>

          <div className="boas-process-timeline">
            <div className="boas-process-step">
              <div className="boas-step-number">1</div>
              <h3 className="boas-step-title">대표자 역량<br/>현황분석</h3>
              <ul className="boas-step-description">
                <li>대표자 경력·역량 심층 분석</li>
                <li>기업 재무 건전성 점검</li>
                <li>자금확보 가능 정책사업 탐색</li>
              </ul>
            </div>

            <div className="boas-process-step">
              <div className="boas-step-number">2</div>
              <h3 className="boas-step-title">맞춤 자금<br/>로드맵 설계</h3>
              <ul className="boas-step-description">
                <li>기업별 최적 자금 조합 설계</li>
                <li>사전 취득 필요 인증 안내</li>
                <li>심사 전 재무구조 개선 코칭</li>
              </ul>
            </div>

            <div className="boas-process-step">
              <div className="boas-step-number">3</div>
              <h3 className="boas-step-title">사업계획서<br/>전략 수립</h3>
              <ul className="boas-step-description">
                <li>전문가 관점 서류 구성 전략</li>
                <li>기업 고유 강점 스토리 설계</li>
                <li>완성본 다각도 검토·보완</li>
              </ul>
            </div>

            <div className="boas-process-step">
              <div className="boas-step-number">4</div>
              <h3 className="boas-step-title">실전 심사<br/>대응 훈련</h3>
              <ul className="boas-step-description">
                <li>기출 질문 기반 모의 심사</li>
                <li>약점 보완 답변 시나리오 수립</li>
                <li>최종 서류 점검 및 제출 지원</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="boas-fund-final-cta">
        <div className="boas-final-cta-container">
          <h2 className="boas-final-cta-main-text">
            <span className="highlight">전문 컨설턴트</span>가 직접 설계하는<br/>
            정책자금 승인 전략
          </h2>
          <p className="boas-final-cta-sub-text">
            대표님의 역량과 기업의 성장잠재력을 정밀 분석하여<br/>
            가장 현실적인 자금조달 방안을 제시합니다
          </p>

          <div className="boas-final-cta-button-group">
            <Link href="/contact#boas-contact-form" className="boas-cta-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              무료 심사 신청하기
            </Link>
          </div>

          <div className="boas-final-cta-links">
            <Link href="/certification" className="boas-final-cta-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
              인증 컨설팅 알아보기
            </Link>
            <Link href="/success" className="boas-final-cta-link">
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
