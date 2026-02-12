import crypto from 'crypto'

interface OTPEntry {
  code: string
  expiresAt: number
  attempts: number
}

// In-memory OTP store (serverless 환경에서는 인스턴스 재시작 시 초기화됨)
const otpStore = new Map<string, OTPEntry>()

const OTP_TTL = 5 * 60 * 1000 // 5분
const MAX_ATTEMPTS = 5

function generateOTP(): string {
  const bytes = crypto.getRandomValues(new Uint32Array(1))
  return String(bytes[0] % 1000000).padStart(6, '0')
}

export async function sendOTP(): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    return { success: false, error: '텔레그램 설정이 되어있지 않습니다.' }
  }

  // 이전 OTP가 있고 1분 이내면 재발송 차단
  const existing = otpStore.get('admin')
  if (existing && existing.expiresAt - (OTP_TTL - 60 * 1000) > Date.now()) {
    return { success: false, error: '1분 후에 다시 요청해주세요.' }
  }

  const code = generateOTP()
  otpStore.set('admin', { code, expiresAt: Date.now() + OTP_TTL, attempts: 0 })

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  const message =
    `🔑 <b>BOAS 관리자 인증코드</b>\n\n` +
    `<b>인증코드:</b> <code>${code}</code>\n\n` +
    `⏰ 유효시간: 5분\n` +
    `📅 ${now}`

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[BOAS] Telegram OTP send failed:', err)
      return { success: false, error: '텔레그램 발송에 실패했습니다.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[BOAS] Telegram OTP error:', err)
    return { success: false, error: '텔레그램 발송 중 오류가 발생했습니다.' }
  }
}

export function verifyOTP(code: string): { valid: boolean; error?: string } {
  const entry = otpStore.get('admin')

  if (!entry) {
    return { valid: false, error: '인증코드를 먼저 요청해주세요.' }
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete('admin')
    return { valid: false, error: '인증코드가 만료되었습니다. 다시 요청해주세요.' }
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete('admin')
    return { valid: false, error: '입력 횟수를 초과했습니다. 다시 요청해주세요.' }
  }

  entry.attempts++

  if (entry.code !== code) {
    const remaining = MAX_ATTEMPTS - entry.attempts
    return { valid: false, error: `인증코드가 올바르지 않습니다. (${remaining}회 남음)` }
  }

  otpStore.delete('admin')
  return { valid: true }
}
