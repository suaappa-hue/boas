import type { Metadata } from 'next'
import PostDetailClient from './PostDetailClient'
import { articleSchema, breadcrumbSchema } from '@/lib/seo/schemas'

interface Props {
  params: Promise<{ id: string }>
}

interface BoardPost {
  id: string
  제목: string
  요약: string
  내용: string
  카테고리: string
  금액: string
  작성일: string
  공개여부: boolean
  썸네일: string
}

async function getPost(id: string): Promise<BoardPost | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/board?id=${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.post || null
  } catch {
    return null
  }
}

const SITE_URL = 'https://www.boas-solution.kr'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return {
      title: '게시글을 찾을 수 없습니다 | 보아스 경영지원솔루션',
      description: '요청하신 게시글을 찾을 수 없습니다.',
    }
  }

  const title = `${post.제목} | 보아스 경영지원솔루션`
  const description = post.요약 || `${post.카테고리} - 보아스 경영지원솔루션의 정책자금 컨설팅 정보를 확인하세요.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/board/${id}`,
      siteName: '보아스 경영지원솔루션',
      locale: 'ko_KR',
      type: 'article',
      ...(post.썸네일 ? { images: [{ url: post.썸네일 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(post.썸네일 ? { images: [post.썸네일] } : {}),
    },
    alternates: { canonical: `${SITE_URL}/board/${id}` },
  }
}

export default async function BoardPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <>
      {post && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              articleSchema({
                title: post.제목,
                description: post.요약 || `${post.카테고리} - 보아스 경영지원솔루션`,
                url: `${SITE_URL}/board/${id}`,
                datePublished: post.작성일 || new Date().toISOString(),
                image: post.썸네일 || undefined,
              }),
              breadcrumbSchema([
                { name: '홈', url: SITE_URL },
                { name: '성공사례', url: `${SITE_URL}/success` },
                { name: post.제목, url: `${SITE_URL}/board/${id}` },
              ]),
            ]),
          }}
        />
      )}
      <PostDetailClient postId={id} />
    </>
  )
}
