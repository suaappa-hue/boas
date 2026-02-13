import { NextRequest, NextResponse } from 'next/server'

interface Recipient {
  id: string
  email: string
  name: string
  company: string
  phone?: string
}

interface EmailSendRequest {
  template: string
  recipients?: Recipient[] // Legacy batch send
  recipient?: Recipient // New sequential send
  variables: Record<string, string>
  customSubject?: string // For custom template
  customHtml?: string // For custom template
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailSendRequest = await request.json()
    const { template, recipients, recipient, variables, customSubject, customHtml } = body

    // Single recipient or batch?
    const targetRecipients = recipient ? [recipient] : recipients || []

    // Validation
    if (!template || targetRecipients.length === 0 || !variables) {
      return NextResponse.json({ success: false, error: '필수 필드가 누락되었습니다' }, { status: 400 })
    }

    // NOTIFY_SECRET 확인
    const notifySecret = process.env.NOTIFY_SECRET
    if (!notifySecret) {
      console.error('[BOAS Email] NOTIFY_SECRET not configured')
      return NextResponse.json({ success: false, error: '이메일 발송 설정이 올바르지 않습니다' }, { status: 500 })
    }

    // Worker에 요청 전달
    const workerUrl = 'https://boas-notify.suaappa.workers.dev/send-email'
    const response = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Notify-Secret': notifySecret,
      },
      body: JSON.stringify({
        template,
        recipients: targetRecipients,
        variables,
        customSubject,
        customHtml,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[BOAS Email] Worker error:', data)
      return NextResponse.json({ success: false, error: data.error || '이메일 발송 실패' }, { status: response.status })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('[BOAS Email] Send error:', error)
    return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
