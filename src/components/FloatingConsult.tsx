'use client'

import { useState, FormEvent } from 'react'

export default function FloatingConsult() {
  const [collapsed, setCollapsed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [privacy, setPrivacy] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev)
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
          message: '빠른 상담 요청 (플로팅)',
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('상담 신청이 완료되었습니다!\n\n담당자가 희망하신 시간에 연락드리겠습니다.\n감사합니다.')
        form.reset()
        setPrivacy(false)
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
    <div className="hidden md:block">
      <div
        className={`boas-floating-consult${collapsed ? ' collapsed' : ''}`}
        id="boasFloatingConsult"
      >
        {/* Toggle Button */}
        <button className="boas-floating-toggle" onClick={toggleCollapsed}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          <span>{collapsed ? '빠른 상담신청 접수' : '빠른 상담신청 접기'}</span>
          <span className="boas-floating-toggle-icon">
            {collapsed ? '\u25B2' : '\u25BC'}
          </span>
        </button>

        {/* Form Panel */}
        <div className="boas-floating-form">
          {/* Left: Info */}
          <div className="boas-floating-header">
            <h3 className="boas-floating-title">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7h-4V5l-2-2h-4L8 5v2H4c-1.1 0-2 .9-2 2v5c0 .75.4 1.38 1 1.73V19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-3.28c.59-.35 1-.99 1-1.72V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zM4 9h16v5h-5v-3H9v3H4V9zm9 6h-2v-2h2v2zm6 4H5v-3h4v1h6v-1h4v3z" />
              </svg>
              빠른 상담 신청
            </h3>
            <p className="boas-floating-subtitle">
              간편하게 정보를 입력하시면 빠르게 연락드립니다
            </p>
            <a href="tel:1533-9269" className="boas-floating-phone">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              1533-9269 (평일 09:00~18:00)
            </a>
          </div>

          {/* Right: Form */}
          <div className="boas-floating-content">
            <form onSubmit={handleSubmit}>
              <div className="boas-floating-grid">
                <div className="boas-floating-group">
                  <label className="boas-floating-label">
                    이름 <span className="boas-floating-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="boas-floating-input"
                    name="name"
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div className="boas-floating-group">
                  <label className="boas-floating-label">
                    연락처 <span className="boas-floating-required">*</span>
                  </label>
                  <input
                    type="tel"
                    className="boas-floating-input"
                    name="phone"
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
                <div className="boas-floating-group">
                  <label className="boas-floating-label">
                    통화 시간 <span className="boas-floating-required">*</span>
                  </label>
                  <select
                    className="boas-floating-select"
                    name="consultTime"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>선택</option>
                    <option value="09:00-10:00">09:00-10:00</option>
                    <option value="10:00-11:00">10:00-11:00</option>
                    <option value="11:00-12:00">11:00-12:00</option>
                    <option value="14:00-15:00">14:00-15:00</option>
                    <option value="15:00-16:00">15:00-16:00</option>
                    <option value="16:00-17:00">16:00-17:00</option>
                    <option value="17:00-18:00">17:00-18:00</option>
                    <option value="언제나가능">언제나 가능</option>
                  </select>
                </div>
              </div>
              <div className="boas-floating-grid-submit">
                <div className="boas-floating-privacy">
                  <input
                    type="checkbox"
                    id="boasPrivacy"
                    name="privacy"
                    checked={privacy}
                    onChange={(e) => setPrivacy(e.target.checked)}
                    required
                  />
                  <label htmlFor="boasPrivacy">
                    개인정보 동의 <span className="boas-floating-required">*</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="boas-floating-submit"
                  disabled={submitting}
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  {submitting ? '신청 중...' : '신청하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
