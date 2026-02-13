# 관리자 대시보드 이메일 발송 시스템 구축 요청문

> 다른 Next.js 프로젝트에 이메일 발송 기능을 추가할 때 이 프롬프트를 그대로 사용하세요.
> BOAS 프로젝트(F:\pola_homepage\13.26_1th_kimgwangjin_boas)의 구현을 참조 코드로 활용합니다.

---

## 프롬프트

```
관리자 대시보드에 Gmail OAuth2 기반 이메일 발송 시스템을 구축해줘.

### 아키텍처 (3계층)

1. **Cloudflare Worker** (이메일 발송 엔진)
   - Gmail OAuth2 REST API로 메일 발송 (nodemailer 미사용)
   - `POST /` → 기존 알림 핸들러 (텔레그램+이메일)
   - `POST /send-email` → 템플릿 기반 메일 발송
   - 인증: `X-Notify-Secret` 헤더
   - 시크릿: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER, NOTIFY_SECRET

2. **Next.js API Route** (`/api/email/send`)
   - Worker 프록시 (NOTIFY_SECRET으로 인증)
   - 요청: { template: string, recipients: EmailRecipient[], variables: Record<string, string> }

3. **프론트엔드 컴포넌트** (4파일 재사용 구조)

### 컴포넌트 구조 (복사해서 사용)

```
src/
├── lib/email/
│   ├── types.ts          # EmailRecipient, EmailTemplate, VariableField 등 공통 타입
│   └── templates.tsx     # 프로젝트별 템플릿 정의 (이 파일만 교체하면 커스터마이즈)
├── components/dashboard/
│   ├── EmailSender.tsx       # 메인 조합 컴포넌트 (템플릿 선택 + 변수입력 + 수신자 + 발송)
│   ├── EmailVariableForm.tsx # 동적 폼 (halfWidth 2열 지원, text/date/textarea)
│   └── EmailRecipientList.tsx # 체크박스 수신자 목록 (검색, 전체선택)
└── app/(admin)/dashboard/email/
    └── page.tsx          # 1줄 래퍼: <EmailSender templates={EMAIL_TEMPLATES} />
```

### EmailSender Props (커스터마이즈 포인트)

| prop | 기본값 | 설명 |
|------|--------|------|
| templates | 필수 | EmailTemplate[] - 프로젝트별 템플릿 배열 |
| recipientsApiUrl | /api/leads | 수신자 목록 API |
| sendApiUrl | /api/email/send | 발송 API |
| mapRecipient | Airtable Lead → EmailRecipient | 수신자 데이터 변환 함수 |

### 새 프로젝트에서 커스터마이즈하는 방법

1. `src/lib/email/templates.tsx`에서 템플릿 정의 교체
2. Worker의 이메일 HTML 템플릿에서 브랜드 색상/로고/문구 교체
3. `mapRecipient` 함수로 수신자 데이터 형식 맞추기
4. 나머지 컴포넌트는 그대로 재사용

### EmailTemplate 정의 예시

```tsx
{
  id: 'consultation',           // Worker에서 매칭할 키
  name: '1차 상담 안내',         // UI 표시명
  description: '상담 일정 안내',  // UI 설명
  autoSelectAll: false,          // true면 수신자 전체 자동 선택
  icon: <SvgIcon />,             // 카드 아이콘
  variableKeys: [                // 동적 폼 필드 정의
    { key: '상담일시', label: '상담일시', placeholder: '예: 2월 20일', type: 'text' },
    { key: '장소', label: '장소', placeholder: '예: 강남 사무실', type: 'text' },
    { key: '마감일', label: '마감일', placeholder: '', type: 'date' },
    { key: '요약', label: '요약', placeholder: '내용 입력', type: 'textarea' },
    { key: '금액', label: '금액', placeholder: '예: 5천만원', type: 'text', halfWidth: true },
    { key: '기간', label: '기간', placeholder: '예: 3개월', type: 'text', halfWidth: true },
  ],
}
```

### Worker 이메일 템플릿 HTML 스타일 규칙

- 인라인 CSS만 사용 (이메일 클라이언트 호환)
- Primary Color: 프로젝트 메인 컬러로 교체
- 폰트: Pretendard, -apple-system, system-ui, sans-serif
- 구조: Header(로고+제목) → Body(내용 카드들) → CTA(전화버튼) → Footer(회사정보)
- 반응형: max-width:600px, 모바일 대응

### Gmail API Rate Limit

- 일반 Gmail: 500건/24시간
- Google Workspace: 2,000건/24시간
- Worker에서 순차 발송 (100ms 딜레이)

### 참조 구현 위치

BOAS 프로젝트에서 전체 작동 코드 확인 가능:
- Worker: workers/sejin-notify/src/index.ts
- API: src/app/api/email/send/route.ts
- 컴포넌트: src/components/dashboard/Email*.tsx
- 타입/템플릿: src/lib/email/
- 사이드바 메뉴: src/components/dashboard/Sidebar.tsx (이메일 발송 항목)
- 모바일 네비: src/components/dashboard/MobileBottomNav.tsx (메일 탭)

### 다크 테마 스타일 (대시보드)

- 배경: bg-[#0d1829]
- 카드: bg-[#141e33] border-white/[0.06]
- 선택됨: border-[프라이머리] bg-[프라이머리]/5
- 인풋: bg-white/[0.04] border-white/[0.08] focus:border-[프라이머리]
- 텍스트: text-white, text-gray-200, text-gray-500
```
```

---

## 체크리스트 (새 프로젝트 적용 시)

- [ ] Google Cloud Console에서 OAuth2 클라이언트 생성
- [ ] OAuth Playground에서 refresh_token 발급
- [ ] Cloudflare Worker 시크릿 설정 (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_USER, NOTIFY_SECRET)
- [ ] Worker 배포
- [ ] `.env.local`에 NOTIFY_SECRET 추가
- [ ] 컴포넌트 4파일 + 타입/템플릿 2파일 복사
- [ ] API route 생성 (`/api/email/send`)
- [ ] 사이드바/네비에 메뉴 추가
- [ ] 템플릿 내용 프로젝트에 맞게 교체
