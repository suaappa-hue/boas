'use client'

import { useState } from 'react'
import type { EmailRecipient } from '@/lib/email/types'

interface Props {
  recipients: EmailRecipient[]
  selected: Set<string>
  onToggle: (id: string) => void
  onToggleAll: () => void
}

type FilterType = 'all' | 'pending' | 'progress' | 'email-only'

export default function EmailRecipientList({ recipients, selected, onToggle, onToggleAll }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = recipients.filter((r) => {
    // Filter by status
    if (filter === 'pending' && r.status !== 'pending') return false
    if (filter === 'progress' && r.status !== 'progress') return false
    if (filter === 'email-only' && (!r.email || !r.email.includes('@'))) return false

    // Filter by search
    if (!search) return true
    const q = search.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      (r.email && r.email.toLowerCase().includes(q))
    )
  })

  const statusColors = {
    pending: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    progress: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    complete: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancel: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const statusLabels = {
    pending: '신규',
    progress: '상담중',
    complete: '완료',
    cancel: '취소',
  }

  const hasEmail = (r: EmailRecipient) => r.email && r.email.includes('@')

  return (
    <div className="h-full flex flex-col bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#009CA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          <h3 className="font-semibold text-white text-sm">수신자 선택</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-md bg-[#009CA0]/10 text-[#009CA0] border border-[#009CA0]/20">
          {recipients.length}건
        </span>
      </div>

      {/* Search */}
      <div className="px-5 pt-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 기업명, 이메일 검색..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#009CA0] focus:ring-1 focus:ring-[#009CA0]/20 bg-white/[0.04] transition-all"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="px-5 pb-3 flex gap-1.5 flex-wrap">
        {[
          { value: 'all', label: '전체' },
          { value: 'pending', label: '신규' },
          { value: 'progress', label: '상담중' },
          { value: 'email-only', label: '이메일있는건' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as FilterType)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
              filter === f.value
                ? 'bg-[#009CA0]/10 text-[#009CA0] border-[#009CA0]/30'
                : 'bg-white/[0.04] text-gray-400 border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="w-12 h-12 text-white/[0.1] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-xs">{search ? '검색 결과가 없습니다' : '해당하는 수신자가 없습니다'}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((r) => {
              const checked = selected.has(r.id)
              const emailValid = hasEmail(r)
              return (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                    checked ? 'bg-[#009CA0]/5 border border-[#009CA0]/20' : 'hover:bg-white/[0.02] border border-transparent'
                  } ${!emailValid ? 'opacity-50' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!emailValid}
                    onChange={() => onToggle(r.id)}
                    className="w-4 h-4 mt-0.5 rounded border-white/[0.2] text-[#009CA0] focus:ring-[#009CA0] focus:ring-offset-0 bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-gray-200 text-xs leading-tight">{r.name}</p>
                      {r.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold whitespace-nowrap ${statusColors[r.status]}`}>
                          {statusLabels[r.status]}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mb-0.5">{r.company}</p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {emailValid ? r.email : <span className="text-red-400">이메일 없음</span>}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-gray-500">
          선택 <span className="font-semibold text-[#009CA0]">{selected.size}</span> / {filtered.length}명
        </span>
        <button
          onClick={onToggleAll}
          className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] transition-colors border border-white/[0.08]"
        >
          {selected.size === recipients.length ? '전체 해제' : '전체 선택'}
        </button>
      </div>
    </div>
  )
}
