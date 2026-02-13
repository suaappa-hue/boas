import { EmailTemplate, EmailRecipient } from './types'

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
      { key: '상담장소', label: '상담장소', placeholder: '예: 보아스 사무실 (경기도 구리시)', type: 'text' },
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
  {
    id: 'custom',
    name: '직접 작성',
    description: '자유 형식 메일 (제목+본문)',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    variableKeys: [
      { key: '제목', label: '이메일 제목', placeholder: '[보아스] 제목을 입력하세요', type: 'text' },
      { key: '본문', label: '본문 내용', placeholder: '이메일 본문을 입력하세요. {{고객명}}, {{기업명}} 등의 변수를 사용할 수 있습니다.', type: 'textarea' },
    ],
  },
]

/* ─── Preview HTML Builders (클라이언트 미리보기 전용) ─── */

function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function substituteVars(text: string, recipient: EmailRecipient, variables: Record<string, string>): string {
  let result = text
  result = result.replace(/\{\{고객명\}\}/g, recipient.name || '-')
  result = result.replace(/\{\{기업명\}\}/g, recipient.company || '-')
  result = result.replace(/\{\{연락처\}\}/g, recipient.phone || '-')
  result = result.replace(/\{\{이메일\}\}/g, recipient.email || '-')

  // 추가 변수
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
  }

  return result
}

function highlightVars(text: string): string {
  return text.replace(/\{\{([^}]+)\}\}/g, '<span class="bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded text-xs font-semibold">{{$1}}</span>')
}

function buildEmailFrame(
  headerTitle: string,
  greeting: string,
  recipient: EmailRecipient,
  infoRows: string,
  extraSection: string,
  ctaMessage: string
): string {
  return `
    <div style="font-family:'Pretendard',-apple-system,sans-serif; max-width:600px; margin:0 auto;">
      <div style="background:linear-gradient(135deg,#009CA0 0%,#007f82 100%); color:white; padding:35px 30px; border-radius:16px 16px 0 0; text-align:center;">
        <div style="font-size:11px; opacity:0.9; margin-bottom:8px; letter-spacing:1px;">BOAS 보아스 경영지원솔루션</div>
        <h2 style="margin:0; font-size:22px; font-weight:700;">${headerTitle}</h2>
        <p style="margin:12px 0 0; opacity:0.95; font-size:14px;">경기도 구리시 | 1533-9269</p>
      </div>
      <div style="background:#fef3c7; padding:12px 20px; text-align:center; border-left:1px solid #e5e7eb; border-right:1px solid #e5e7eb;">
        <p style="margin:0; color:#92400e; font-size:12px; line-height:1.6;">📧 본 메일은 발신전용으로 회신이 불가합니다.<br>문의는 <strong>1533-9269</strong>로 연락주세요.</p>
      </div>
      <div style="background:white; padding:35px 30px; border:1px solid #e5e7eb; border-top:none;">
        <div style="background:#F5F5F5; padding:24px; border-radius:12px; margin-bottom:25px; border-left:4px solid #009CA0;">
          <p style="margin:0; color:#404040; line-height:1.8; font-size:14px;">${greeting}</p>
        </div>
        <div style="background:linear-gradient(135deg,#009CA0 0%,#007f82 100%); padding:24px; border-radius:12px; margin-bottom:25px; box-shadow:0 4px 15px rgba(0,156,160,0.25);">
          <h3 style="color:white; margin:0 0 18px; font-size:16px; font-weight:600;">📋 접수 내용</h3>
          <table style="width:100%; color:white; font-size:12px; border-collapse:separate; border-spacing:0 6px;">
            ${infoRows}
          </table>
        </div>
        ${extraSection}
        <div style="background:#F5F5F5; padding:20px 24px; border-radius:12px; margin-bottom:25px; border-left:4px solid #009CA0; text-align:center;">
          <p style="margin:0; color:#009CA0; font-weight:600; font-size:15px; line-height:1.7;">${ctaMessage}</p>
        </div>
        <div style="text-align:center; padding:20px 0; border-top:1px dashed #e5e7eb;">
          <p style="margin:0 0 15px; color:#6b7280; font-size:13px;">문의사항은 아래 연락처로 연락주세요</p>
          <p style="margin:0 0 6px; color:#374151; font-size:13px;">📞 <strong>1533-9269</strong></p>
          <p style="margin:0; color:#374151; font-size:13px;">📍 <strong>경기도 구리시</strong></p>
        </div>
      </div>
      <div style="text-align:center; padding:20px 12px; background:#009CA0; border-radius:0 0 16px 16px; color:white;">
        <p style="margin:0 0 6px; font-weight:700; font-size:14px;">BOAS 보아스 경영지원솔루션</p>
        <p style="margin:0 0 4px; opacity:0.85; font-size:12px;">중소기업 성장의 든든한 파트너</p>
        <p style="margin:10px 0 0; opacity:0.7; font-size:10px;">※ 본 메일은 발신전용으로 회신이 불가합니다.</p>
        <p style="margin:4px 0 0; opacity:0.7; font-size:10px;">문의: 1533-9269 | 경기도 구리시</p>
      </div>
    </div>`
}

