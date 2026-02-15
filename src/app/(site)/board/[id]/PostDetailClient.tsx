'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BoardPost {
  id: string
  제목: string
  요약: string
  내용: string
  카테고리: string
  금액: string
  작성일: string
  공개여부: boolean
  썸네일: string
  콘텐츠URL: string
}

interface RelatedPost {
  id: string
  제목: string
  요약: string
  카테고리: string
  금액: string
  작성일: string
  썸네일: string
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function categoryClass(cat: string) {
  switch (cat) {
    case '성공사례': return 'boas-cat-success'
    case '정책자금': return 'boas-cat-fund'
    case '인증지원': return 'boas-cat-cert'
    default: return 'boas-cat-fund'
  }
}

export default function PostDetailClient({ postId }: { postId: string }) {
  const [post, setPost] = useState<BoardPost | null>(null)
  const [related, setRelated] = useState<RelatedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [iframeHeight, setIframeHeight] = useState(0)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'boas-iframe-height' && typeof e.data.height === 'number') {
        setIframeHeight(e.data.height)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const [postRes, listRes] = await Promise.all([
          fetch(`/api/board?id=${postId}`),
          fetch('/api/board'),
        ])
        const postData = await postRes.json()
        const listData = await listRes.json()

        if (!postData.success || !postData.post) {
          setError('게시글을 찾을 수 없습니다.')
          return
        }
        setPost(postData.post)

        if (listData.success && listData.posts) {
          const others = listData.posts
            .filter((p: RelatedPost) => p.id !== postId && p.카테고리)
            .sort((a: RelatedPost, b: RelatedPost) => new Date(b.작성일).getTime() - new Date(a.작성일).getTime())
            .slice(0, 3)
          setRelated(others)
        }
      } catch {
        setError('게시글을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId])

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    if (navigator.share && post) {
      navigator.share({ title: post.제목, url: window.location.href })
    } else {
      handleCopyLink()
    }
  }

  if (loading) {
    return (
      <div className="sp-section">
        <div className="sp-layout" style={{ justifyItems: 'center', padding: '80px 20px' }}>
          <div style={{ width: 40, height: 40, border: '3px solid rgba(0, 212, 216,0.3)', borderTopColor: '#00D4D8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#999', fontSize: 14, marginTop: 16 }}>게시글을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="sp-section">
        <div className="sp-layout" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📋</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>{error || '게시글을 찾을 수 없습니다'}</h2>
          <Link href="/success" className="sp-gold-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="sp-section">
        <div className="sp-layout">
          {/* 메인 컨텐츠 */}
          <div className="sp-main">
            {/* 브레드크럼 */}
            <nav className="sp-breadcrumb">
              <Link href="/">홈</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <Link href="/success">성공사례</Link>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="current">{post.카테고리 || '게시글'}</span>
            </nav>

            {/* 게시글 카드 */}
            <div className="sp-card">
              {/* 헤더 */}
              <div className="sp-header">
                <span className={`sp-category ${categoryClass(post.카테고리)}`}>
                  {post.카테고리 || '정책자금'}
                </span>
                <h1 className="sp-title">{post.제목}</h1>
                {post.요약 && <p className="sp-subtitle">{post.요약}</p>}
                <div className="sp-meta">
                  <div className="sp-meta-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <span>{formatDate(post.작성일)}</span>
                  </div>
                  {post.금액 && (
                    <div className="sp-meta-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      <span style={{ fontWeight: 700, color: 'var(--boas-primary)' }}>{post.금액}</span>
                    </div>
                  )}
                  <div className="sp-meta-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <span>보아스 경영지원솔루션</span>
                  </div>
                </div>
              </div>

              {/* 썸네일 */}
              {post.썸네일 && (
                <div className="sp-thumbnail-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.썸네일} alt={post.제목} className="sp-thumbnail" />
                </div>
              )}

              {/* 본문 */}
              {post.콘텐츠URL ? (
                <div className="sp-r2-content">
                  <iframe
                    src={`${post.콘텐츠URL}${post.콘텐츠URL.includes('?') ? '&' : '?'}v=2`}
                    title={post.제목}
                    className="sp-r2-iframe"
                    scrolling="no"
                    sandbox="allow-scripts allow-same-origin"
                    style={iframeHeight > 0 ? { height: iframeHeight + 'px' } : undefined}
                  />
                </div>
              ) : (
                <div className="sp-content">
                  {post.내용 ? (
                    <div className="sp-body" dangerouslySetInnerHTML={{ __html: post.내용 }} />
                  ) : (
                    <div className="sp-body">
                      <p style={{ color: '#999' }}>본문 내용이 없습니다.</p>
                    </div>
                  )}
                </div>
              )}

              {/* CTA 섹션 */}
              <div className="sp-cta-section">
                <div className="sp-cta-badge">정책자금 컨설팅</div>
                <h3 className="sp-cta-title">무료 심사 신청</h3>
                <p className="sp-cta-desc">
                  전문 컨설턴트가 기업 맞춤형 자금 솔루션을 제안해 드립니다.
                  <br className="hidden md:inline" />
                  지금 바로 무료 심사를 신청하세요.
                </p>
                <a href="/contact#boas-contact-form" className="sp-cta-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  무료 심사 신청하기
                </a>
              </div>
            </div>

            {/* 관련 게시글 */}
            {related.length > 0 && (
              <div className="sp-related">
                <h3 className="sp-related-title">관련 게시글</h3>
                <div className="sp-related-grid">
                  {related.map(r => (
                    <Link key={r.id} href={`/board/${r.id}`} className="sp-related-card group">
                      <div className="sp-related-thumb">
                        {r.썸네일 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.썸네일} alt={r.제목} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--boas-primary-pale) 0%, var(--boas-primary-light) 100%)' }}>
                            <span style={{ color: 'var(--boas-primary)', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>보아스</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: 16 }}>
                        <span className={`sp-related-cat ${categoryClass(r.카테고리)}`}>{r.카테고리}</span>
                        <h4 className="sp-related-name">{r.제목}</h4>
                        <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>{formatDate(r.작성일)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 사이드바 (데스크톱) */}
          <aside className="sp-sidebar">
            <div className="sp-sidebar-sticky">
              {/* 공유 */}
              <div className="sp-sidebar-card">
                <h4 className="sp-sidebar-title">공유하기</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={handleCopyLink} className="sp-share-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    {copied ? '복사됨!' : '링크 복사'}
                  </button>
                  <button onClick={handleShare} className="sp-share-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                    공유하기
                  </button>
                </div>
              </div>

              {/* 게시글 정보 */}
              <div className="sp-sidebar-card">
                <h4 className="sp-sidebar-title">게시글 정보</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#999' }}>카테고리</span>
                    <span style={{ color: 'var(--boas-primary)', fontWeight: 600 }}>{post.카테고리}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#999' }}>작성일</span>
                    <span style={{ color: '#333' }}>{formatDate(post.작성일)}</span>
                  </div>
                  {post.금액 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#999' }}>지원 금액</span>
                      <span style={{ color: 'var(--boas-primary)', fontWeight: 700 }}>{post.금액}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 전화 문의 */}
              <div className="sp-sidebar-card">
                <h4 className="sp-sidebar-title">전화 문의</h4>
                <a href="tel:1533-9269" className="sp-phone-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  1533-9269
                </a>
              </div>

              {/* 목록 돌아가기 */}
              <Link href="/success" className="sp-back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                목록으로 돌아가기
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* 모바일 하단 바 */}
      <div className="sp-mobile-bar">
        <Link href="/success" className="sp-mobile-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
          목록
        </Link>
        <a href="/contact#boas-contact-form" className="sp-mobile-consult">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          무료 심사
        </a>
        <button onClick={handleShare} className="sp-mobile-share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
          {copied ? '복사됨!' : '공유'}
        </button>
      </div>

      {/* 토스트 알림 */}
      {copied && (
        <div style={{
          position: 'fixed', bottom: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 50,
          padding: '12px 24px', background: 'var(--boas-primary)', color: '#fff',
          fontWeight: 700, fontSize: 14, borderRadius: 999,
          boxShadow: '0 4px 20px rgba(0, 212, 216,0.4)',
          animation: 'fadeUp 0.3s ease-out',
        }}>
          링크가 복사되었습니다
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        /* 섹션 */
        .sp-section {
          background: linear-gradient(180deg, #FFFFFF 0%, var(--boas-bg-ivory) 50%, #FFFFFF 100%);
          min-height: calc(100vh - 200px);
          padding: 24px 0 80px;
        }
        @media (min-width: 768px) {
          .sp-section { padding-top: 48px; }
        }
        @media (min-width: 1024px) {
          .sp-section { padding-top: 60px; }
        }

        /* 2컬럼 레이아웃 */
        .sp-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 1024px) {
          .sp-layout { grid-template-columns: 1fr 300px; }
        }

        .sp-main { min-width: 0; }

        /* 브레드크럼 */
        .sp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          color: #999;
        }
        .sp-breadcrumb :global(a) {
          color: #999;
          text-decoration: none;
          transition: color 0.3s;
        }
        .sp-breadcrumb :global(a:hover) { color: var(--boas-primary); }
        .sp-breadcrumb .current {
          color: var(--boas-text-primary);
          font-weight: 500;
        }

        /* 게시글 카드 */
        .sp-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 212, 216, 0.15);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        /* 헤더 */
        .sp-header {
          padding: 40px 40px 30px;
          border-bottom: 1px solid rgba(0, 212, 216, 0.15);
        }
        @media (max-width: 768px) {
          .sp-header { padding: 24px 20px 20px; }
        }

        /* 카테고리 */
        .sp-category {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 16px;
        }
        :global(.boas-cat-success) { background: linear-gradient(135deg, #059669 0%, #10B981 100%); }
        :global(.boas-cat-fund) { background: linear-gradient(135deg, #009CA0 0%, #00D4D8 100%); }
        :global(.boas-cat-cert) { background: linear-gradient(135deg, #D97706 0%, #F59E0B 100%); }

        /* 제목 */
        .sp-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--boas-text-primary);
          line-height: 1.4;
          margin-bottom: 12px;
          word-break: keep-all;
        }
        @media (min-width: 768px) {
          .sp-title { font-size: 32px; }
        }

        .sp-subtitle {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        @media (min-width: 768px) {
          .sp-subtitle { font-size: 16px; }
        }

        /* 메타 */
        .sp-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 14px;
          color: #999;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 212, 216, 0.12);
        }
        .sp-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sp-meta-item svg { stroke: var(--boas-primary-light); }

        /* 썸네일 */
        .sp-thumbnail-wrap {
          width: 100%;
          border-bottom: 1px solid rgba(0, 212, 216, 0.12);
        }
        .sp-thumbnail {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
        }

        /* R2 콘텐츠 (iframe) */
        .sp-r2-content {
          width: 100%;
          border-top: 1px solid rgba(0, 212, 216, 0.12);
        }
        .sp-r2-iframe {
          width: 100%;
          min-height: 600px;
          border: none;
          display: block;
          overflow: hidden;
        }

        /* 본문 */
        .sp-content { padding: 40px; }
        @media (max-width: 768px) {
          .sp-content { padding: 24px 20px; }
        }

        .sp-body {
          font-size: 16px;
          line-height: 1.9;
          color: #333;
        }
        .sp-body :global(p) { margin-bottom: 16px; color: #333; }
        .sp-body :global(span) { color: #333; }
        .sp-body :global(div) { color: #333; }
        .sp-body :global(li) { color: #333; }

        .sp-body :global(h1),
        .sp-body :global(h2),
        .sp-body :global(h3) {
          color: var(--boas-text-primary);
          font-weight: 700;
          margin: 32px 0 16px;
        }
        .sp-body :global(h1) { font-size: 24px; }
        .sp-body :global(h2) {
          font-size: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(0, 212, 216, 0.25);
        }
        .sp-body :global(h3) { font-size: 18px; color: var(--boas-primary-dark); }

        .sp-body :global(strong) { color: var(--boas-primary-dark); font-weight: 600; }

        .sp-body :global(ul),
        .sp-body :global(ol) {
          margin: 16px 0;
          padding-left: 24px;
        }
        .sp-body :global(li) { margin-bottom: 8px; line-height: 1.7; }

        .sp-body :global(blockquote) {
          margin: 24px 0;
          padding: 20px 25px;
          background: var(--boas-primary-pale);
          border-left: 4px solid var(--boas-primary);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #666;
        }

        .sp-body :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 14px;
        }
        .sp-body :global(th),
        .sp-body :global(td) {
          padding: 12px 8px;
          text-align: center;
          vertical-align: top;
          border: 1px solid rgba(0, 212, 216, 0.2);
        }
        .sp-body :global(th) {
          background: var(--boas-primary-pale);
          font-weight: 600;
          color: var(--boas-primary-dark);
        }
        .sp-body :global(td) {
          background: #FFFFFF;
        }

        .sp-body :global(a) {
          color: var(--boas-primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .sp-body :global(a:hover) { color: var(--boas-primary-dark); }

        .sp-body :global(img) {
          max-width: 100%;
          border-radius: 12px;
          margin: 16px 0;
        }

        /* 하이라이트 박스 */
        .sp-body :global(.highlight-box) {
          background: var(--boas-primary-pale);
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          border: 1px solid rgba(0, 212, 216, 0.25);
        }

        /* 정보 박스 */
        .sp-body :global(.info-box) {
          background: #f0f7ff;
          padding: 20px 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          border-left: 4px solid #3B82F6;
        }

        /* 경고 박스 */
        .sp-body :global(.warning-box) {
          background: #fff7ed;
          padding: 20px 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          border-left: 4px solid #F59E0B;
        }

        /* 모바일 테이블 */
        @media (max-width: 480px) {
          .sp-body :global(table) {
            display: block;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            font-size: 12px;
          }
          .sp-body :global(th),
          .sp-body :global(td) {
            min-width: 80px;
            padding: 8px 6px;
            word-break: keep-all;
          }
        }

        /* CTA 섹션 */
        .sp-cta-section {
          margin: 40px;
          padding: 40px;
          background: linear-gradient(135deg, #E0FEFF 0%, #fff 100%);
          border: 1px solid rgba(0, 212, 216, 0.25);
          border-radius: 20px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .sp-cta-section { margin: 24px 20px; padding: 30px 20px; }
        }

        .sp-cta-badge {
          display: inline-block;
          background: var(--boas-gradient-primary);
          color: #fff;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .sp-cta-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--boas-text-primary);
          margin: 0 0 12px;
        }
        @media (max-width: 768px) {
          .sp-cta-title { font-size: 20px; }
        }

        .sp-cta-desc {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin: 0 0 28px;
        }

        .sp-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 40px;
          background: var(--boas-gradient-primary);
          border: none;
          border-radius: 30px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: var(--boas-shadow-primary);
        }
        .sp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 212, 216, 0.5);
        }
        .sp-cta-btn svg { stroke: #fff; flex-shrink: 0; }

        /* 관련 게시글 */
        .sp-related { margin-top: 48px; }
        .sp-related-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--boas-text-primary);
          margin-bottom: 20px;
        }
        .sp-related-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .sp-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .sp-related-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .sp-related-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 212, 216, 0.12);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .sp-related-card:hover {
          transform: translateY(-4px);
          border-color: var(--boas-primary-light);
          box-shadow: 0 10px 30px rgba(0, 212, 216, 0.15);
        }

        .sp-related-thumb {
          width: 100%;
          height: 120px;
          overflow: hidden;
        }

        :global(.sp-related-cat) {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .sp-related-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--boas-text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sp-related-card:hover .sp-related-name { color: var(--boas-primary); }

        /* 사이드바 */
        .sp-sidebar { display: none; }
        @media (min-width: 1024px) {
          .sp-sidebar { display: block; }
        }

        .sp-sidebar-sticky {
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sp-sidebar-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 212, 216, 0.12);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .sp-sidebar-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--boas-text-primary);
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 212, 216, 0.12);
        }

        .sp-share-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px;
          background: var(--boas-primary-pale);
          border: 1px solid rgba(0, 212, 216, 0.2);
          border-radius: 10px;
          color: #666;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        .sp-share-btn:hover {
          background: rgba(0, 212, 216, 0.15);
          border-color: var(--boas-primary-light);
          color: var(--boas-primary-dark);
        }

        .sp-phone-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background: var(--boas-primary-pale);
          border: 1px solid rgba(0, 212, 216, 0.2);
          border-radius: 12px;
          color: var(--boas-primary-dark);
          font-size: 18px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }
        .sp-phone-link:hover {
          background: rgba(0, 212, 216, 0.15);
          transform: translateY(-1px);
        }
        .sp-phone-link svg { stroke: var(--boas-primary); }

        :global(.sp-back-btn) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: var(--boas-gradient-primary);
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }
        :global(.sp-back-btn:hover) {
          transform: translateY(-2px);
          box-shadow: var(--boas-shadow-primary);
        }

        :global(.sp-gold-btn) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: var(--boas-gradient-primary);
          border-radius: 30px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s;
        }
        :global(.sp-gold-btn:hover) {
          transform: translateY(-2px);
          box-shadow: var(--boas-shadow-primary);
        }

        /* 모바일 하단 바 */
        .sp-mobile-bar {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 212, 216, 0.2);
          padding: 12px 20px;
          gap: 10px;
        }
        @media (min-width: 1024px) {
          .sp-mobile-bar { display: none; }
        }

        .sp-mobile-back {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          background: #F8FFFE;
          border-radius: 10px;
          color: var(--boas-text-primary);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(0, 212, 216, 0.2);
        }

        .sp-mobile-consult {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          background: var(--boas-gradient-primary);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
        }
        .sp-mobile-consult svg { stroke: #fff; }

        .sp-mobile-share {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 16px;
          background: var(--boas-primary-pale);
          border: 1px solid rgba(0, 212, 216, 0.25);
          border-radius: 10px;
          color: var(--boas-primary-dark);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </>
  )
}
