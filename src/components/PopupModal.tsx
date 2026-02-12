'use client'

import { useState, useEffect, useCallback } from 'react'

interface PopupItem {
  id: string
  제목: string
  ALT텍스트: string
  이미지URL: string
  링크URL: string
  링크타겟: string
  순서: number
  활성여부: boolean
}

function getTodayKey() {
  return 'BOAS_popup_hide_' + new Date().toISOString().split('T')[0]
}

export default function PopupModal() {
  const [popups, setPopups] = useState<PopupItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [dontShow, setDontShow] = useState(false)

  useEffect(() => {
    // Check localStorage
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(getTodayKey()) === 'true') {
        return
      }
    }

    const loadPopups = async () => {
      try {
        const response = await fetch('/api/popups')
        const data = await response.json()

        if (data.success && data.popups && data.popups.length > 0) {
          setPopups(data.popups)
          setVisible(true)
          document.body.style.overflow = 'hidden'
        }
      } catch (error) {
        console.error('팝업 로드 실패:', error)
      }
    }

    loadPopups()
  }, [])

  const closeModal = useCallback(() => {
    setVisible(false)
    document.body.style.overflow = ''
  }, [])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeModal])

  const handleDontShowToday = (checked: boolean) => {
    setDontShow(checked)
    if (checked) {
      localStorage.setItem(getTodayKey(), 'true')
      closeModal()
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!visible || popups.length === 0) return null

  return (
    <div className="boas-popup-overlay" onClick={closeModal}>
      <div
        className="boas-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="boas-popup-close"
          onClick={closeModal}
          aria-label="닫기"
        >
          &times;
        </button>

        <div className="boas-popup-content">
          <div className="boas-popup-slider">
            {popups.map((popup, index) => {
              const slideContent = (
                <img
                  src={popup.이미지URL}
                  alt={popup.ALT텍스트 || popup.제목}
                />
              )

              return (
                <div
                  key={popup.id}
                  className={`boas-popup-slide${index === currentIndex ? ' active' : ''}`}
                >
                  {popup.링크URL ? (
                    <a
                      href={popup.링크URL}
                      target={popup.링크타겟 || '_self'}
                      rel="noopener noreferrer"
                    >
                      {slideContent}
                    </a>
                  ) : (
                    slideContent
                  )}
                </div>
              )
            })}
          </div>

          {popups.length > 1 && (
            <div className="boas-popup-nav">
              {popups.map((_, index) => (
                <button
                  key={index}
                  className={`boas-popup-nav-dot${index === currentIndex ? ' active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`슬라이드 ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="boas-popup-footer">
          <label className="boas-popup-checkbox">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => handleDontShowToday(e.target.checked)}
            />
            <span>오늘 하루 보지 않기</span>
          </label>
        </div>
      </div>
    </div>
  )
}
