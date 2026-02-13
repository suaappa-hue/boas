interface Env {
  NOTIFY_SECRET: string
  TELEGRAM_BOT_TOKEN: string
  TELEGRAM_CHAT_ID: string
  GMAIL_CLIENT_ID: string
  GMAIL_CLIENT_SECRET: string
  GMAIL_REFRESH_TOKEN: string
  GMAIL_USER: string
}

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

interface Recipient {
  email: string
  name: string
  company: string
}

interface SendEmailRequest {
  template: 'consultation' | 'documents' | 'policy-news'
  recipients: Recipient[]
  variables: Record<string, string>
}

// ─── Gmail API (OAuth2 REST) ───

async function refreshAccessToken(env: Env): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  })
  const data = (await res.json()) as { access_token?: string; error?: string }
  if (!data.access_token) throw new Error(`Token refresh failed: ${data.error || 'unknown'}`)
  return data.access_token
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function encodeMimeWord(text: string): string {
  return '=?UTF-8?B?' + btoa(String.fromCharCode(...new TextEncoder().encode(text))) + '?='
}

async function sendGmail(env: Env, to: string, subject: string, html: string) {
  const accessToken = await refreshAccessToken(env)

  const raw = [
    `From: "${encodeMimeWord('보아스 경영지원솔루션')}" <${env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${encodeMimeWord(subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    btoa(String.fromCharCode(...new TextEncoder().encode(html))),
  ].join('\r\n')

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: toBase64Url(raw) }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gmail send failed: ${res.status} ${err}`)
  }
}

// ─── Telegram ───

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function hasValue(s: string | undefined): boolean {
  return !!s && s !== '-' && s.trim() !== ''
}

function buildTelegramMessage(data: ConsultData, now: string): string {
  let msg = '🔔 <b>BOAS 신규 상담 접수</b>\n\n'

  // 고객정보 - 있는 항목만
  const info: string[] = []
  if (hasValue(data.company)) info.push('기업명: <b>' + escapeHtml(data.company) + '</b>')
  if (hasValue(data.bizno)) info.push('사업자번호: ' + escapeHtml(data.bizno))
  info.push('이름: <b>' + escapeHtml(data.name) + '</b>')
  info.push('연락처: <code>' + escapeHtml(data.phone) + '</code>')
  if (hasValue(data.email)) info.push('이메일: ' + escapeHtml(data.email))
  if (hasValue(data.industry)) info.push('업종: ' + escapeHtml(data.industry))
  if (hasValue(data.founded)) info.push('설립연도: ' + escapeHtml(data.founded))
  info.push('통화가능: <b>' + escapeHtml(data.consultTime) + '</b>')
  if (hasValue(data.amount)) info.push('자금규모: ' + escapeHtml(data.amount))
  if (hasValue(data.fundType)) info.push('자금종류: ' + escapeHtml(data.fundType))

  for (let i = 0; i < info.length; i++) {
    const prefix = i === info.length - 1 ? '└' : '├'
    msg += prefix + ' ' + info[i] + '\n'
  }

  if (hasValue(data.message) && data.message !== '빠른 상담 요청 (플로팅)') {
    msg += '\n💬 <b>문의</b>\n' + escapeHtml(data.message) + '\n'
  }

  msg += '\n📅 ' + now
  msg += '\n\n📊 <a href="https://www.boas-solution.kr/dashboard/leads">리드 관리 바로가기</a>'
  return msg
}

async function sendTelegram(env: Env, data: ConsultData, now: string) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: buildTelegramMessage(data, now),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Telegram send failed: ${res.status} ${err}`)
  }
}

// ─── 고객 확인 이메일 HTML ───

function buildCustomerEmailHtml(data: ConsultData, now: string): string {
  return `
