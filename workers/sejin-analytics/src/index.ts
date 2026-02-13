interface Env {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string
  GOOGLE_PRIVATE_KEY: string
  GA4_PROPERTY_ID: string
  AIRTABLE_TOKEN: string
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_CHAT_ID: string
  NOTIFY_SECRET: string
}

// Airtable config
const AIRTABLE_BASE_ID = 'appvXvzEaBRCvmTyU'
const AIRTABLE_TABLE_NAME = '일별통계'

// ─── JWT / OAuth2 (Web Crypto API) ───

function base64UrlEncode(data: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function strToBase64Url(str: string): string {
  return base64UrlEncode(new TextEncoder().encode(str))
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const pemLines = pem.replace(/-----BEGIN PRIVATE KEY-----/, '').replace(/-----END PRIVATE KEY-----/, '').replace(/\s/g, '')
  const binary = atob(pemLines)
  const buf = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    buf[i] = binary.charCodeAt(i)
  }
  return buf.buffer
}

async function createJwt(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }

  const headerB64 = strToBase64Url(JSON.stringify(header))
  const claimB64 = strToBase64Url(JSON.stringify(claim))
  const unsignedToken = `${headerB64}.${claimB64}`

  const privateKey = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  const keyData = pemToArrayBuffer(privateKey)

  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsignedToken)
  )

  const signatureB64 = base64UrlEncode(new Uint8Array(signature))
  return `${unsignedToken}.${signatureB64}`
}

async function getAccessToken(env: Env): Promise<string> {
  const jwt = await createJwt(env)
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  const data = await res.json() as { access_token?: string; error?: string; error_description?: string }
  if (!data.access_token) {
    throw new Error(`OAuth2 token failed: ${data.error} - ${data.error_description}`)
  }
  return data.access_token
}

// ─── GA4 Data API ───

interface GA4Row {
  dimensionValues?: Array<{ value: string }>
  metricValues?: Array<{ value: string }>
}

interface GA4Report {
  rows?: GA4Row[]
}

interface BatchRunReportsResponse {
  reports?: GA4Report[]
}

function val(row: GA4Row | undefined, idx: number): number {
  return parseInt(row?.metricValues?.[idx]?.value || '0', 10)
}

function dim(row: GA4Row | undefined, idx = 0): string {
  const v = row?.dimensionValues?.[idx]?.value || ''
  return v === '(not set)' ? '기타' : v
}

