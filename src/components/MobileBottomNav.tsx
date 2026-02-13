'use client'

import { useState, FormEvent } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  {
    href: '/fund',
    label: '정책자금',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: '/certification',
    label: '인증',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
  {
    href: '/success',
    label: '성공사례',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    href: '/contact#boas-contact-form',
    label: '무료심사',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [privacy, setPrivacy] = useState(false)

  const toggleForm = () => {
    setFormOpen((prev) => !prev)
  }

  const isActive = (href: string) => {
    return pathname?.startsWith(href.split('#')[0]) ?? false
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return

    const form = e.currentTarget
    const formData = new FormData(form)

    const name = (formData.get('name') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const consultTime = (formData.get('consultTime') as string) || '언제나가능'

    if (!name || !phone) {
      alert('이름과 연락처를 입력해주세요.')
      return
    }

    if (!privacy) {
      alert('개인정보 동의를 체크해주세요.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: '-',
          bizno: '',
          name,
          phone,
          email: '',
          industry: '',
          founded: '',
          consultTime,
          amount: '',
          fundType: '',
          message: '빠른 상담 요청 (모바일)',
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('상담 신청이 완료되었습니다!\n\n담당자가 희망하신 시간에 연락드리겠습니다.\n감사합니다.')
        form.reset()
        setPrivacy(false)
        setFormOpen(false)
      } else {
        alert(result.error || '신청 중 오류가 발생했습니다.')
      }
    } catch {
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="md:hidden">
      {/* Overlay */}
      {formOpen && (
        <div
          className={`boas-slideup-overlay${formOpen ? ' active' : ''}`}
          onClick={() => setFormOpen(false)}
        />
      )}

      <nav
        className={`boas-bottom-nav${formOpen ? ' open' : ''}`}
        id="boasBottomNav"
      >
        {/* Slideup CTA Trigger */}
        <div className="boas-slideup-trigger" onClick={toggleForm}>
          <div className="boas-slideup-handle"></div>
          <div className="boas-slideup-content">
            <span className="boas-slideup-text">무료 상담 신청하기</span>
            <span className="boas-slideup-icon">{'\u25B2'}</span>
          </div>
        </div>

        {/* Slideup Form Panel */}
        <div className="boas-slideup-panel">
          <div className="boas-slideup-form-header">
            <h3 className="boas-slideup-form-title">빠른 상담 신청</h3>
            <p className="boas-slideup-form-subtitle">
              간편하게 정보를 입력하시면 빠르게 연락드립니다
            </p>
            <a href="tel:1533-9269" className="boas-slideup-phone-link">
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              1533-9269
            </a>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="boas-slideup-form-grid">
              <div className="boas-slideup-group">
                <label>
                  이름 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="boas-slideup-group">
                <label>
                  연락처 <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              <div className="boas-slideup-group">
                <label>통화 희망 시간</label>
                <select name="consultTime" defaultValue="언제나가능">
                  <option value="언제나가능">언제나 가능</option>
                  <option value="09:00-12:00">오전 (09-12시)</option>
                  <option value="12:00-15:00">오후 (12-15시)</option>
                  <option value="15:00-18:00">오후 (15-18시)</option>
                </select>
              </div>
            </div>
            <div className="boas-slideup-form-actions">
              <label className="boas-slideup-privacy">
                <input
                  type="checkbox"
                  name="privacy"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  required
                />
                개인정보 동의
              </label>
              <button
                type="submit"
                className="boas-slideup-submit"
                disabled={submitting}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                {submitting ? '신청 중...' : '신청하기'}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Nav Menu Bar */}
        <div className="boas-nav-menu-bar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`boas-nav-item${isActive(item.href) ? ' active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