<div style="font-family:'Pretendard',-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#F8FFFE;padding:40px 30px;border-radius:16px 16px 0 0;text-align:center;border-bottom:3px solid #009CA0;">
    <h1 style="color:#009CA0;margin:0;font-size:24px;font-weight:800;">BOAS</h1>
    <p style="color:#64748B;margin:8px 0 0;font-size:13px;">보아스 경영지원솔루션</p>
    <p style="color:#1E293B;margin:16px 0 0;font-size:15px;font-weight:600;">상담 접수가 완료되었습니다</p>
  </div>

  <div style="padding:35px 30px;border:1px solid #e5e7eb;border-top:none;">
    <p style="font-size:14px;color:#1E293B;line-height:1.7;margin:0 0 20px;">
      <strong>${data.name}</strong> 대표님, 안녕하세요.<br>
      <strong style="color:#009CA0;">보아스 경영지원솔루션</strong>에 상담을 접수해 주셔서 감사합니다.
    </p>

    <div style="background:#F8FFFE;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #009CA0;">
      <h3 style="margin:0 0 14px;font-size:15px;color:#1E293B;">접수 내용 확인</h3>
      <table style="width:100%;font-size:13px;color:#4b5563;">
        <tr><td style="padding:6px 0;width:100px;color:#64748B;">기업명</td><td style="font-weight:600;color:#1E293B;">${data.company}</td></tr>
        <tr><td style="padding:6px 0;color:#64748B;">자금 종류</td><td style="font-weight:600;color:#1E293B;">${data.fundType || '-'}</td></tr>
        <tr><td style="padding:6px 0;color:#64748B;">자금 규모</td><td style="font-weight:600;color:#1E293B;">${data.amount || '-'}</td></tr>
        <tr><td style="padding:6px 0;color:#64748B;">희망 통화시간</td><td style="font-weight:600;color:#1E293B;">${data.consultTime}</td></tr>
        <tr><td style="padding:6px 0;color:#64748B;">접수 시각</td><td style="color:#1E293B;">${now}</td></tr>
      </table>
    </div>

    <div style="background:#E0FEFF;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#007C80;line-height:1.6;">
        <strong>담당 전문가가 빠른 시일 내에 연락드리겠습니다.</strong><br>
        희망하신 통화 가능 시간(<strong>${data.consultTime}</strong>)에 맞춰 연락드릴 예정입니다.
      </p>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="margin:0 0 12px;color:#64748B;font-size:13px;">급한 문의는 아래로 연락 부탁드립니다</p>
      <a href="tel:15339269" style="display:inline-block;background:#009CA0;color:#FFFFFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        1533-9269
      </a>
    </div>
  </div>

  <div style="text-align:center;padding:24px;background:#F8FFFE;border-radius:0 0 16px 16px;border-top:1px solid #E0FEFF;">
    <p style="margin:0;font-weight:700;color:#009CA0;font-size:13px;">BOAS 보아스 경영지원솔루션</p>
    <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">경기도 구리시 | 대표전화 1533-9269</p>
    <p style="margin:6px 0 0;color:#CBD5E1;font-size:10px;">본 메일은 홈페이지 상담 접수 시 자동 발송됩니다.</p>
  </div>
</div>`
}

// ─── 사내 알림 이메일 HTML ───

function buildStaffEmailHtml(data: ConsultData, now: string): string {
  const row = (label: string, value: string, bold = false) =>
    `<tr>
       <td style="padding:10px 14px;color:#64748B;font-size:13px;width:35%;border-bottom:1px solid #F0FDFD;">${label}</td>
       <td style="padding:10px 14px;color:#1E293B;font-size:13px;border-bottom:1px solid #F0FDFD;${bold ? 'font-weight:700;' : ''}">${value}</td>
     </tr>`

  return `
