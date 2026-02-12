import Link from 'next/link'
import Image from 'next/image'
import { IMAGES } from '@/lib/images'

interface BoardPost {
  id: string
  제목: string
  요약: string
  카테고리: string
  금액: string
  작성일: string
  공개여부: boolean
  썸네일: string
}

async function getPosts(): Promise<BoardPost[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/board`, {
      next: { tags: ['board'], revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.success || !data.posts) return []
    return data.posts
      .filter((p: BoardPost) => p.공개여부 !== false)
      .sort((a: BoardPost, b: BoardPost) => new Date(b.작성일).getTime() - new Date(a.작성일).getTime())
  } catch {
    return []
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default async function SuccessPage() {
  const posts = await getPosts()
  return (
    <>
      <style>{`
        .boas-success-hero{background:linear-gradient(135deg,#FFFFFF 0%,var(--boas-bg-ivory) 100%);padding:0;margin:0;min-height:auto;position:relative}
        .boas-success-hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,var(--boas-primary-pale) 50%,transparent 100%)}
        .boas-success-hero-container{max-width:1200px;margin:0 auto;padding:60px 48px;display:grid;grid-template-columns:1.2fr 1fr;gap:60px;align-items:center}
        .boas-success-hero-content{max-width:600px}
        .boas-success-hero-headline{font-size:48px;font-weight:700;color:var(--boas-text-primary);line-height:1.25;margin-bottom:20px;letter-spacing:-0.02em;animation:fadeInUp .6s ease-out .1s both}
        .boas-success-hero-subheadline{font-size:18px;color:#666;line-height:1.7;margin-bottom:36px;animation:fadeInUp .6s ease-out .2s both}
        .boas-success-hero-cta-group{display:flex;gap:16px;flex-wrap:wrap;animation:fadeInUp .6s ease-out .3s both}
        .boas-success-hero-visual{display:flex;align-items:center;justify-content:center;animation:fadeIn .8s ease-out .5s both}
        .boas-success-hero-visual img{width:100%;max-width:500px;height:auto;aspect-ratio:1/1;object-fit:cover;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.15)}
        .boas-success-hero-disclaimer{font-size:13px;color:#999;line-height:1.6;margin-top:20px;animation:fadeInUp .6s ease-out .4s both}
        .boas-aftercare{background:linear-gradient(180deg,#f7f5f0 0%,var(--boas-bg-ivory) 100%);padding:100px 0;position:relative}
        .boas-aftercare::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--boas-primary-pale) 0%,var(--boas-primary) 50%,var(--boas-primary-pale) 100%)}
        .boas-aftercare-container{max-width:1200px;margin:0 auto;padding:0 48px;display:grid;grid-template-columns:1.2fr 1fr;gap:80px;align-items:center}
        .boas-aftercare-content{max-width:650px}
        .boas-aftercare-title{font-size:42px;font-weight:700;color:var(--boas-text-primary);line-height:1.3;margin-bottom:20px}
        .boas-aftercare-title .highlight{color:var(--boas-primary)}
        .boas-aftercare-subtitle{font-size:18px;color:#666;line-height:1.7;margin-bottom:50px}
        .boas-timeline{position:relative;padding-left:0}
        .boas-timeline-item{position:relative;padding-left:50px;margin-bottom:40px;padding-bottom:40px;border-left:3px solid var(--boas-primary-pale)}
        .boas-timeline-item:last-child{margin-bottom:0;padding-bottom:0;border-left:3px solid transparent}
        .boas-timeline-icon{position:absolute;left:-18px;top:0;width:36px;height:36px;background:var(--boas-primary);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0, 212, 216,0.35)}
        .boas-timeline-icon svg{width:20px;height:20px;stroke:#fff;stroke-width:2.5;fill:none}
        .boas-timeline-step{font-size:14px;font-weight:600;color:var(--boas-primary);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
        .boas-timeline-title{font-size:20px;font-weight:700;color:var(--boas-text-primary);margin-bottom:8px;line-height:1.3}
        .boas-timeline-description{font-size:15px;color:#666;line-height:1.6}
        .boas-aftercare-cta{margin-top:40px}
        .boas-aftercare-visual{display:flex;flex-direction:column;align-items:center;gap:20px}
        .boas-aftercare-visual img{width:100%;max-width:500px;height:auto;aspect-ratio:2/3;object-fit:cover;border-radius:20px;box-shadow:0 20px 40px rgba(0,0,0,0.15)}
        .boas-aftercare-disclaimer{font-size:13px;color:#999;line-height:1.6;text-align:center;max-width:400px}
        .boas-success-cta-bar{background:linear-gradient(135deg,var(--boas-primary-dark) 0%,var(--boas-primary) 100%);padding:48px 40px;text-align:center}
        .boas-success-cta-text{font-size:36px;font-weight:700;font-style:italic;color:#fff;line-height:1.6;margin:0}
        .boas-success-cta-text .highlight{color:var(--boas-primary-pale);font-weight:800}
        .boas-success-board{background:#fff;padding:80px 20px}
        .boas-success-board-container{max-width:1200px;margin:0 auto}
        .boas-success-board-header{text-align:center;margin-bottom:48px}
        .boas-success-board-title{font-size:36px;font-weight:700;color:var(--boas-text-primary);margin-bottom:12px}
        .boas-success-board-title .highlight{color:var(--boas-primary)}
        .boas-success-board-subtitle{font-size:16px;color:#666;text-wrap:balance}
        .boas-success-board-list{display:flex;flex-direction:column;gap:16px}
        .boas-success-board-item{display:grid;grid-template-columns:120px 100px 1fr 120px 140px;gap:20px;align-items:center;padding:24px 28px;background:#f9fafb;border-radius:12px;transition:all .2s ease;border:1px solid transparent;text-decoration:none;color:inherit}
        .boas-success-board-item:hover{background:#fff;border-color:var(--boas-primary-pale);box-shadow:0 4px 12px rgba(0, 212, 216,0.1);cursor:pointer}
        .boas-success-board-thumb{width:120px;height:80px;border-radius:8px;background:linear-gradient(135deg,var(--boas-primary-pale) 0%,var(--boas-primary-light) 100%);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--boas-primary-dark);font-weight:600;overflow:hidden;flex-shrink:0}
        .boas-success-board-date{font-size:14px;color:#999;font-weight:500}
        .boas-success-board-content{display:flex;flex-direction:column;gap:4px}
        .boas-success-board-company{font-size:17px;font-weight:600;color:var(--boas-text-primary);transition:color .2s ease}
        .boas-success-board-item:hover .boas-success-board-company{color:var(--boas-primary)}
        .boas-success-board-desc{font-size:14px;color:#666}
        .boas-success-board-category{display:inline-flex;align-items:center;justify-content:center;padding:6px 14px;background:var(--boas-primary-pale);color:var(--boas-primary-dark);font-size:13px;font-weight:600;border-radius:20px}
        .boas-success-board-amount{font-size:18px;font-weight:700;color:var(--boas-primary);text-align:right}
        .boas-success-board-empty{text-align:center;padding:60px 20px;color:#999}
        .boas-success-board-more{display:flex;justify-content:center;margin-top:32px}
        .boas-success-board-more-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 32px;border:2px solid var(--boas-primary-pale);border-radius:8px;background:transparent;color:var(--boas-text-primary);font-size:15px;font-weight:600;cursor:pointer;transition:all .2s ease;text-decoration:none}
        .boas-success-board-more-btn:hover{border-color:var(--boas-primary);background:var(--boas-primary-pale);color:var(--boas-primary-dark)}
        .boas-final-cta{background:#fff;padding:80px 20px;text-align:center}
        .boas-final-cta-title{font-size:42px;font-weight:700;color:var(--boas-text-primary);margin-bottom:20px;line-height:1.4}
        .boas-final-cta-title .highlight{color:var(--boas-primary)}
        .boas-final-cta-subtitle{font-size:18px;color:#666;margin-bottom:40px;line-height:1.6}
        .boas-final-cta-buttons{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;margin-bottom:32px}
        .boas-final-cta-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--boas-text-primary);color:#fff;font-size:18px;font-weight:600;padding:18px 40px;border-radius:8px;border:2px solid var(--boas-primary);text-decoration:none;transition:all .3s ease}
        .boas-final-cta-button:hover{background:var(--boas-primary);transform:translateY(-2px);box-shadow:0 8px 20px rgba(0, 212, 216,0.4)}
        .boas-final-cta-button svg{width:20px;height:20px}
        .boas-final-cta-links-row{display:flex;justify-content:center;gap:32px;flex-wrap:wrap}
        .boas-final-cta-link-item{display:inline-flex;align-items:center;gap:8px;font-size:16px;font-weight:500;color:#666;text-decoration:none;transition:all .3s ease}
        .boas-final-cta-link-item:hover{color:var(--boas-primary);transform:translateX(4px)}
        .boas-final-cta-link-item svg{width:18px;height:18px;stroke:var(--boas-primary)}
        @media(max-width:1024px){
          .boas-success-hero-container{padding:48px 32px;gap:48px;grid-template-columns:1fr 1fr}
          .boas-success-hero-headline{font-size:40px}
          .boas-aftercare-container{padding:0 32px;gap:60px}
          .boas-aftercare-title{font-size:36px}
          .boas-final-cta-title{font-size:36px}
        }
        @media(max-width:767px){
          .boas-success-hero-container{grid-template-columns:1fr;padding:0;gap:0;text-align:center}
          .boas-success-hero-content{max-width:100%;padding:40px 20px;order:1}
          .boas-success-hero-headline{font-size:26px;margin-bottom:16px;line-height:1.35;word-break:keep-all}
          .boas-success-hero-subheadline{font-size:14px;margin-bottom:28px}
          .boas-success-hero-cta-group{flex-direction:column;gap:12px}
          .boas-success-hero-cta-group .boas-cta-primary,.boas-success-hero-cta-group .boas-cta-ghost{width:100%;justify-content:center}
          .boas-success-hero-visual{order:-1;width:100%}
          .boas-success-hero-visual img{max-width:100%;width:100%;aspect-ratio:4/5;border-radius:0;box-shadow:none}
          .boas-aftercare{padding:60px 0}
          .boas-aftercare-container{grid-template-columns:1fr;gap:40px;padding:0 20px}
          .boas-aftercare-title{font-size:26px;width:fit-content;margin-left:auto;margin-right:auto;text-align:left}
          .boas-aftercare-subtitle{font-size:15px;margin-bottom:32px;width:fit-content;margin-left:auto;margin-right:auto;text-align:left}
          .boas-aftercare-content{display:flex;flex-direction:column;align-items:center}
          .boas-timeline{width:fit-content}
          .boas-aftercare-cta{width:fit-content}
          .boas-aftercare-visual{order:-1}
          .boas-aftercare-visual img{max-width:100%;aspect-ratio:4/3;border-radius:12px}
          .boas-success-cta-bar{padding:32px 20px}
          .boas-success-cta-text{font-size:18px;line-height:1.7;text-wrap:balance}
          .boas-success-board{padding:50px 16px}
          .boas-success-board-title{font-size:26px}
          .boas-success-board-item{display:flex;flex-direction:column;gap:12px;padding:16px}
          .boas-success-board-thumb{width:100%;height:140px;order:-1;margin-bottom:4px}
          .boas-success-board-date{order:4;font-size:12px}
          .boas-success-board-content{order:1}
          .boas-success-board-company{font-size:16px}
          .boas-success-board-desc{font-size:13px}
          .boas-success-board-category{order:2;align-self:flex-start}
          .boas-success-board-amount{order:3;text-align:left;font-size:17px}
          .boas-final-cta{padding:50px 20px}
          .boas-final-cta-title{font-size:24px;word-break:keep-all;text-wrap:balance}
          .boas-final-cta-subtitle{font-size:15px;margin-bottom:32px}
          .boas-final-cta-buttons{flex-direction:column;gap:16px}
          .boas-final-cta-button{width:100%;font-size:16px;padding:16px 24px}
          .boas-final-cta-links-row{flex-direction:column;gap:16px}
        }
      `}</style>

      {/* 1. Hero Section */}
      <section className="boas-success-hero">
        <div className="boas-success-hero-container">
          <div className="boas-success-hero-content">
            <h1 className="boas-success-hero-headline">
              정책자금 성공사례를<br/>
              확인하세요
            </h1>

            <p className="boas-success-hero-subheadline">
              정책자금부터 기업인증까지<br/>
              보아스 경영지원솔루션과 함께한 자금조달 스토리
            </p>

            <div className="boas-success-hero-cta-group">
              <Link href="/contact#boas-contact-form" className="boas-cta-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                무료 심사 신청하기
              </Link>

              <a href="tel:1533-9269" className="boas-cta-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                전화 문의하기
              </a>
            </div>

            <p className="boas-success-hero-disclaimer">
              ※ 실제 지원 사례를 바탕으로 작성되었습니다.<br/>
              상황에 따라 결과는 다를 수 있습니다.
            </p>
          </div>

          <div className="boas-success-hero-visual">
            <Image unoptimized src={IMAGES.serviceSuccess} alt="보아스 경영지원솔루션 성공사례" width={500} height={500} priority />
          </div>
        </div>
      </section>

      {/* 2. Aftercare Section */}
      <section className="boas-aftercare">
        <div className="boas-aftercare-container">
          <div className="boas-aftercare-content">
            <h2 className="boas-aftercare-title">
              한 번의 지원이<br/>
              <span className="highlight">끝이 아닙니다</span>
            </h2>

            <p className="boas-aftercare-subtitle">
              지속적인 사후관리로<br/>
              추가 정책자금까지 책임집니다
            </p>

            <div className="boas-timeline">
              <div className="boas-timeline-item">
                <div className="boas-timeline-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div className="boas-timeline-step">Step 1</div>
                  <h3 className="boas-timeline-title">1차 정책자금 확보</h3>
                  <p className="boas-timeline-description">
                    정책자금 또는 인증 취득으로<br/>
                    첫 번째 자금조달 달성
                  </p>
                </div>
              </div>

              <div className="boas-timeline-item">
                <div className="boas-timeline-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div>
                  <div className="boas-timeline-step">Step 2</div>
                  <h3 className="boas-timeline-title">자금 집행 모니터링</h3>
                  <p className="boas-timeline-description">
                    자금 사용 내역 관리 및<br/>
                    추가 지원 가능성 검토
                  </p>
                </div>
              </div>

              <div className="boas-timeline-item">
                <div className="boas-timeline-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div>
                  <div className="boas-timeline-step">Step 3</div>
                  <h3 className="boas-timeline-title">추가 정책자금 시기 알림</h3>
                  <p className="boas-timeline-description">
                    신청 가능한 정부지원사업 및<br/>
                    인증 시기를 사전 안내
                  </p>
                </div>
              </div>

              <div className="boas-timeline-item">
                <div className="boas-timeline-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div>
                  <div className="boas-timeline-step">Step 4</div>
                  <h3 className="boas-timeline-title">2차 정책자금 조달 지원</h3>
                  <p className="boas-timeline-description">
                    다른 정책자금과 조합하여<br/>
                    추가 자금조달 성공
                  </p>
                </div>
              </div>
            </div>

            <div className="boas-aftercare-cta">
              <Link href="/contact#boas-contact-form" className="boas-cta-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                무료심사 신청하기
              </Link>
            </div>
          </div>

          <div className="boas-aftercare-visual">
            <Image quality={90} src={IMAGES.aftercareConsulting} alt="보아스 경영지원솔루션 사후관리 상담" width={500} height={750} />
            <p className="boas-aftercare-disclaimer">
              ※ 현황 분석 및 성장잠재력을 평가합니다.<br/>
              대표자가 직접 접수하는 것을 지원합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CTA Bar */}
      <section className="boas-success-cta-bar">
        <p className="boas-success-cta-text">
          체계적인 <span className="highlight">사후 컨설팅</span>으로<br/>
          자금상환까지 <span className="highlight">끝까지 함께</span>합니다
        </p>
      </section>

      {/* 4. Success Board Section */}
      <section className="boas-success-board">
        <div className="boas-success-board-container">
          <div className="boas-success-board-header">
            <h2 className="boas-success-board-title">
              <span className="highlight">성공사례</span> 게시판
            </h2>
            <p className="boas-success-board-subtitle">보아스 경영지원솔루션과 함께한 중소기업의 자금조달 스토리</p>
          </div>

          <div className="boas-success-board-list">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.id} href={`/board/${post.id}`} className="boas-success-board-item">
                  <div className="boas-success-board-thumb">
                    {post.썸네일 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.썸네일} alt={post.제목} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '보아스'
                    )}
                  </div>
                  <span className="boas-success-board-date">{formatDate(post.작성일)}</span>
                  <div className="boas-success-board-content">
                    <h3 className="boas-success-board-company">{post.제목}</h3>
                    {post.요약 && <p className="boas-success-board-desc">{post.요약}</p>}
                  </div>
                  <span className="boas-success-board-category">{post.카테고리 || '정책자금'}</span>
                  {post.금액 && <span className="boas-success-board-amount">{post.금액}</span>}
                </Link>
              ))
            ) : (
              <div className="boas-success-board-empty">
                <p>아직 등록된 성공사례가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="boas-final-cta">
        <h2 className="boas-final-cta-title">
          다음 <span className="highlight">성공 주인공</span>은<br/>
          당신의 기업입니다
        </h2>
        <p className="boas-final-cta-subtitle">
          무료 심사로 맞춤형 자금조달 전략을<br/>
          먼저 확인하고 시작하세요
        </p>

        <div className="boas-final-cta-buttons">
          <Link href="/contact#boas-contact-form" className="boas-final-cta-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            무료 심사 신청하기
          </Link>
        </div>

        <div className="boas-final-cta-links-row">
          <a href="tel:1533-9269" className="boas-final-cta-link-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            전화 심사: 1533-9269
          </a>
        </div>
      </section>
    </>
  )
}
