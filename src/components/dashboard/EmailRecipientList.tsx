'use client'

import { useState } from 'react'
import type { EmailRecipient } from '@/lib/email/types'

interface Props {
  recipients: EmailRecipient[]
  selected: Set<string>
  onToggle: (id: string) => void
  onToggleAll: () => void
}

export default function EmailRecipientList({ recipients, selected, onToggle, onToggleAll }: Props) {
  const [search, setSearch] = useState('')

  const filtered = recipients.filter((r) => {
    if (!search) return true
    const q = search.toLowerCase()
    return r.name.toLowerCase().includes(q) || r.company.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">3. 수신자 선택</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAll}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] transition-colors border border-white/[0.08]"
          >
            {selected.size === recipients.length ? '전체 해제' : '전체 선택'}
          </button>
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-[#009CA0]">{selected.size}</span>명 선택됨
          </span>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="기업명, 대표자명 검색..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#009CA0] focus:ring-2 focus:ring-[#009CA0]/10 bg-white/[0.04] transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/[0.06] transition-colors" aria-label="검색어 지우기">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="bg-[#141e33] rounded-2xl border border-white/[0.06] overflow-hidden max-h-[400px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 text-white/[0.1] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">{search ? '검색 결과가 없습니다' : '이메일을 보유한 수신자가 없습니다'}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((r) => {
              const checked = selected.has(r.id)
              return (
                <label key={r.id} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors ${checked ? 'bg-[#009CA0]/5' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(r.id)}
                    className="w-4 h-4 rounded border-white/[0.2] text-[#009CA0] focus:ring-[#009CA0] focus:ring-offset-0 bg-white/[0.06]"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-200 text-sm">{r.company || r.name}</p>
                    <p className="text-xs text-gray-500 truncate">{r.email}</p>
                  </div>
                  {r.phone && <span className="text-xs text-gray-500 hidden sm:block">{r.phone}</span>}
                </label>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
