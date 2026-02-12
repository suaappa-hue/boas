import Link from 'next/link'

export default function Footer() {
  return (
    <footer id="boas-footer" className="boas-footer">
      <div className="boas-footer-container">
        {/* Footer Main */}
        <div className="boas-footer-main">
          {/* Company Info */}
          <div className="boas-footer-company">
            <div className="boas-footer-logo">
              <img src="/images/logo-white.png" alt="보아스 경영지원솔루션 로고" />
            </div>

            <p className="boas-footer-description">
              대표님의 역량을 정확히 분석하고,<br />
              최적의 정책자금 솔루션을 제공합니다.
            </p>

            <div className="boas-footer-info">
              <div><strong>상호</strong> 보아스 경영지원솔루션</div>
              <div><strong>대표</strong> 김광진</div>
              <div><strong>대표번호</strong> 1533-9269</div>
              <div><strong>주소</strong> 경기도 구리시 갈매순환로 154, 552-18번지, 8층 B831호</div>
            </div>
          </div>

          {/* Contact */}
          <div className="boas-footer-contact">
            <h3 className="boas-footer-heading">연락처</h3>
            <div className="boas-contact-list">
              <div className="boas-contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <a href="tel:1533-9269" className="boas-phone-highlight">1533-9269</a>
                </div>
              </div>

              <div className="boas-contact-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <a href="mailto:boas_solution@naver.com">boas_solution@naver.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="boas-footer-links">
            <h3 className="boas-footer-heading">바로가기</h3>
            <ul className="boas-footer-nav">
              <li><Link href="/">홈</Link></li>
              <li><Link href="/fund">정책자금</Link></li>
              <li><Link href="/certification">인증지원</Link></li>
              <li><Link href="/success">성공사례</Link></li>
              <li><Link href="/contact#boas-contact-form">무료심사</Link></li>
            </ul>
          </div>
        </div>

        {/* Partnership Section (JJK) */}
        <div className="boas-partnership-section">
          <div className="boas-partnership-link">
            <a href="http://jjk-biz.com/" target="_blank" rel="noopener noreferrer">
              <img src="/images/jjk-logo.png" alt="업무협약 아이콘" className="boas-partnership-icon" />
              <span>정책자금지원센터 | 업무협약 보아스 경영지원솔루션</span>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="boas-footer-bottom">
          <p className="boas-footer-copyright">
            &copy; 2026 보아스 경영지원솔루션. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