<div style="font-family:'Pretendard',-apple-system,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#F8FFFE;padding:24px 30px;border-radius:16px 16px 0 0;border-bottom:3px solid #009CA0;">
    <h2 style="margin:0;font-size:20px;font-weight:700;color:#009CA0;">BOAS 신규 상담 접수</h2>
    <p style="margin:6px 0 0;color:#64748B;font-size:13px;">홈페이지 무료상담 폼</p>
  </div>
  <div style="background:white;padding:30px;border:1px solid #e5e7eb;border-top:none;">
    <div style="background:#F8FFFE;padding:20px;border-radius:12px;margin-bottom:20px;border:1px solid #E0FEFF;">
      <h3 style="color:#007C80;margin:0 0 12px;font-size:15px;font-weight:700;">고객 연락처</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${row('기업명', data.company, true)}
        ${row('사업자번호', data.bizno)}
        ${row('대표자명', data.name, true)}
        ${row('연락처', data.phone, true)}
        ${row('이메일', data.email)}
        ${row('희망시간', data.consultTime, true)}
      </table>
    </div>
    <div style="background:#F8FFFE;padding:20px;border-radius:12px;margin-bottom:20px;border-left:4px solid #009CA0;">
      <h3 style="color:#007C80;margin:0 0 12px;font-size:15px;font-weight:700;">자금 정보</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${row('업종', data.industry || '-')}
        ${row('설립연도', data.founded || '-')}
        ${row('필요 자금 규모', data.amount || '미선택')}
        ${row('자금 종류', data.fundType || '미선택')}
      </table>
    </div>
    ${data.message ? `
    <div style="background:#E0FEFF;padding:20px;border-radius:12px;margin-bottom:20px;">
      <h3 style="color:#007C80;margin:0 0 10px;font-size:15px;font-weight:700;">문의내용</h3>
      <p style="margin:0;color:#1E293B;white-space:pre-wrap;font-size:13px;line-height:1.6;">${data.message}</p>
    </div>` : ''}
    <div style="text-align:center;padding:15px;background:#F8FFFE;border-radius:8px;">
      <p style="margin:0 0 10px;color:#64748B;font-size:12px;">빠른 연락을 위해 아래 버튼을 클릭하세요</p>
      <a href="tel:${data.phone.replace(/-/g, '')}" style="display:inline-block;background:#009CA0;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">바로 전화하기</a>
    </div>
  </div>
  <div style="text-align:center;padding:20px;background:#F8FFFE;border-radius:0 0 16px 16px;border-top:1px solid #E0FEFF;">
    <p style="margin:0;font-weight:700;color:#009CA0;font-size:12px;">BOAS 보아스 경영지원솔루션 | 1533-9269</p>
    <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">접수 시각: ${now}</p>
  </div>
</div>`
}

// ─── Template Email HTML Builders ───

function buildConsultationEmailHtml(customerName: string, variables: Record<string, string>): string {
  return `
<div style="font-family:'Pretendard',-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#F8FFFE;padding:40px 30px;border-radius:16px 16px 0 0;text-align:center;border-bottom:3px solid #009CA0;">
    <h1 style="color:#009CA0;margin:0;font-size:24px;font-weight:800;">BOAS</h1>
    <p style="color:#64748B;margin:8px 0 0;font-size:13px;">보아스 경영지원솔루션</p>
    <p style="color:#1E293B;margin:16px 0 0;font-size:16px;font-weight:700;">1차 상담 일정이 확정되었습니다</p>
  </div>

  <div style="padding:35px 30px;border:1px solid #e5e7eb;border-top:none;">
    <p style="font-size:14px;color:#1E293B;line-height:1.7;margin:0 0 20px;">
      <strong>${customerName}</strong> 대표님, 안녕하세요.<br>
      정책자금 1차 상담 일정이 확정되어 안내드립니다.
    </p>

    <div style="background:#F8FFFE;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #009CA0;">
      <h3 style="margin:0 0 14px;font-size:15px;color:#1E293B;font-weight:700;">상담 정보</h3>
      <table style="width:100%;font-size:13px;color:#4b5563;">
        <tr><td style="padding:8px 0;width:120px;color:#64748B;font-weight:600;">상담 일시</td><td style="font-weight:700;color:#009CA0;font-size:14px;">${variables.상담일시}</td></tr>
        <tr><td style="padding:8px 0;color:#64748B;font-weight:600;">상담 장소</td><td style="font-weight:600;color:#1E293B;">${variables.상담장소}</td></tr>
        <tr><td style="padding:8px 0;color:#64748B;font-weight:600;">담당 컨설턴트</td><td style="font-weight:600;color:#1E293B;">${variables.담당컨설턴트명}</td></tr>
        <tr><td style="padding:8px 0;color:#64748B;font-weight:600;">소요 시간</td><td style="font-weight:600;color:#1E293B;">약 40분 ~ 1시간</td></tr>
      </table>
    </div>

    <div style="background:#F8FFFE;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1E293B;font-weight:700;">상담 내용</h3>
      <ul style="margin:0;padding:0 0 0 20px;color:#1E293B;font-size:13px;line-height:1.8;">
        <li>기업 현황 분석</li>
        <li>적합 정책자금 유형 안내</li>
        <li>예상 자금 규모 시뮬레이션</li>
        <li>전체 일정 안내</li>
      </ul>
    </div>

    <div style="background:#E0FEFF;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;color:#007C80;font-weight:700;">준비물 (선택)</h3>
      <p style="margin:0;color:#007C80;font-size:13px;line-height:1.7;">
        사업자등록증 사본, 최근 매출 현황, 기존 대출/보증 현황<br>
        <span style="font-size:12px;color:#64748B;">*준비가 어려우시면 없이 오셔도 됩니다</span>
      </p>
    </div>

    <div style="background:#F0F9FF;border:1px dashed #009CA0;border-radius:12px;padding:18px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#007C80;line-height:1.6;text-align:center;">
        <strong>상담은 무료이며, 상담 후 진행 여부는 자유롭게 결정 가능합니다.</strong>
      </p>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="margin:0 0 12px;color:#64748B;font-size:13px;">일정 변경이나 문의 사항이 있으시면 연락 부탁드립니다</p>
      <a href="tel:15339269" style="display:inline-block;background:#009CA0;color:#FFFFFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        1533-9269
      </a>
    </div>
  </div>

  <div style="text-align:center;padding:24px;background:#F8FFFE;border-radius:0 0 16px 16px;border-top:1px solid #E0FEFF;">
    <p style="margin:0;font-weight:700;color:#009CA0;font-size:13px;">BOAS 보아스 경영지원솔루션</p>
    <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">경기도 구리시 | 대표전화 1533-9269</p>
  </div>
