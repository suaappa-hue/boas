/* ─── 이메일 발송 시스템 공통 타입 ─── */

export interface EmailRecipient {
  id: string
  email: string
  name: string
  company: string
  phone?: string
  status?: 'pending' | 'progress' | 'complete' | 'cancel'
  statusLabel?: string
}

export interface EmailTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  /** 필수 변수 키 목록 */
  variableKeys: VariableField[]
  /** 선택 시 수신자 전체 자동 선택 여부 */
  autoSelectAll?: boolean
}

export interface VariableField {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'date' | 'textarea'
  /** 2-column grid에서 같은 행에 넣을지 여부 */
  halfWidth?: boolean
}

export interface EmailSendPayload {
  template: string
  recipients?: EmailRecipient[] // 배치 발송 (legacy)
  recipient?: EmailRecipient // 단일 발송 (sequential)
  variables: Record<string, string>
  customSubject?: string // custom 템플릿 전용
  customHtml?: string // custom 템플릿 전용
}

export interface EmailSendResult {
  success: boolean
  sent?: number
  failed?: number
  errors?: string[]
  error?: string
}

export interface EmailPreviewData {
  subject: string
  from: string
  to: string
  html: string
}