function getYesterdayKST(): string {
  const now = new Date()
  // KST = UTC+9
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  kst.setDate(kst.getDate() - 1)
  const y = kst.getUTCFullYear()
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0')
  const d = String(kst.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

async function fetchGA4Data(env: Env, accessToken: string) {
  const property = `properties/${env.GA4_PROPERTY_ID}`
  const dateRanges = [{ startDate: 'yesterday', endDate: 'yesterday' }]

  // Batch 1: summary, sources, devices
  const batch1Res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${property}:batchRunReports`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          // 0: Summary metrics
          {
            dateRanges,
            metrics: [
              { name: 'totalUsers' },
              { name: 'screenPageViews' },
              { name: 'averageSessionDuration' },
              { name: 'bounceRate' },
            ],
          },
          // 1: Traffic sources
          {
            dateRanges,
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 10,
          },
          // 2: Devices
          {
            dateRanges,
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          },
          // 3: Top pages
          {
            dateRanges,
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 10,
          },
          // 4: Regions
          {
            dateRanges,
            dimensions: [{ name: 'city' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 10,
          },
        ],
      }),
    }
  )

  if (!batch1Res.ok) {
    const errText = await batch1Res.text()
    throw new Error(`GA4 batch1 failed: ${batch1Res.status} ${errText}`)
  }
  const batch1 = await batch1Res.json() as BatchRunReportsResponse

  // Batch 2: Event counts
  const batch2Res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${property}:batchRunReports`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            dateRanges,
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }],
            dimensionFilter: {
              filter: {
                fieldName: 'eventName',
                inListFilter: {
                  values: ['cta_click', 'phone_click', 'form_submit'],
                },
              },
            },
          },
        ],
      }),
    }
  )

  if (!batch2Res.ok) {
    const errText = await batch2Res.text()
    throw new Error(`GA4 batch2 failed: ${batch2Res.status} ${errText}`)
  }
  const batch2 = await batch2Res.json() as BatchRunReportsResponse

  const reports1 = batch1.reports || []
  const reports2 = batch2.reports || []

  // Summary
  const sRow = reports1[0]?.rows?.[0]
  const visitors = val(sRow, 0)
  const pageviews = val(sRow, 1)
  const avgDurationSec = parseFloat(sRow?.metricValues?.[2]?.value || '0')
  const bounceRateRaw = parseFloat(sRow?.metricValues?.[3]?.value || '0')

  // Traffic sources
  const srcRows = reports1[1]?.rows || []
  const srcTotal = srcRows.reduce((s, r) => s + val(r, 0), 0)
  const trafficSources = srcRows.map(r => {
    const count = val(r, 0)
    return { source: dim(r), count, percent: srcTotal > 0 ? Math.round((count / srcTotal) * 1000) / 10 : 0 }
  })

  // Devices
  const devRows = reports1[2]?.rows || []
  const devTotal = devRows.reduce((s, r) => s + val(r, 0), 0)
  const devices = devRows.map(r => {
    const count = val(r, 0)
    return { type: dim(r), count, percent: devTotal > 0 ? Math.round((count / devTotal) * 1000) / 10 : 0 }
  })

  // Top pages
  const topPages = (reports1[3]?.rows || []).map(r => ({
    path: dim(r),
    views: val(r, 0),
  }))

  // Regions
  const regRows = reports1[4]?.rows || []
  const regTotal = regRows.reduce((s, r) => s + val(r, 0), 0)
  const regions = regRows.map(r => {
    const count = val(r, 0)
    return { name: dim(r), count, percent: regTotal > 0 ? Math.round((count / regTotal) * 1000) / 10 : 0 }
  })

  // Event counts
  const eventMap: Record<string, number> = {}
  for (const row of reports2[0]?.rows || []) {
    eventMap[dim(row)] = val(row, 0)
  }

  return {
    visitors,
    pageviews,
    avgDuration: Math.round(avgDurationSec),
    bounceRate: Math.round(bounceRateRaw * 1000) / 10,
    phoneClick: eventMap['phone_click'] || 0,
    ctaClick: eventMap['cta_click'] || 0,
    formSubmit: eventMap['form_submit'] || 0,
    trafficSources,
    topPages,
    devices,
    regions,
  }
}

// ─── Airtable ───