</div>`
}

function buildDocumentsEmailHtml(customerName: string, variables: Record<string, string>): string {
  return `
<div style="font-family:'Pretendard',-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#F8FFFE;padding:40px 30px;border-radius:16px 16px 0 0;text-align:center;border-bottom:3px solid #009CA0;">
    <h1 style="color:#009CA0;margin:0;font-size:24px;font-weight:800;">BOAS</h1>
    <p style="color:#64748B;margin:8px 0 0;font-size:13px;">보아스 경영지원솔루션</p>
    <p style="color:#1E293B;margin:16px 0 0;font-size:16px;font-weight:700;">정책자금 심사 서류 안내</p>
  </div>

  <div style="padding:35px 30px;border:1px solid #e5e7eb;border-top:none;">
    <p style="font-size:14px;color:#1E293B;line-height:1.7;margin:0 0 20px;">
      <strong>${customerName}</strong> 대표님, 안녕하세요.<br>
      <strong style="color:#009CA0;">${variables.자금유형}</strong> 신청을 위한 필요 서류를 안내드립니다.
    </p>

    <div style="background:#F8FFFE;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #009CA0;">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1E293B;font-weight:700;">담당 컨설턴트</h3>
      <p style="margin:0;font-size:14px;color:#007C80;font-weight:700;">${variables.담당컨설턴트명}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#64748B;">제출 마감일: <strong style="color:#009CA0;">${variables.제출마감일}</strong></p>
    </div>

    <div style="background:#FFFFFF;border:2px solid #009CA0;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 14px;font-size:15px;color:#009CA0;font-weight:700;">공통 필수 서류 (체크리스트)</h3>
      <div style="font-size:13px;color:#1E293B;line-height:2;">
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 사업자등록증</div>
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 부가가치세 과세표준증명원 (최근 2년)</div>
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 표준재무제표증명원 (최근 3개년)</div>
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 국세 납세증명서</div>
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 지방세 납세증명서</div>
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 4대보험 가입자 명부</div>
        <div style="padding:6px 0;border-bottom:1px solid #F0FDFD;">☐ 대표자 신분증 사본</div>
        <div style="padding:6px 0;">☐ 주주명부 (법인인 경우)</div>
      </div>
    </div>

    <div style="background:#F8FFFE;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1E293B;font-weight:700;">추가 서류 (경우에 따라)</h3>
      <ul style="margin:0;padding:0 0 0 20px;color:#1E293B;font-size:13px;line-height:1.8;">
        <li>급여대장 (최근 3개월)</li>
        <li>임대차계약서</li>
        <li>기존 대출 현황 (잔액증명서)</li>
        <li>설비 견적서 (해당 시)</li>
      </ul>
    </div>

    <div style="background:#E0FEFF;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 10px;font-size:14px;color:#007C80;font-weight:700;">서류 발급처</h3>
      <p style="margin:0;color:#007C80;font-size:13px;line-height:1.7;">
        <strong>홈택스</strong> → 부가세증명, 표준재무제표, 국세납세증명<br>
        <strong>정부24</strong> → 사업자등록증, 지방세납세증명<br>
        <strong>4대보험포털</strong> → 가입자명부
      </p>
    </div>

    <div style="background:#009CA0;color:#FFFFFF;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 12px;font-size:15px;font-weight:700;">보아스가 직접 지원해드리는 부분</h3>
      <ul style="margin:0;padding:0 0 0 20px;font-size:13px;line-height:1.8;">
        <li>사업계획서 준비 지원</li>
        <li>현황분석 보고서 작성</li>
        <li>발표/면접 코칭</li>
        <li>서류 최종 검토</li>
      </ul>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="margin:0 0 12px;color:#64748B;font-size:13px;">서류 준비 중 궁금하신 점은 언제든 연락 주세요</p>
      <a href="tel:15339269" style="display:inline-block;background:#009CA0;color:#FFFFFF;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;">
        1533-9269
      </a>
    </div>
  </div>

  <div style="text-align:center;padding:24px;background:#F8FFFE;border-radius:0 0 16px 16px;border-top:1px solid #E0FEFF;">
    <p style="margin:0;font-weight:700;color:#009CA0;font-size:13px;">BOAS 보아스 경영지원솔루션</p>
    <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">경기도 구리시 | 대표전화 1533-9269</p>
  </div>
