'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/', label: '홈' },
  { href: '/fund', label: '정책자금' },
  { href: '/certification', label: '인증지원' },
  { href: '/success', label: '성공사례' },
  { href: '/contact#boas-contact-form', label: '무료심사' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
        document.body.style.overflow = ''
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    document.body.style.overflow = ''
  }, [pathname])

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen
    setMobileMenuOpen(newState)
    document.body.style.overflow = newState ? 'hidden' : ''
  }

  const isActive = (href: string) => {
    const path = href.split('#')[0]
    if (path === '/') return pathname === '/'
    return pathname?.startsWith(path) ?? false
  }

  return (
    <header
      id="boas-header"
      className={`boas-header${scrolled ? ' scrolled' : ''}`}
    >
      <div className="boas-header-container">
        {/* Logo */}
        <Link href="/" className="boas-logo">
          <img src="/images/logo.png" alt="보아스 경영지원솔루션 로고" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="boas-desktop-nav">
          <ul className="boas-nav-menu">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive(item.href) ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Phone Button */}
        <a href="tel:1533-9269" className="boas-cta-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
          1533-9269
        </a>

        {/* Mobile Hamburger */}
        <button
          className={`boas-mobile-menu-toggle${mobileMenuOpen ? ' active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`boas-mobile-nav${mobileMenuOpen ? ' active' : ''}`}>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={isActive(item.href) ? 'active' : ''}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a href="tel:1533-9269" className="boas-mobile-cta">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                style={{
                  width: '18px',
                  height: '18px',
                  fill: '#FFFFFF',
                  display: 'inline-block',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                }}
              >
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              1533-9269
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
