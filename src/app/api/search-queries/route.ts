import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email || !key) throw new Error('Google 서비스 계정 환경변수 미설정')
  return new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = Math.min(parseInt(searchParams.get('days') || '7', 10), 90)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50)

    const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL
    if (!siteUrl) {
      return NextResponse.json(
        { success: false, error: 'SEARCH_CONSOLE_SITE_URL 환경변수 미설정' },
        { status: 500 }
      )
    }

    const auth = getAuth()
    const searchconsole = google.searchconsole({ version: 'v1', auth })

    const endDate = new Date()
    // Search Console 데이터는 2-3일 지연 → endDate를 3일 전으로
    endDate.setDate(endDate.getDate() - 3)
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // 검색어 데이터
    const queryResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['query'],
        rowLimit: limit,
        dataState: 'all',
      },
    })

    // 페이지별 검색 성능
    const pageResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['page'],
        rowLimit: 10,
        dataState: 'all',
      },
    })

    // 일별 추이
    const dailyResponse = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        dimensions: ['date'],
        dataState: 'all',
      },
    })

    const queries = (queryResponse.data.rows || []).map((row) => ({
      query: row.keys?.[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: Math.round((row.ctr || 0) * 1000) / 10,
      position: Math.round((row.position || 0) * 10) / 10,
    }))

    const pages = (pageResponse.data.rows || []).map((row) => {
      const fullUrl = row.keys?.[0] || ''
      let path = fullUrl
      try {
        path = new URL(fullUrl).pathname
      } catch { /* keep as-is */ }
      return {
        page: path,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: Math.round((row.ctr || 0) * 1000) / 10,
        position: Math.round((row.position || 0) * 10) / 10,
      }
    })

    const daily = (dailyResponse.data.rows || []).map((row) => ({
      date: row.keys?.[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
    }))

    // 요약
    const totalClicks = queries.reduce((s, q) => s + q.clicks, 0)
    const totalImpressions = queries.reduce((s, q) => s + q.impressions, 0)
    const avgCtr = totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 1000) / 10 : 0
    const avgPosition = queries.length > 0
      ? Math.round(queries.reduce((s, q) => s + q.position, 0) / queries.length * 10) / 10
      : 0

    return NextResponse.json({
      success: true,
      data: {
        summary: { totalClicks, totalImpressions, avgCtr, avgPosition },
        queries,
        pages,
        daily,
        period: {
          start: formatDate(startDate),
          end: formatDate(endDate),
        },
      },
    })
  } catch (error) {
    console.error('[BOAS] Search Console API error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