</div>`
}

function buildPolicyNewsEmailHtml(customerName: string, variables: Record<string, string>): string {
  return `
<div style="font-family:'Pretendard',-apple-system,system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#F8FFFE;padding:40px 30px;border-radius:16px 16px 0 0;text-align:center;border-bottom:3px solid #009CA0;">
    <h1 style="color:#009CA0;margin:0;font-size:24px;font-weight:800;">BOAS</h1>
    <p style="color:#64748B;margin:8px 0 0;font-size:13px;">보아스 경영지원솔루션</p>
    <div style="display:inline-block;background:#FF6B6B;color:#FFFFFF;padding:4px 12px;border-radius:20px;margin:12px 0 0;font-size:11px;font-weight:700;letter-spacing:0.5px;">NEW POLICY</div>
    <p style="color:#1E293B;margin:8px 0 0;font-size:16px;font-weight:700;">대표님께 맞는 새로운 정책자금 소식입니다</p>
  </div>

  <div style="padding:35px 30px;border:1px solid #e5e7eb;border-top:none;">
    <p style="font-size:14px;color:#1E293B;line-height:1.7;margin:0 0 20px;">
      <strong>${customerName}</strong> 대표님, 안녕하세요.<br>
      귀사에 적합한 신규 정책자금이 공고되어 안내드립니다.
    </p>

    <div style="background:linear-gradient(135deg, #009CA0 0%, #007C80 100%);color:#FFFFFF;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 4px 12px rgba(0,156,160,0.2);">
      <h2 style="margin:0 0 8px;font-size:18px;font-weight:800;">${variables.정책명}</h2>
      <p style="margin:0;font-size:12px;opacity:0.9;">${variables.공고기관}</p>
    </div>

    <div style="background:#F8FFFE;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #009CA0;">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1E293B;font-weight:700;">정책 요약</h3>
      <p style="margin:0;font-size:13px;color:#1E293B;line-height:1.7;">${variables.정책요약}</p>
    </div>

    <div style="background:#FFFFFF;border:2px solid #009CA0;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr style="background:#F8FFFE;">
          <td style="padding:14px 18px;color:#007C80;font-weight:700;font-size:13px;border-bottom:1px solid #E0FEFF;">지원 대상</td>
          <td style="padding:14px 18px;color:#1E293B;font-size:13px;border-bottom:1px solid #E0FEFF;">${variables.지원대상}</td>
        </tr>
        <tr>
          <td style="padding:14px 18px;color:#007C80;font-weight:700;font-size:13px;border-bottom:1px solid #E0FEFF;background:#F8FFFE;">지원 규모</td>
          <td style="padding:14px 18px;color:#1E293B;font-size:13px;border-bottom:1px solid #E0FEFF;font-weight:700;">${variables.지원규모}</td>
        </tr>
        <tr>
          <td style="padding:14px 18px;color:#007C80;font-weight:700;font-size:13px;border-bottom:1px solid #E0FEFF;background:#F8FFFE;">금리 조건</td>
          <td style="padding:14px 18px;color:#009CA0;font-size:13px;border-bottom:1px solid #E0FEFF;font-weight:700;">${variables.금리조건}</td>
        </tr>
        <tr>
          <td style="padding:14px 18px;color:#007C80;font-weight:700;font-size:13px;background:#F8FFFE;">신청 기간</td>
          <td style="padding:14px 18px;color:#FF6B6B;font-size:13px;font-weight:700;">${variables.신청기간}</td>
        </tr>
      </table>
    </div>

    <div style="background:#FFF4ED;border:1px solid #FFD4B8;border-radius:12px;padding:18px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#C85A00;line-height:1.6;">
        <strong>조기 마감될 수 있습니다!</strong> 신청 시 보아스에서 전문적인 상담과 함께 서류 준비를 도와드립니다.
      </p>
    </div>

    <div style="text-align:center;padding:20px 0;">
      <p style="margin:0 0 16px;color:#1E293B;font-size:14px;font-weight:600;">지금 바로 상담 신청하세요</p>
      <a href="tel:15339269" style="display:inline-block;background:#009CA0;color:#FFFFFF;padding:16px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 4px 12px rgba(0,156,160,0.3);">
        상담 신청하기
      </a>
    </div>
  </div>

  <div style="text-align:center;padding:24px;background:#F8FFFE;border-radius:0 0 16px 16px;border-top:1px solid #E0FEFF;">
    <p style="margin:0;font-weight:700;color:#009CA0;font-size:13px;">BOAS 보아스 경영지원솔루션</p>
    <p style="margin:8px 0 0;color:#94A3B8;font-size:11px;">경기도 구리시 | 대표전화 1533-9269</p>
    <p style="margin:12px 0 0;color:#CBD5E1;font-size:10px;">더 이상 정책 소식을 받지 않으시려면 1533-9269로 연락 주세요.</p>
  </div>
