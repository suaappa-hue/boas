import { NextRequest, NextResponse } from 'next/server'
import Airtable from 'airtable'

const AIRTABLE_BASE_ID = 'appvXvzEaBRCvmTyU'
const AIRTABLE_TABLE = '고객접수'

interface ConsultData {
  company: string
  bizno: string
  name: string
  phone: string
  email: string
  industry: string
  founded: string
  consultTime: string
  amount: string
  fundType: string
  message: string
}

// Airtable 저장
async function saveToAirtable(data: ConsultData) {
  const token = process.env.AIRTABLE_TOKEN
  if (!token) throw new Error('AIRTABLE_TOKEN not configured')

  const base = new Airtable({ apiKey: token }).base(AIRTABLE_BASE_ID)

  await base(AIRTABLE_TABLE).create({
    '기업명': data.company,
    '사업자번호': data.bizno,
    '대표자명': data.name,
    '연락처': data.phone,
    '이메일': data.email,
    '업종': data.industry || '',
    '설립연도': data.founded || '',
    '통화가능시간': data.consultTime,
    '자금규모': data.amount || '',
    '자금종류': data.fundType,
    '문의사항': data.message || '',
    '접수일시': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
  })
}

// 텔레그램 알림 발송
async function sendTelegramNotification(data: ConsultData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) {
    console.warn('[BOAS] Telegram not configured, skipping notification')
    return
  }

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  const text = [
    '📋 *보아스 경영지원솔루션 \\- 상담 신청*',
    '',
    `👤 *대표자명:* ${escapeMarkdown(data.name)}`,
    `📞 *연락처:* ${escapeMarkdown(data.phone)}`,
    `🏢 *기업명:* ${escapeMarkdown(data.company || '-')}`,
    `⏰ *통화가능시간:* ${escapeMarkdown(data.consultTime || '-')}`,
    data.amount ? `💰 *자금규모:* ${escapeMarkdown(data.amount)}` : '',
    data.fundType ? `📂 *자금종류:* ${escapeMarkdown(data.fundType)}` : '',
    data.message ? `💬 *문의사항:* ${escapeMarkdown(data.message)}` : '',
    '',
    `🕐 ${escapeMarkdown(now)}`,
  ].filter(Boolean).join('\n')

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2',
    }),
  })
}

function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')
}

export async function POST(request: NextRequest) {
  try {
    const data: ConsultData = await request.json()

    // 필수 필드 검증
    if (!data.name || !data.phone || !data.consultTime) {
      return NextResponse.json(
        { success: false, error: '필수 항목을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 1. Airtable 저장
    try {
      await saveToAirtable(data)
    } catch (err) {
      console.error('[BOAS] Airtable save failed:', err)
    }

    // 2. 텔레그램 알림 (필수)
    try {
      await sendTelegramNotification(data)
    } catch (err) {
      console.error('[BOAS] Telegram notification failed:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[BOAS] Consult API error:', error)
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
