'use client'

import { useEffect, useState, useCallback } from 'react'
import type { EmailTemplate, EmailRecipient } from '@/lib/email/types'
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
  if (!data['이메일']) return null
  return {
    id: data.id || '',
    email: data['이메일'],
    name: data['대표자명'] || '',
    company: data['기업명'] || '',
    phone: data['연락처'] || '',
  }
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
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  const showToast = (type: 'success' | 'error', message: string) => {
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

  useEffect(() => { fetchRecipients() }, [fetchRecipients])

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
      setSelected(new Set(recipients.map((r) => r.id)))
    } else {
      setSelected(new Set())
    }
  }, [selectedTemplateId, recipients, selectedTemplate])

  /* ── 전체 선택/해제 ── */
  const toggleAll = () => {
    setSelected(selected.size === recipients.length ? new Set() : new Set(recipients.map((r) => r.id)))
  }
  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  /* ── 발송 가능 여부 ── */
  const canSend = selectedTemplate && selected.size > 0 && Object.values(variables).every((v) => v.trim() !== '')

  /* ── 발송 ── */
  const handleSend = async () => {
    if (!canSend || !selectedTemplate) return
    setSending(true)
    try {
      const recipientList = Array.from(selected).map((id) => recipients.find((r) => r.id === id)!).filter(Boolean)
      const res = await fetch(sendApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate.id, recipients: recipientList, variables }),
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', `${recipientList.length}명에게 이메일을 발송했습니다`)
        setSelectedTemplateId(null)
      } else {
        showToast('error', data.error || '이메일 발송 실패')
      }
    } catch {
      showToast('error', '서버 연결에 실패했습니다')
    } finally {
      setSending(false)
    }
  }

  /* ── 로딩 ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-white/[0.06] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(templates.length)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 토스트 */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-up">
          <div className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {toast.type === 'success' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">이메일 발송</h1>
        <p className="text-sm text-gray-500 mt-1">템플릿을 선택하고 수신자를 지정하여 이메일을 발송합니다.</p>
      </div>

      {/* 1. 템플릿 선택 */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">1. 템플릿 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((t) => {
            const active = selectedTemplateId === t.id
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 text-left ${
                  active
                    ? 'bg-[#009CA0]/5 border-[#009CA0] shadow-md shadow-[#009CA0]/10'
                    : 'bg-[#141e33] border-white/[0.06] hover:border-white/[0.12] hover:shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${active ? 'bg-[#009CA0] text-white' : 'bg-white/[0.06] text-gray-400'}`}>
                  {t.icon}
                </div>
                <p className="font-semibold text-white mb-1">{t.name}</p>
                <p className="text-xs text-gray-500">{t.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. 변수 입력 */}
      {selectedTemplate && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. 변수 입력</h2>
          <EmailVariableForm
            fields={selectedTemplate.variableKeys}
            values={variables}
            onChange={(key, val) => setVariables((prev) => ({ ...prev, [key]: val }))}
          />
        </div>
      )}

      {/* 3. 수신자 선택 */}
      {selectedTemplate && (
        <EmailRecipientList
          recipients={recipients}
          selected={selected}
          onToggle={toggleOne}
          onToggleAll={toggleAll}
        />
      )}

      {/* 발송 바 */}
      {selectedTemplate && (
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 px-6 py-4 bg-[#0d1829] border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {!canSend && selected.size > 0 && <span className="text-yellow-500">모든 필수 변수를 입력해주세요</span>}
              {selected.size === 0 && <span className="text-gray-500">수신자를 선택해주세요</span>}
            </div>
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              className="px-6 py-3 rounded-xl bg-[#009CA0] text-white font-semibold text-sm hover:bg-[#008a8e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
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
                  <span>{selected.size}명에게 {selectedTemplate.name} 발송</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