export function buildPreviewHtml(
  templateId: string,
  recipient: EmailRecipient,
  variables: Record<string, string>
): string {
  const e = escapeHtml

  if (templateId === 'consultation') {
    const 상담일시 = variables['상담일시'] || '(상담일시 입력 필요)'
    const 상담장소 = variables['상담장소'] || '(상담장소 입력 필요)'
    const 담당컨설턴트명 = variables['담당컨설턴트명'] || '(담당자명 입력 필요)'

    const greeting = `안녕하세요, <strong>${e(recipient.name)}</strong>님!<br><br>귀사의 경영지원 상담이 확정되었습니다.<br><br>아래 일정을 확인하시고 방문해주시기 바랍니다.`

    const infoRows = `
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; width:35%; white-space:nowrap;">🏢 기업명</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(recipient.company)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">📞 연락처</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(recipient.phone || '-')}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">📅 상담일시</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(상담일시)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">📍 상담장소</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(상담장소)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">👤 담당자</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(담당컨설턴트명)}</td></tr>
    `

    const cta = `상담 당일 <strong>사업자등록증</strong>을 지참해주세요.`

    return buildEmailFrame('1차 상담 일정 안내', greeting, recipient, infoRows, '', cta)
  }

  if (templateId === 'documents') {
    const 자금유형 = variables['자금유형'] || '(자금유형 입력 필요)'
    const 담당컨설턴트명 = variables['담당컨설턴트명'] || '(담당자명 입력 필요)'
    const 제출마감일 = variables['제출마감일'] || '(마감일 입력 필요)'

    const greeting = `안녕하세요, <strong>${e(recipient.name)}</strong>님!<br><br>귀사의 <strong>${e(자금유형)}</strong> 심사를 위해 아래 서류를 제출해주시기 바랍니다.`

    const infoRows = `
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; width:35%; white-space:nowrap;">🏢 기업명</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(recipient.company)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">💼 자금유형</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(자금유형)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">📅 제출마감</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(제출마감일)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">👤 담당자</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(담당컨설턴트명)}</td></tr>
    `

    const extra = `
      <div style="background:#F5F5F5; padding:20px; border-radius:8px; margin-bottom:20px; border-left:3px solid #009CA0;">
        <h4 style="margin:0 0 12px; font-size:14px; color:#009CA0; font-weight:600;">📄 필요서류</h4>
        <ul style="margin:0; padding-left:20px; color:#404040; font-size:13px; line-height:1.8;">
          <li>사업자등록증 사본</li>
          <li>최근 3개년 재무제표</li>
          <li>법인등기부등본 (법인의 경우)</li>
          <li>기업현황 설명 자료</li>
        </ul>
      </div>
    `

    const cta = `서류 제출은 <strong>${e(제출마감일)}</strong>까지 완료해주세요.`

    return buildEmailFrame('2차 심사 필요서류 안내', greeting, recipient, infoRows, extra, cta)
  }

  if (templateId === 'policy-news') {
    const 정책명 = variables['정책명'] || '(정책명 입력 필요)'
    const 공고기관 = variables['공고기관'] || '(공고기관 입력 필요)'
    const 정책요약 = variables['정책요약'] || '(정책요약 입력 필요)'
    const 지원대상 = variables['지원대상'] || '-'
    const 지원규모 = variables['지원규모'] || '-'
    const 금리조건 = variables['금리조건'] || '-'
    const 신청기간 = variables['신청기간'] || '-'

    const greeting = `안녕하세요, <strong>${e(recipient.name)}</strong>님!<br><br><strong>${e(정책명)}</strong> 공고가 발표되었습니다.<br><br>귀사에 적합한 정책자금 기회를 확인해보세요.`

    const infoRows = `
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; width:35%; white-space:nowrap;">📢 공고기관</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(공고기관)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">👥 지원대상</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(지원대상)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">💰 지원규모</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(지원규모)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">📊 금리조건</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(금리조건)}</td></tr>
      <tr><td style="padding:8px 12px; background:rgba(255,255,255,0.15); border-radius:8px 0 0 8px; white-space:nowrap;">📅 신청기간</td><td style="padding:8px 12px; background:rgba(255,255,255,0.1); border-radius:0 8px 8px 0; font-weight:600;">${e(신청기간)}</td></tr>
    `

    const extra = `
      <div style="background:#F5F5F5; padding:20px; border-radius:8px; margin-bottom:20px; border-left:3px solid #009CA0;">
        <h4 style="margin:0 0 10px; font-size:14px; color:#009CA0; font-weight:600;">📝 정책 요약</h4>
        <p style="margin:0; color:#404040; font-size:13px; line-height:1.8;">${e(정책요약).replace(/\n/g, '<br>')}</p>
      </div>
    `

    const cta = `관심 있으시면 <strong>1533-9269</strong>로 문의해주세요!`

    return buildEmailFrame(정책명 + ' 안내', greeting, recipient, infoRows, extra, cta)
  }

  if (templateId === 'custom') {
    const 제목 = variables['제목'] || '[보아스] (제목 입력 필요)'
    const 본문 = substituteVars(variables['본문'] || '본문을 입력하세요...', recipient, variables)

    return `
      <div style="font-family:'Pretendard',-apple-system,sans-serif; max-width:600px; margin:0 auto;">
        <div style="background:linear-gradient(135deg,#009CA0 0%,#007f82 100%); color:white; padding:35px 30px; border-radius:16px 16px 0 0; text-align:center;">
          <div style="font-size:11px; opacity:0.9; margin-bottom:8px; letter-spacing:1px;">BOAS 보아스 경영지원솔루션</div>
          <h2 style="margin:0; font-size:22px; font-weight:700;">${e(substituteVars(제목, recipient, variables))}</h2>
          <p style="margin:12px 0 0; opacity:0.95; font-size:14px;">경기도 구리시 | 1533-9269</p>
        </div>
        <div style="background:#fef3c7; padding:12px 20px; text-align:center; border-left:1px solid #e5e7eb; border-right:1px solid #e5e7eb;">
          <p style="margin:0; color:#92400e; font-size:12px; line-height:1.6;">📧 본 메일은 발신전용으로 회신이 불가합니다.<br>문의는 <strong>1533-9269</strong>로 연락주세요.</p>
        </div>
        <div style="background:white; padding:35px 30px; border:1px solid #e5e7eb; border-top:none;">
          <div style="font-size:14px; color:#404040; line-height:1.8;">${e(본문).replace(/\n/g, '<br>')}</div>
          <div style="text-align:center; padding:20px 0; margin-top:20px; border-top:1px dashed #e5e7eb;">
            <p style="margin:0 0 15px; color:#6b7280; font-size:13px;">문의사항은 아래 연락처로 연락주세요</p>
            <p style="margin:0 0 6px; color:#374151; font-size:13px;">📞 <strong>1533-9269</strong></p>
            <p style="margin:0; color:#374151; font-size:13px;">📍 <strong>경기도 구리시</strong></p>
          </div>
        </div>
        <div style="text-align:center; padding:20px 12px; background:#009CA0; border-radius:0 0 16px 16px; color:white;">
          <p style="margin:0 0 6px; font-weight:700; font-size:14px;">BOAS 보아스 경영지원솔루션</p>
          <p style="margin:0 0 4px; opacity:0.85; font-size:12px;">중소기업 성장의 든든한 파트너</p>
          <p style="margin:10px 0 0; opacity:0.7; font-size:10px;">※ 본 메일은 발신전용으로 회신이 불가합니다.</p>
          <p style="margin:4px 0 0; opacity:0.7; font-size:10px;">문의: 1533-9269 | 경기도 구리시</p>
        </div>
      </div>
    `
  }

  return '<p>템플릿을 찾을 수 없습니다.</p>'
}

export function buildPreviewSubject(
  templateId: string,
  recipient: EmailRecipient,
  variables: Record<string, string>
): string {
  if (templateId === 'custom') {
    return substituteVars(variables['제목'] || '[보아스] (제목 입력 필요)', recipient, variables)
  }

  const subjects: Record<string, string> = {
    consultation: '[보아스] 1차 상담 일정이 확정되었습니다',
    documents: '[보아스] 2차 심사 필요서류 안내',
    'policy-news': `[보아스] ${variables['정책명'] || '신규정책'} 안내`,
  }

  return substituteVars(subjects[templateId] || '[보아스] 안내', recipient, variables)
}
