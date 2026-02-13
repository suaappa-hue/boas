'use client'

import { useEffect, useState, useCallback } from 'react'
import type { EmailTemplate, EmailRecipient } from '@/lib/email/types'
import { buildPreviewHtml, buildPreviewSubject } from '@/lib/email/templates'
import EmailVariableForm from './EmailVariableForm'
import EmailRecipientList from './EmailRecipientList'

interface Props {
  /** 사용할 템플릿 목록 */
  templates: EmailTemplate[]
  /** 수신자 목록을 가져올 API 경로 (기본: /api/leads) */
  recipientsApiUrl?: string
  /** 발송 API 경로 (기본: /api/email/send) */
  sendApiUrl?: string
  /** 수신자 데이터 → EmailRecipient 변환 함수 */
  mapRecipient?: (data: Record<string, string>) => EmailRecipient | null
}

const DEFAULT_MAP = (data: Record<string, string>): EmailRecipient | null => {
  if (!data.Email) return null
  return {
    id: data.id || '',
    email: data.Email,
    name: data.Name || '',
    company: data.Company || '',
    phone: data.Phone || '',
    status: mapStatus(data.Status),
    statusLabel: data.Status || '신규',
  }
}

function mapStatus(status?: string): 'pending' | 'progress' | 'complete' | 'cancel' {
  const map: Record<string, 'pending' | 'progress' | 'complete' | 'cancel'> = {
    신규: 'pending',
    상담중: 'progress',
    완료: 'complete',
    취소: 'cancel',
  }
  return map[status || ''] || 'pending'
}

