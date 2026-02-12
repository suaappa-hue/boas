'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 카운트다운 타이머
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleRequest = async () => {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request' }),
      })
      const data = await res.json()

      if (data.success) {
        setStep('verify')
        setCountdown(60)
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      } else {
        setError(data.error || '인증코드 발송에 실패했습니다.')
      }
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (fullCode?: string) => {
    const verifyCode = fullCode || code.join('')
    if (verifyCode.length !== 6) {
      setError('6자리 인증코드를 입력해주세요.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code: verifyCode }),
      })
      const data = await res.json()

      if (data.success) {
        router.push(redirect)
      } else {
        setError(data.error || '인증에 실패했습니다.')
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    // 다음 입력칸으로 이동
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // 6자리 모두 입력되면 자동 검증
    const fullCode = newCode.join('')
    if (fullCode.length === 6) {
      handleVerify(fullCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newCode = pasted.split('')
      setCode(newCode)
      handleVerify(pasted)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/30 mb-4">
          <svg className="w-8 h-8 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">BOAS Partners</h1>
        <p className="text-gray-400 mt-1 text-sm">텔레그램 인증으로 로그인</p>
      </div>

      <div className="bg-[#1a2547] rounded-2xl p-8 border border-white/10">
        {step === 'request' ? (
          <>
            <div className="text-center mb-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                인증 요청 버튼을 누르면<br />
                텔레그램으로 6자리 인증코드가 발송됩니다.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleRequest}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0077b5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {loading ? '발송 중...' : '텔레그램 인증 요청'}
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                인증코드 발송됨
              </div>
              <p className="text-gray-300 text-sm">
                텔레그램에서 받은 6자리 코드를 입력하세요
              </p>
            </div>

            {/* 6자리 코드 입력 */}
            <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#0f172e] border-2 border-white/10 text-white focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc]/50 transition-all"
                />
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={() => handleVerify()}
              disabled={loading || code.join('').length !== 6}
              className="w-full py-3.5 rounded-xl bg-gold text-[#0d1829] font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '인증 중...' : '로그인'}
            </button>

            {/* 재발송 */}
            <div className="mt-4 text-center">
              {countdown > 0 ? (
                <p className="text-gray-500 text-xs">
                  재발송 가능: <span className="text-gray-300 font-medium">{countdown}초</span>
                </p>
              ) : (
                <button
                  onClick={() => { setCode(['', '', '', '', '', '']); handleRequest() }}
                  className="text-[#0088cc] text-sm hover:underline font-medium"
                >
                  인증코드 재발송
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <p className="text-center mt-6 text-gray-500 text-xs">
        &copy; BOAS Partners. All rights reserved.
      </p>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0f172e] flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="w-full max-w-md text-center text-gray-400">로딩 중...</div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
