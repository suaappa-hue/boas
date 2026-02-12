import type { MetadataRoute } from 'next'

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE_ID = 'appvXvzEaBRCvmTyU'
const BOARD_TABLE_ID = 'tbleNuxlGV59U47mZ'

const FIELD_IDS = {
  공개여부: 'fldokDOixWld4QjgG',
  작성일: 'fld4sk10tXdzZjQWh',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://example.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/fund`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/certification`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/success`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // 동적 게시글 URL 추가
  let boardPages: MetadataRoute.Sitemap = []
  try {
    if (AIRTABLE_TOKEN) {
      const params = new URLSearchParams({
        maxRecords: '100',
        returnFieldsByFieldId: 'true',
      })
      const res = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${BOARD_TABLE_ID}?${params}`,
        {
          headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
          next: { revalidate: 3600 },
        }
      )
      if (res.ok) {
        const data = await res.json()
        boardPages = data.records
          .filter((r: { fields: Record<string, unknown> }) => r.fields[FIELD_IDS.공개여부] !== false)
          .map((r: { id: string; fields: Record<string, unknown>; createdTime: string }) => ({
            url: `${baseUrl}/board/${r.id}`,
            lastModified: r.fields[FIELD_IDS.작성일]
              ? new Date(r.fields[FIELD_IDS.작성일] as string)
              : new Date(r.createdTime),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          }))
      }
    }
  } catch {
    // 게시글 fetch 실패 시 정적 페이지만 반환
  }

  return [...staticPages, ...boardPages]
}