export default function EmailSender({
  templates,
  recipientsApiUrl = '/api/leads',
  sendApiUrl = '/api/email/send',
  mapRecipient = DEFAULT_MAP,
}: Props) {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sending, setSending] = useState(false)
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number; logs: Array<{ success: boolean; name: string; message: string }> } | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── 수신자 로드 ── */
  const fetchRecipients = useCallback(async () => {
    try {
      const res = await fetch(recipientsApiUrl)
      const data = await res.json()
      if (data.success && data.leads) {
        const mapped = (data.leads as Record<string, string>[])
          .map(mapRecipient)
          .filter((r): r is EmailRecipient => r !== null)
        setRecipients(mapped)
      }
    } catch {
      showToast('error', '수신자 데이터를 불러올 수 없습니다')
    } finally {
      setLoading(false)
    }
  }, [recipientsApiUrl, mapRecipient])

  useEffect(() => {
    fetchRecipients()
  }, [fetchRecipients])

  /* ── 템플릿 선택 시 변수 초기화 ── */
  useEffect(() => {
    if (!selectedTemplate) {
      setVariables({})
      setSelected(new Set())
      return
    }
    const init: Record<string, string> = {}
    for (const f of selectedTemplate.variableKeys) init[f.key] = ''
    setVariables(init)

    if (selectedTemplate.autoSelectAll) {
      setSelected(new Set(recipients.filter((r) => r.email && r.email.includes('@')).map((r) => r.id)))
    } else {
      setSelected(new Set())
    }
  }, [selectedTemplateId, recipients, selectedTemplate])

  /* ── 전체 선택/해제 ── */
  const toggleAll = () => {
    const emailRecipients = recipients.filter((r) => r.email && r.email.includes('@'))
    setSelected(selected.size === emailRecipients.length ? new Set() : new Set(emailRecipients.map((r) => r.id)))
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  /* ── 발송 가능 여부 ── */
  const canSend = selectedTemplate && selected.size > 0 && Object.values(variables).every((v) => v.trim() !== '')

  /* ── Sequential 발송 ── */
  const handleSend = async () => {
    if (!canSend || !selectedTemplate) return

    const recipientList = Array.from(selected)
      .map((id) => recipients.find((r) => r.id === id))
      .filter((r): r is EmailRecipient => r !== null && r !== undefined && !!r.email && r.email.includes('@'))

    if (recipientList.length === 0) {
      showToast('error', '이메일 주소가 유효한 수신자가 없습니다')
      return
    }

    if (!confirm(`${recipientList.length}명에게 이메일을 발송하시겠습니까?`)) return

    setSending(true)
    setSendProgress({ current: 0, total: recipientList.length, logs: [] })

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < recipientList.length; i++) {
      const recipient = recipientList[i]
      const current = i + 1

      try {
        const payload: Record<string, unknown> = {
          template: selectedTemplate.id,
          recipient,
          variables,
        }

        // Custom template의 경우 제목/본문 추가
        if (selectedTemplate.id === 'custom') {
          payload.customSubject = variables['제목']
          payload.customHtml = variables['본문']
        }

        const res = await fetch(sendApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()

        if (data.success) {
          successCount++
          setSendProgress((prev) =>
            prev
              ? {
                  ...prev,
                  current,
                  logs: [...prev.logs, { success: true, name: recipient.name, message: `${recipient.email} - 발송 성공` }],
                }
              : null
          )
        } else {
          failCount++
          setSendProgress((prev) =>
            prev
              ? {
                  ...prev,
                  current,
                  logs: [...prev.logs, { success: false, name: recipient.name, message: `${recipient.email} - ${data.error || '발송 실패'}` }],
                }
              : null
          )
        }
      } catch (err) {
        failCount++
        setSendProgress((prev) =>
          prev
            ? {
                ...prev,
                current,
                logs: [...prev.logs, { success: false, name: recipient.name, message: `${recipient.email} - ${err instanceof Error ? err.message : '발송 실패'}` }],
              }
            : null
        )
      }

      // 300ms 딜레이
      if (i < recipientList.length - 1) {
        await new Promise((r) => setTimeout(r, 300))
      }
    }

    setSending(false)

    if (failCount === 0) {
      showToast('success', `${successCount}건 이메일 발송 완료!`)
    } else {
      showToast(failCount > successCount ? 'error' : 'info', `성공 ${successCount}건, 실패 ${failCount}건`)
    }

    // 3초 후 progress 초기화
    setTimeout(() => setSendProgress(null), 3000)
  }

  /* ── Preview ── */
  const previewRecipient =
    selected.size > 0
      ? recipients.find((r) => selected.has(r.id))
      : {
          id: 'sample',
          name: '홍길동',
          company: '예시기업',
          email: 'example@email.com',
          phone: '010-1234-5678',
        }

  const previewSubject = selectedTemplate && previewRecipient ? buildPreviewSubject(selectedTemplate.id, previewRecipient, variables) : '[보아스] 이메일 제목'
  const previewHtml = selectedTemplate && previewRecipient ? buildPreviewHtml(selectedTemplate.id, previewRecipient, variables) : '<p>템플릿을 선택하세요.</p>'

  /* ── 로딩 ── */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-white/[0.06] rounded-lg" />
        <div className="grid grid-cols-[320px_1fr_380px] gap-5">
          <div className="h-[600px] bg-white/[0.04] rounded-2xl" />
          <div className="h-[600px] bg-white/[0.04] rounded-2xl" />
          <div className="h-[600px] bg-white/[0.04] rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 토스트 */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-up">
          <div
            className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-green-500 text-white' : toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">이메일 발송</h1>
        <p className="text-sm text-gray-500 mt-1">템플릿을 선택하고 수신자를 지정하여 이메일을 발송합니다</p>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr_380px] gap-5">
        {/* LEFT: Recipients */}
        <div className="h-[calc(100vh-280px)] min-h-[500px]">
          <EmailRecipientList recipients={recipients} selected={selected} onToggle={toggleOne} onToggleAll={toggleAll} />
        </div>

        {/* CENTER: Template + Variables */}
        <div className="space-y-5">
          {/* Template Selector */}
          <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#009CA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-white text-sm">템플릿 선택</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t) => {
                const active = selectedTemplateId === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`p-3 rounded-xl border transition-all text-center ${
                      active ? 'bg-[#009CA0]/5 border-[#009CA0] shadow-md shadow-[#009CA0]/10' : 'bg-white/[0.04] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className={`text-2xl mb-2 ${active ? 'text-[#009CA0]' : 'text-gray-400'}`}>{t.icon}</div>
                    <p className="font-semibold text-white text-xs mb-1">{t.name}</p>
                    <p className="text-[10px] text-gray-500">{t.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Variable Form */}
          {selectedTemplate && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#009CA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="font-semibold text-white text-sm">변수 입력</h3>
              </div>
              <EmailVariableForm fields={selectedTemplate.variableKeys} values={variables} onChange={(key, val) => setVariables((prev) => ({ ...prev, [key]: val }))} />
            </div>
          )}

          {/* Send Progress */}
          {sendProgress && (
            <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] p-5">
              <div className="mb-3">
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-[#009CA0] rounded-full transition-all duration-300" style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {sendProgress.current} / {sendProgress.total} 건 발송 중...
                </p>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {sendProgress.logs.map((log, i) => (
                  <div key={i} className={`text-xs flex items-center gap-2 ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                    <span>{log.success ? '✓' : '✗'}</span>
                    <span className="truncate">
                      {log.name} - {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Button */}
          {selectedTemplate && (
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              className="w-full px-6 py-3 rounded-xl bg-[#009CA0] text-white font-semibold text-sm hover:bg-[#008a8e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>발송 중...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {selected.size}명에게 {selectedTemplate.name} 발송
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* RIGHT: Preview */}
        <div className="h-[calc(100vh-280px)] min-h-[500px] bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#009CA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h3 className="font-semibold text-white text-sm">미리보기</h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20">실시간</span>
          </div>

          {/* Meta */}
          <div className="px-5 py-3 bg-white/[0.02] border-b border-white/[0.06] space-y-2 text-xs">
            <div className="flex gap-2">
              <span className="text-gray-500 w-12">From</span>
              <span className="text-gray-300 font-medium">보아스 &lt;noreply@boas-solution.kr&gt;</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-12">To</span>
              <span className="text-gray-300 font-medium">{previewRecipient?.email || '수신자를 선택하세요'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-500 w-12">제목</span>
              <span className="text-gray-300 font-medium">{previewSubject}</span>
            </div>
          </div>

          {/* Preview Body */}
          <div className="flex-1 overflow-y-auto p-5 bg-[#f5f5f5]">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </div>
    </div>
  )
}