</div>`
}

// ─── Template Email Handler ───

async function handleSendEmail(env: Env, body: SendEmailRequest): Promise<Response> {
  const { template, recipients, variables } = body

  if (!template || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (const recipient of recipients) {
    try {
      let html = ''
      let subject = ''

      switch (template) {
        case 'consultation':
          html = buildConsultationEmailHtml(recipient.name, variables)
          subject = '[보아스] 1차 상담 일정이 확정되었습니다'
          break
        case 'documents':
          html = buildDocumentsEmailHtml(recipient.name, variables)
          subject = '[보아스] 정책자금 심사 서류 안내'
          break
        case 'policy-news':
          html = buildPolicyNewsEmailHtml(recipient.name, variables)
          subject = `[보아스] ${variables.정책명} 신규 공고 안내`
          break
        default:
          throw new Error(`Unknown template: ${template}`)
      }

      await sendGmail(env, recipient.email, subject, html)
      sent++

      // Rate limit protection
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      failed++
      errors.push(`${recipient.email}: ${String(error)}`)
    }
  }

  return Response.json({
    success: failed === 0,
    sent,
    failed,
    errors: errors.length > 0 ? errors : undefined,
  })
}

// ─── Consultation Handler ───

async function handleConsultation(env: Env, data: ConsultData): Promise<Response> {
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

  const results = await Promise.allSettled([
    // 1. 텔레그램 알림 (사내)
    sendTelegram(env, data, now),
    // 2. 사내 알림 이메일
    sendGmail(env, env.GMAIL_USER, `[상담신청] ${data.company} - ${data.name} 대표`, buildStaffEmailHtml(data, now)),
    // 3. 고객 확인 이메일
    sendGmail(env, data.email, `[보아스] 상담 접수가 완료되었습니다`, buildCustomerEmailHtml(data, now)),
  ])

  const errors = results
    .map((r, i) => (r.status === 'rejected' ? { index: i, reason: String((r as PromiseRejectedResult).reason) } : null))
    .filter(Boolean)

  return Response.json({
    success: errors.length === 0,
    sent: {
      telegram: results[0].status === 'fulfilled',
      staffEmail: results[1].status === 'fulfilled',
      customerEmail: results[2].status === 'fulfilled',
    },
    errors: errors.length > 0 ? errors : undefined,
  })
}

// ─── Worker Entry ───

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, X-Notify-Secret',
        },
      })
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    // 인증 확인
    const secret = request.headers.get('X-Notify-Secret')
    if (!secret || secret !== env.NOTIFY_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Route based on pathname
    const url = new URL(request.url)
    const pathname = url.pathname

    if (pathname === '/send-email') {
      const body: SendEmailRequest = await request.json()
      return handleSendEmail(env, body)
    } else if (pathname === '/') {
      const data: ConsultData = await request.json()
      return handleConsultation(env, data)
    } else {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
  },
}