async function findExistingRecord(env: Env, date: string): Promise<string | null> {
  const formula = encodeURIComponent(`{날짜}='${date}'`)
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}?filterByFormula=${formula}&maxRecords=1`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` },
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Airtable GET failed: ${res.status} ${errText}`)
  }
  const data = await res.json() as { records: Array<{ id: string }> }
  return data.records.length > 0 ? data.records[0].id : null
}

interface AirtableFields {
  '날짜': string
  '방문자': number
  '페이지뷰': number
  '평균체류초': number
  '이탈률': number
  '전화클릭': number
  'CTA클릭': number
  '폼제출': number
  '트래픽소스': string
  '상위페이지': string
  '기기분포': string
  '지역': string
}

async function upsertAirtable(env: Env, date: string, ga4Data: Awaited<ReturnType<typeof fetchGA4Data>>) {
  const fields: AirtableFields = {
    '날짜': date,
    '방문자': ga4Data.visitors,
    '페이지뷰': ga4Data.pageviews,
    '평균체류초': ga4Data.avgDuration,
    '이탈률': ga4Data.bounceRate,
    '전화클릭': ga4Data.phoneClick,
    'CTA클릭': ga4Data.ctaClick,
    '폼제출': ga4Data.formSubmit,
    '트래픽소스': JSON.stringify(ga4Data.trafficSources),
    '상위페이지': JSON.stringify(ga4Data.topPages),
    '기기분포': JSON.stringify(ga4Data.devices),
    '지역': JSON.stringify(ga4Data.regions),
  }

  const existingId = await findExistingRecord(env, date)

  if (existingId) {
    // PATCH existing record
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}/${existingId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    )
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Airtable PATCH failed: ${res.status} ${errText}`)
    }
    return 'updated'
  } else {
    // POST new record
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    )
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Airtable POST failed: ${res.status} ${errText}`)
    }
    return 'created'
  }
}

// ─── Telegram 에러 알림 ───

async function sendTelegramAlert(env: Env, message: string) {
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    })
  } catch {
    // Telegram 실패는 무시
  }
}

// ─── Worker Entry ───

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const date = getYesterdayKST()
    console.log(`[boas-analytics] Cron triggered for date: ${date}`)

    try {
      // 1. OAuth2 Access Token
      const accessToken = await getAccessToken(env)
      console.log('[boas-analytics] OAuth2 token acquired')

      // 2. GA4 Data API
      const ga4Data = await fetchGA4Data(env, accessToken)
      console.log(`[boas-analytics] GA4 data fetched: ${ga4Data.visitors} visitors, ${ga4Data.pageviews} pageviews`)

      // 3. Airtable upsert
      const action = await upsertAirtable(env, date, ga4Data)
      console.log(`[boas-analytics] Airtable record ${action} for ${date}`)

      // 4. 성공 알림
      await sendTelegramAlert(env,
        `📊 <b>보아스 일별통계 저장 완료</b>\n\n` +
        `📅 ${date}\n` +
        `├ 방문자: <b>${ga4Data.visitors}</b>\n` +
        `├ 페이지뷰: <b>${ga4Data.pageviews}</b>\n` +
        `├ 평균체류: ${ga4Data.avgDuration}초\n` +
        `├ 이탈률: ${ga4Data.bounceRate}%\n` +
        `├ 전화클릭: ${ga4Data.phoneClick}\n` +
        `├ CTA클릭: ${ga4Data.ctaClick}\n` +
        `└ 폼제출: ${ga4Data.formSubmit}\n\n` +
        `✅ Airtable ${action === 'created' ? '신규 생성' : '업데이트'}`
      )
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      console.error(`[boas-analytics] Error: ${errMsg}`)

      await sendTelegramAlert(env,
        `🚨 <b>보아스 일별통계 오류</b>\n\n` +
        `📅 대상 날짜: ${date}\n` +
        `❌ ${errMsg.slice(0, 500)}`
      )
    }
  },

  // HTTP 엔드포인트 (수동 트리거 / 테스트용)
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET',
          'Access-Control-Allow-Headers': 'Content-Type, X-Notify-Secret',
        },
      })
    }

    // 인증 확인
    const secret = request.headers.get('X-Notify-Secret')
    if (!secret || secret !== env.NOTIFY_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const dateParam = url.searchParams.get('date')
    const date = dateParam || getYesterdayKST()

    try {
      const accessToken = await getAccessToken(env)
      const ga4Data = await fetchGA4Data(env, accessToken)
      const action = await upsertAirtable(env, date, ga4Data)

      return Response.json({
        success: true,
        date,
        action,
        data: {
          visitors: ga4Data.visitors,
          pageviews: ga4Data.pageviews,
          avgDuration: ga4Data.avgDuration,
          bounceRate: ga4Data.bounceRate,
          phoneClick: ga4Data.phoneClick,
          ctaClick: ga4Data.ctaClick,
          formSubmit: ga4Data.formSubmit,
        },
      })
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error)
      return Response.json({ success: false, error: errMsg }, { status: 500 })
    }
  },
}
