import { NextRequest, NextResponse } from 'next/server'
import { sendOTP, verifyOTP } from '@/lib/admin-otp'

export async function POST(request: NextRequest) {
  try {
    const { action, code } = await request.json()

    // 인증코드 요청
    if (action === 'request') {
      const result = await sendOTP()
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 })
      }
      return NextResponse.json({ success: true, message: '텔레그램으로 인증코드를 발송했습니다.' })
    }

    // 인증코드 검증
    if (action === 'verify') {
      if (!code || typeof code !== 'string') {
        return NextResponse.json({ success: false, error: '인증코드를 입력해주세요.' }, { status: 400 })
      }

      const result = verifyOTP(code.trim())
      if (!result.valid) {
        return NextResponse.json({ success: false, error: result.error }, { status: 401 })
      }

      const response = NextResponse.json({ success: true })
      response.cookies.set('admin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7일
        path: '/',
      })

      return response
    }

    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 })
  } catch {
    return NextResponse.json({ success: false, error: '서버 오류' }, { status: 500 })
  }
}
