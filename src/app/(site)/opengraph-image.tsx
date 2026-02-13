import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '보아스 경영지원솔루션 - 정부정책자금 자금확보 전문가'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  let fontData: ArrayBuffer | undefined
  try {
    const fontRes = await fetch(
      'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.1.0/files/noto-sans-kr-korean-700-normal.woff'
    )
    if (fontRes.ok) fontData = await fontRes.arrayBuffer()
  } catch {
    // fallback without Korean font
  }

  const fontFamily = fontData ? '"Noto Sans KR"' : 'sans-serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #E0FEFF 0%, #FAF7F0 30%, #FFFFFF 60%, #E0FEFF 100%)',
          fontFamily,
          position: 'relative',
        }}
      >
        {/* Top gold accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent 5%, #00D4D8 50%, transparent 95%)',
          }}
        />

        {/* Logo - 원본 비율 유지 (1200:363 ≈ 3.3:1) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.boas-solution.kr/images/logo.png"
          width={640}
          height={194}
          style={{ marginBottom: 48 }}
          alt=""
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#00D4D8',
            marginBottom: 20,
            letterSpacing: '0.04em',
          }}
        >
          정부정책자금 · 정부지원자금
        </div>

        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: '#374151',
            letterSpacing: '0.02em',
          }}
        >
          자금확보 전문가
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 16,
            color: '#9CA3AF',
            letterSpacing: '0.06em',
          }}
        >
          www.boas-solution.kr
        </div>

        {/* Bottom gold accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent 5%, #00D4D8 50%, transparent 95%)',
          }}
        />
      </div>
    ),
    {
      ...size,
      ...(fontData
        ? {
            fonts: [
              {
                name: 'Noto Sans KR',
                data: fontData,
                weight: 700 as const,
                style: 'normal' as const,
              },
            ],
          }
        : {}),
    }
  )
}
