import { EmailTemplate } from './types'

/**
 * BOAS 이메일 템플릿 정의
 * 다른 프로젝트에서 이 파일만 교체하면 템플릿 커스터마이즈 가능
 */
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'consultation',
    name: '1차 상담 안내',
    description: '상담 일정·장소·준비물 안내',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    variableKeys: [
      { key: '상담일시', label: '상담일시', placeholder: '예: 2026년 2월 20일 (목) 오후 2시', type: 'text' },
      { key: '상담장소', label: '상담장소', placeholder: '예: 보아스 사무실 (서울 강남구 테헤란로 123)', type: 'text' },
      { key: '담당컨설턴트명', label: '담당컨설턴트명', placeholder: '예: 김광진 대표', type: 'text' },
    ],
  },
  {
    id: 'documents',
    name: '2차 심사안내',
    description: '심사 필요서류 체크리스트',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    variableKeys: [
      { key: '자금유형', label: '자금유형', placeholder: '예: 정책자금, 운영자금, 시설자금', type: 'text' },
      { key: '담당컨설턴트명', label: '담당컨설턴트명', placeholder: '예: 김광진 대표', type: 'text' },
      { key: '제출마감일', label: '제출마감일', placeholder: '', type: 'date' },
    ],
  },
  {
    id: 'policy-news',
    name: '신규정책 소식',
    description: '정책자금 뉴스레터 (일괄 발송)',
    autoSelectAll: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    variableKeys: [
      { key: '정책명', label: '정책명', placeholder: '예: 2026년 청년창업 지원사업', type: 'text' },
      { key: '공고기관', label: '공고기관', placeholder: '예: 중소벤처기업부', type: 'text' },
      { key: '정책요약', label: '정책요약', placeholder: '정책의 핵심 내용을 간략히 요약해주세요', type: 'textarea' },
      { key: '지원대상', label: '지원대상', placeholder: '예: 3년 이내 창업기업', type: 'text', halfWidth: true },
      { key: '지원규모', label: '지원규모', placeholder: '예: 최대 5천만원', type: 'text', halfWidth: true },
      { key: '금리조건', label: '금리조건', placeholder: '예: 연 2.0% 고정금리', type: 'text', halfWidth: true },
      { key: '신청기간', label: '신청기간', placeholder: '예: 2026.02.20 ~ 03.20', type: 'text', halfWidth: true },
    ],
  },
]
